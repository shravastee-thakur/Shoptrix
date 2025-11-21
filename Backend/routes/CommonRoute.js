import express from "express";
import {
  getAllProduct,
  getProductById,
} from "../controllers/ProductController/ProductController.js";

const router = express.Router();

router.get("/getAllProduct", getAllProduct);
router.get("/getProductById/:id", getProductById);

export default router;
