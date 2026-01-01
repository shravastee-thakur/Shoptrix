import Wishlist from "../models/WishlistModel.js";
import logger from "../utils/logger.js";

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // { upsert: true } creates the wishlist if it doesn't exist.
    // $addToSet adds the productId ONLY if it isn't already in the array.

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { products: productId } },
      { new: true, upsert: true }
    ).lean();

    return res.status(200).json({
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

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true }
    ).lean();

    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlist: wishlist || { products: [] },
    });
  } catch (error) {
    next(error);
    logger.error(`Error in remove from wishlist ${error.message}`);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId })
      .populate({
        path: "products",
        select: "title price images totalStock",
      })
      .lean();

    res.json({
      success: true,
      wishlist: wishlist ? wishlist.products : [],
    });
  } catch (error) {
    next(error);
    logger.error(`Error in get wishlist ${error.message}`);
  }
};
