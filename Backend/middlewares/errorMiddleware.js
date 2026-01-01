import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message} \n Stack: ${err.stack}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose CastError (Invalid MongoDB ID)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    message = `${field} already exists. Please use another value.`;
  }

  // Validation error (Mongoose validation)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
