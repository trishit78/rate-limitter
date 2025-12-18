import { Schema } from 'mongoose';
import { model } from 'mongoose';

const ipLogSchema = new Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      index: true
    },
    method: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    statusCode: {
      type: Number
    },
    country: String,
    city: String,
    region: String,
    latitude: Number,
    longitude: Number,
    isp: String
  },
  {
    timestamps: true
  }
);

export default model('IpLog', ipLogSchema);
