import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import logger from "./utils/logger.js";
import userRoutes from "./routes/UserRoute.js";
import productAdminRoutes from "./routes/adminRoute/ProductRoute.js";

const app = express();
connectDb();

const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
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
app.use("/api/v1/user", userRoutes);
// http://localhost:8000/api/v1/user/register
app.use("/api/v1/admin/product", productAdminRoutes);
// http://localhost:8000/api/v1/admin/product/createProduct

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port: http://localhost:${PORT}`);
});
