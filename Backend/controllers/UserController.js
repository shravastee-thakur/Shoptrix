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
import transporter from "../utils/sendMail.js";

export const Register = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { name, email, password } = sanitizeBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await saveOtp(email, otp);

    await saveTempUser(email, { name, email, password });

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

export const verifyEmail = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { email, otp } = sanitizeBody;

    console.log("Verification attempt:", { email, otp });

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const storedOtp = await getOtp(email);
    console.log("Stored OTP:", storedOtp);

    if (!storedOtp) {
      return res.status(410).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    console.log("Comparing:", {
      input: otp,
      stored: storedOtp,
      typeInput: typeof otp,
      typeStored: typeof storedOtp,
    });

    if (String(storedOtp) !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const storedUser = await getTempUser(email);
    console.log("Stored user:", storedUser);

    if (!storedUser) {
      return res.status(410).json({
        success: false,
        message: "Registration session expired. Please register again.",
      });
    }

    const { name, password } = storedUser;

    const user = await User.create({
      name,
      email,
      password,
      isVerified: true,
    });

    await deleteOtp(email);
    await deleteTempUser(email);

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    logger.error(`Error in login ${error.message}`);
    next(error);
  }
};
