import Product from "../../models/ProductModel.js";
import logger from "../../utils/logger.js";

export const getAllProduct = async (_, res, next) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res
        .status(400)
        .json({ success: false, message: "Products not found" });
    }

    return res.status(201).json({
      success: true,
      message: "Product fetched successfully",
      products,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in get product ${error.message}`);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(201).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in get product by id ${error.message}`);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const q = req.query.q || req.query.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const keywords = q.split(" ").filter((word) => word.trim() !== "");

    const regexConditions = keywords.map((word) => ({
      $or: [
        { title: { $regex: word, $options: "i" } },
        // { description: { $regex: word, $options: "i" } },
        { brand: { $regex: word, $options: "i" } },
        { category: { $regex: word, $options: "i" } },
      ],
    }));

    const products = await Product.find({
      $and: regexConditions,
    });

    return res.status(200).json({
      success: true,
      results: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};
