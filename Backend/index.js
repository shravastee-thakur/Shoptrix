import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import logger from "./utils/logger.js";

const app = express();
connectDb();

const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Routes
// app.use("/api/v1/user", )

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port: http://localhost:${PORT}`);
});
