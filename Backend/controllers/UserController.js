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
import transporter from "../utils/sendMail.js";
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

export const Register = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { name, email, password, role } = sanitizeBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const key = `register:${req.ip}`;
    const isLimited = await rateLimit(key, 3, 300);
    if (isLimited) {
      return res.status(429).json({
        success: false,
        message: "Too many registration attempts. Try again later.",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await saveOtp(email, otp);

    await saveTempUser(email, { name, email, password, role });

    const verifyLink = `${process.env.FRONTEND_URL}/verify?email=${email}&otp=${otp}`;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify your email for account creation",
      html: `
        <h2>Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyLink}" style="padding:10px 15px;background:#4f46e5;color:#fff;   border-radius:4px;text-decoration:none;">
      Verify Email
        </a>
        <p>This link will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message:
        "Verification email sent. Please check your email to complete registration.",
    });
  } catch (error) {
    logger.error(`Error in register ${error.message}`);
    next(error);
  }
};

export const VerifyEmail = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { email, otp } = sanitizeBody;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const storedOtp = await getOtp(email);

    if (!storedOtp) {
      return res.status(410).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    if (String(storedOtp) !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const storedUser = await getTempUser(email);

    if (!storedUser) {
      return res.status(410).json({
        success: false,
        message: "Registration session expired. Please register again.",
      });
    }

    const { name, password, role } = storedUser;

    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: true,
    });

    await deleteOtp(email);
    await deleteTempUser(email);

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    logger.error(`Error in login ${error.message}`);
    next(error);
  }
};

export const LoginStepOne = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { email, password } = sanitizeBody;

    const key = `login:${req.ip}:${email}`;
    const isLimited = await rateLimit(key, 3, 300);
    if (isLimited) {
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Try again later.",
      });
    }

    const user = await User.login(email, password);

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await saveOtp(email, otp);

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Your 2FA Login OTP",
      html: `
        <p>Login Verification</p>
        <p>Your OTP for login is:</p>
        <h2><strong>${otp}</strong></h2>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOption);

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

    const user = await User.findById(userId).select("+isVerified");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const storedOtp = await getOtp(user.email);
    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid",
      });
    }

    if (String(storedOtp) !== otp) {
      return res.status(401).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    await deleteOtp(user.email);

    const newaccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);

    user.refreshToken = newrefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("refreshToken", newrefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        accessToken: newaccessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
  } catch (error) {
    logger.error(`Error in verify login ${error.message}`);
    next(error);
  }
};

export const RefreshTokenHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid Token" });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findOne({ _id: decoded.id, refreshToken: token });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);

    user.refreshToken = newrefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("refreshToken", newrefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        accessToken: newAccessToken,
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
    const { oldPassword, newPassword } = req.body;
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
    const { email } = req.body;

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(409).json({
        success: false,
        message: "User does not exists",
      });
    }

    const key = `forgot-pw:${req.ip}:${email}`;
    const isLimited = await rateLimit(key, 3, 300);
    if (isLimited) {
      return res.status(429).json({
        success: false,
        message: "Too many password reset attempts. Try again later.",
      });
    }

    const resetToken = crypto.randomBytes(10).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await saveResetToken(userExists.id.toString(), hashedToken);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${userExists.id}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${resetLink}" style="padding:10px 15px;background:#4f46e5;color:#fff;   border-radius:4px;text-decoration:none;">
      Verify Email
        </a>
        <p>This link will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

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
    const { userId, token, newPassword } = req.body;
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
    if (!token) return res.sendStatus(204);

    const user = await User.findOne({ refreshToken: token });

    if (user) {
      user.refreshToken = "";
      await user.save();
    }

    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Error in logout ${error.message}`);
    next(error);
  }
};
