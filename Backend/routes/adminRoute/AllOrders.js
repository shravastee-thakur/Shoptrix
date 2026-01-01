import express from "express";

import allowRole from "../../middlewares/roleMiddleware.js";

import { authenticate } from "../../middlewares/authMiddleware.js";
import { getAllOrders } from "../../controllers/product/OrderController.js";

const router = express.Router();

router.get("/getAllOrders", authenticate, allowRole("admin"), getAllOrders);

export default router;
