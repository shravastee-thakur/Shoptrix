import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    logger.info("Database connected");
  } catch (error) {
    logger.error(error);
  }
};

export default connectDb;
