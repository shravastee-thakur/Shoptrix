import sanitize from "mongo-sanitize";
import User from "../models/UserModel.js";
import logger from "../utils/logger.js";
import {
  deleteOtp,
  deleteTempUser,
  getOtp,
  getTempUser,
  saveOtp,
  saveTempUser,
} from "../utils/otp.js";
import { rateLimit } from "../utils/rateLimit.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtTokens.js";
import crypto from "crypto";
import {
  deleteResetToken,
  getResetToken,
  saveResetToken,
} from "../utils/resetToken.js";
import sendMail from "../utils/sendMail.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const Register = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { name, email, password, role } = sanitizeBody;

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Error in register ${error.message}`);
    next(error);
  }
};

export const LoginStepOne = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { email, password } = sanitizeBody;

    if (await rateLimit(`login:${req.ip}:${email}`, 3, 300)) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Try again later.",
      });
    }

    const user = await User.login(email, password);

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await saveOtp(email, otp);

    const htmlContent = `
        <p>Login Verification</p>
        <p>Your OTP for login is:</p>
        <h2><strong>${otp}</strong></h2>
        <p>This OTP will expire in 5 minutes.</p>
      `;

    await sendMail(user.email, "Your 2FA Login OTP", htmlContent);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify.",
      userId: user._id,
    });
  } catch (error) {
    logger.error(`Error in login ${error.message}`);
    next(error);
  }
};

export const verifyLogin = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { userId, otp } = sanitizeBody;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or OTP",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const storedOtp = await getOtp(user.email);
    if (!storedOtp || String(storedOtp) !== otp) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid/Expired OTP" });
    }

    await deleteOtp(user.email);

    const newaccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);

    user.refreshToken = newrefreshToken;
    user.isVerified = true;
    await user.save();

    res
      .status(200)
      .cookie("refreshToken", newrefreshToken, cookieOptions)
      .json({
        success: true,
        newaccessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    logger.error(`Error in verify login ${error.message}`);
    next(error);
  }
};

export const RefreshTokenHandler = async (req, res, next) => {
  try {
    const oldToken = req.cookies.refreshToken;
    if (!oldToken)
      return res.status(401).json({ success: false, message: "No token" });

    const decoded = verifyRefreshToken(oldToken);

    const user = await User.findOne(decoded.id);
    if (!user || user.refreshToken !== oldToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);

    user.refreshToken = newrefreshToken;
    await user.save();

    res
      .status(200)
      .cookie("refreshToken", newrefreshToken, cookieOptions)
      .json({
        success: true,
        newAccessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    logger.error(`Error in refresh handler ${error.message}`);
    next(error);
  }
};

export const ChangePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sanitizeBody = sanitize(req.body);
    const { oldPassword, newPassword } = sanitizeBody;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    logger.error(`Error in change password ${error.message}`);
    next(error);
  }
};

export const ForgetPassword = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { email } = sanitizeBody;

    const userExists = await User.findOne({ email }).lean();
    if (!userExists) {
      return res.status(409).json({
        success: false,
        message: "User does not exists",
      });
    }

    if (await rateLimit(`forgot-pw:${req.ip}:${email}`, 3, 300)) {
      return res
        .status(429)
        .json({ success: false, message: "Too many attempts" });
    }

    const resetToken = crypto.randomBytes(10).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await saveResetToken(userExists._id.toString(), hashedToken);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${userExists._id}`;

    const htmlContent = `
        <h2>Password Reset</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${resetLink}" style="padding:10px 15px;background:#4f46e5;color:#fff;   border-radius:4px;text-decoration:none;">
      Verify Email
        </a>
        <p>This link will expire in 5 minutes.</p>
      `;

    await sendMail(email, "Password Reset Request", htmlContent);

    return res.status(201).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    logger.error(`Error in forget password ${error.message}`);
    next(error);
  }
};

export const ResetPassword = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { userId, token, newPassword } = sanitizeBody;
    if (!userId || !token || !newPassword) {
      return res.status(400).json({
        message: "userId, token and newPassword are required.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const storedToken = await getResetToken(userId);
    if (!storedToken) {
      return res.status(400).json({
        success: false,
        message: "Token expired or invalid",
      });
    }

    if (storedToken !== hashedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    await deleteResetToken(userId);
    return res.status(201).json({
      success: true,
      message: "Password has been successfully reset.",
    });
  } catch (error) {
    logger.error(`Error in reset password ${error.message}`);
    next(error);
  }
};

export const Logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: "", isVerified: false }
      );
    }

    res
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json({ success: true, message: "Logged out" });
  } catch (error) {
    logger.error(`Error in logout ${error.message}`);
    next(error);
  }
};
