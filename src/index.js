import express from "express";

import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

const requestStore = new Map();
const bannedIps = new Map();

const MAX_REQUESTS = 10;
const WINDOW_MS = 5 * 60 * 1000;
const BAN_MS = 15 * 60 * 1000;

app.use((req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const now = Date.now();

  if (bannedIps.has(ip)) {
    const banExpiry = bannedIps.get(ip);

    if (now < banExpiry) {
      return res.status(403).json({
        error: "IP temporarily blocked",
        retryAfter: new Date(banExpiry),
      });
    } else {
      bannedIps.delete(ip);
    }
  }

  const record = requestStore.get(ip);

  if (!record) {
    requestStore.set(ip, {
      count: 1,
      windowStart: now,
    });
    return next();
  }

  if (now - record.windowStart > WINDOW_MS) {
    requestStore.set(ip, {
      count: 1,
      windowStart: now,
    });
    return next();
  }

  record.count += 1;

  if (record.count > MAX_REQUESTS) {
    bannedIps.set(ip, now + BAN_MS);
    requestStore.delete(ip);

    return res.status(429).json({
      error: "Too many requests. IP banned for 15 minutes.",
    });
  }

  next();
});

app.get("/", (req, res) => {
  console.log("home route hit");
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});
app.listen(PORT, () => {
  console.log(`Port is on ${PORT}`);
});
