import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../controllers/admin/ProductController.js";
import allowRole from "../../middlewares/roleMiddleware.js";
import upload from "../../config/cloudinary.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/createProduct",
  authenticate,
  // allowRole("admin"),
  upload.single("image"),
  createProduct
);
router.put(
  "/updateProduct/:id",
  authenticate,
  // allowRole("admin"),
  upload.single("image"),
  updateProduct
);
router.delete(
  "/deleteProduct/:id",
  authenticate,
  // allowRole("admin"),
  deleteProduct
);

export default router;
