import express from "express";
import { Register, verifyEmail } from "../controllers/UserController.js";
import { registerValidation } from "../utils/joiValidation.js";

const router = express.Router();

router.post("/register", registerValidation, Register);
router.post("/verifyEmail", verifyEmail);

export default router;
