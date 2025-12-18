import geoip from "geoip-lite";
import IpLog from "../models/logs.js";

export async function requestLogger(req, res, next) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const geo = geoip.lookup(ip);

  res.on("finish", async () => {
    try {
      const logs = await IpLog.create({
        ipAddress: ip,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        country: geo?.country,
        city: geo?.city,
        region: geo?.region,
        latitude: geo?.ll?.[0],
        longitude: geo?.ll?.[1],
      });
      console.log("logs", logs);
    } catch (err) {
      console.error("Request log error:", err.message);
    }
  });

  next();
}
