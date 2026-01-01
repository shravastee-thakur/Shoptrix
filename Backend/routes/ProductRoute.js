import express from "express";
import {
  getAllProduct,
  getProductById,
  searchProducts,
} from "../controllers/product/ProductController.js";

const router = express.Router();

router.get("/getAllProduct", getAllProduct);
router.get("/getProductById/:id", getProductById);
router.get("/search", searchProducts);

export default router;
