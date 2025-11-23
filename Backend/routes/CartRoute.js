import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} from "../controllers/ProductController/CartController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getCart", authenticate, getCart);
router.post("/addToCart", authenticate, addToCart);
router.delete("/removeFromCart/:id", authenticate, removeFromCart);
router.put("/updateCart", authenticate, updateCart);

export default router;
