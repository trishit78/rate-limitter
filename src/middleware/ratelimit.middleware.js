import IpRequest from "../models/request.model.js";
import IpBan from "../models/ban.model.js";

const MAX_REQUESTS = 10;
const WINDOW_MS = 5 * 60 * 1000;
const BAN_MS = 15 * 60 * 1000;

export async function rateLimiter(req, res, next) {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const now = new Date();

    const activeBan = await IpBan.findOne({
      ipAddress: ip,
      banExpiresAt: { $gt: now },
    });

    if (activeBan) {
      const r_ms = activeBan.banExpiresAt.getTime() - now.getTime();
      const r_s = Math.ceil(r_ms / 1000);
      const remainingMinutes = Math.ceil(r_s / 60);

      return res
        .status(403)

        .set("Retry-After", r_s.toString())
        .json({
          error: "IP temporarily blocked",
          retryAfterMinutes: remainingMinutes,
        });
    }

    let record = await IpRequest.findOne({ ipAddress: ip });

    if (!record) {
      await IpRequest.create({
        ipAddress: ip,
        requestCount: 1,
        windowStart: now,
        lastRequestAt: now,
      });
      return next();
    }

    const windowExpired =
      now.getTime() - record.windowStart.getTime() > WINDOW_MS;

    if (windowExpired) {
      record.requestCount = 1;
      record.windowStart = now;
      record.lastRequestAt = now;
      await record.save();
      return next();
    }

    record.requestCount += 1;
    record.lastRequestAt = now;
    await record.save();

    if (record.requestCount > MAX_REQUESTS) {
      await IpBan.create({
        ipAddress: ip,
        bannedAt: now,
        banExpiresAt: new Date(now.getTime() + BAN_MS),
        reason: "Rate limit exceeded",
        isActive: true,
      });

      await IpRequest.deleteOne({ ipAddress: ip });

      return res.status(429).json({
        error: "Too many requests. IP banned for 15 minutes.",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    next();
  }
}
