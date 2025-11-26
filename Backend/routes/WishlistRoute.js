import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/WishlistController.js";

const router = express.Router();

router.post("/addToWishlist", authenticate, addToWishlist);
router.get("/getWishlist", authenticate, getWishlist);
router.delete("/removeFromWishlist/:id", authenticate, removeFromWishlist);

export default router;
