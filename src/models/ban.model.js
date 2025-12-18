import  { model } from 'mongoose';
import { Schema } from 'mongoose';

const ipBanSchema = new Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      index: true
    },
    bannedAt: {
      type: Date,
      required: true
    },
    banExpiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    },
    reason: {
      type: String,
      default: 'Rate limit exceeded'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default model('IpBan', ipBanSchema);
