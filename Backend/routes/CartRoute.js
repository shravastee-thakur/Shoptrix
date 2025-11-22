import express from "express";
import {
  addToCart,
  // clearCart,
  getCart,
  removeFromCart,
} from "../controllers/ProductController/CartController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getCart", authenticate, getCart);
router.post("/addToCart", authenticate, addToCart);
router.delete("/removeFromCart/:id", authenticate, removeFromCart);
// router.delete("/clearCart", authenticate, clearCart);

export default router;
