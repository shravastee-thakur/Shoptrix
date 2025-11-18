import express from "express";
import {
  ChangePassword,
  ForgetPassword,
  LoginStepOne,
  Logout,
  RefreshTokenHandler,
  Register,
  ResetPassword,
  VerifyEmail,
  verifyLogin,
} from "../controllers/UserController.js";
import {
  loginValidation,
  otpValidation,
  registerValidation,
} from "../utils/joiValidation.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerValidation, Register);
router.post("/verify-email", VerifyEmail);
router.post("/loginStepOne", loginValidation, LoginStepOne);
router.post("/verify-login", otpValidation, verifyLogin);
router.post("/refresh-handler", RefreshTokenHandler);
router.post("/change-password", authenticate, ChangePassword);
router.post("/forgot-password", ForgetPassword);
router.post("/reset-password", ResetPassword);
router.post("/logout", authenticate, Logout);

export default router;
