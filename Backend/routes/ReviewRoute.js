import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  addReview,
  getReview,
} from "../controllers/product/ReviewController.js";

const router = express.Router();

router.post("/addReview", authenticate, addReview);
router.get("/getReview/:id", authenticate, getReview);

export default router;
