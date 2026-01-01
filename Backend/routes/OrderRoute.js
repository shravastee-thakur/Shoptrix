import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getOrder,
} from "../controllers/product/OrderController.js";

const router = express.Router();

router.post("/createOrder", authenticate, createOrder);
router.get("/getOrder", authenticate, getOrder);

export default router;
