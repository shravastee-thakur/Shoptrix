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
import orderAdminRoutes from "./routes/adminRoute/AllOrders.js";
import productRoutes from "./routes/CommonRoute.js";
import cartRoutes from "./routes/CartRoute.js";
import addressRoutes from "./routes/AddressRoute.js";
import orderRoutes from "./routes/OrderRoute.js";
import wishlistRoute from "./routes/WishlistRoute.js";
import reviewRoute from "./routes/ReviewRoute.js";

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

//user
app.use("/api/v1/user", userRoutes);
// http://localhost:8000/api/v1/user/register
app.use("/api/v1/user/address", addressRoutes);
// http://localhost:8000/api/v1/user/address/createAddress
app.use("/api/v1/user/wishlist", wishlistRoute);
// http://localhost:8000/api/v1/user/wishlist/addToWishlist

// product
app.use("/api/v1/admin/product", productAdminRoutes);
// http://localhost:8000/api/v1/admin/product/createProduct
app.use("/api/v1/product", productRoutes);
// http://localhost:8000/api/v1/product/getAllProduct
app.use("/api/v1/review", reviewRoute);
// http://localhost:8000/api/v1/review/addReview

// cart
app.use("/api/v1/cart", cartRoutes);
// http://localhost:8000/api/v1/cart/getCart

// order
app.use("/api/v1/order", orderRoutes);
// http://localhost:8000/api/v1/order/createOrder
app.use("/api/v1/admin/order", orderAdminRoutes);
// http://localhost:8000/api/v1/admin/order/getAllOrders

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port: http://localhost:${PORT}`);
});
