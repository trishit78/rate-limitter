import  { model } from "mongoose";
import { Schema } from "mongoose";

const ipRequestSchema = new Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    requestCount: {
      type: Number,
      required: true,
    },
    windowStart: {
      type: Date,
      required: true,
    },
    lastRequestAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("IpRequest", ipRequestSchema);
