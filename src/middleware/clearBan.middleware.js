import IpBan from '../models/ban.model.js';

export async function cleanupExpiredBans() {
  const now = new Date();

  const result = await IpBan.deleteMany({
    banExpiresAt: { $lte: now }
  });

  if (result.deletedCount > 0) {
    console.log(`Deleted expired bans: ${result.deletedCount}`);
  }
}
