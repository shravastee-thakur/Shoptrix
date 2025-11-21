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
