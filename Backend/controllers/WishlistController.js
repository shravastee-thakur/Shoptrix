import Wishlist from "../models/WishlistModel.js";
import logger from "../utils/logger.js";

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.json({ success: true, message: "Already in wishlist" });
      }
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.json({
      success: true,
      message: "Added to wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in add to wishlist ${error.message}`);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in remove from wishlist ${error.message}`);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId }).populate("products");

    res.json({
      success: true,
      wishlist: wishlist ? wishlist.products : [],
    });
  } catch (error) {
    next(error);
    logger.error(`Error in get wishlist ${error.message}`);
  }
};
