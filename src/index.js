import express from "express";

import dotenv from "dotenv";
import { rateLimiter } from "./middleware/ratelimit.middleware.js";
import { StatusCodes } from "http-status-codes";
import { connectDB } from "./config/db.js";
import { requestLogger } from "./middleware/request.middleware.js";
import { cleanupExpiredBans } from "./middleware/clearBan.middleware.js";

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(requestLogger)
app.use(rateLimiter)

app.get("/", (req, res) => {
  console.log("home route hit");
  res.status(StatusCodes.CREATED).json({
    status: "OK",
    message: "Server is running",
  });
});



setInterval(cleanupExpiredBans,60*1000);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
});
app.listen(PORT, async () => {
  console.log(`Port is on ${PORT}`);
  await connectDB()
});
