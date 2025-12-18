import express from "express";

import dotenv from "dotenv";
import { rateLimiter } from "./middleware/ratelimit.js";
import { StatusCodes } from "http-status-codes";

dotenv.config();
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());


app.use(rateLimiter)

app.get("/", (req, res) => {
  console.log("home route hit");
  res.status(StatusCodes.CREATED).json({
    status: "OK",
    message: "Server is running",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
});
app.listen(PORT, () => {
  console.log(`Port is on ${PORT}`);
});
