import Review from "../../models/ReviewModel.js";
import Product from "../../models/ProductModel.js";
import Order from "../../models/OrderModel.js";
import logger from "../../utils/logger.js";

export const addReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, reviewMessage, reviewValue } = req.body;

    // Check if user purchased this product
    const hasPurchased = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "delivered",
    });

    if (!hasPurchased) {
      return res.status(400).json({
        success: false,
        message: "You can only review products you have purchased.",
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({ userId, productId });
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    // Create the review
    const newReview = await Review.create({
      productId,
      userId,
      reviewMessage,
      reviewValue,
    });

    // Update Product's averageReview
    const reviews = await Review.find({ productId });

    const avg =
      reviews.reduce((sum, r) => sum + Number(r.reviewValue), 0) /
      reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageReview: avg,
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in add review ${error.message}`);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const { id: productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in get review ${error.message}`);
  }
};
