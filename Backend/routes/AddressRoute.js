import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js";
import {
  createAdderss,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../controllers/AddressController.js";

const router = express.Router();

router.post("/createAddress", authenticate, createAdderss);
router.get("/getAddress", authenticate, getAddress);
router.put("/updateAddress/:id", authenticate, updateAddress);
router.delete("/deleteAddress/:id", authenticate, deleteAddress);

export default router;
