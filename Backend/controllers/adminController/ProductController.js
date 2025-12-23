import Product from "../../models/ProductModel.js";
import logger from "../../utils/logger.js";
import { imageUploadUtil } from "../../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import sanitize from "mongo-sanitize";

export const createProduct = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const {
      title,
      description,
      category,
      brand,
      price,
      totalStock,
      averageReview,
    } = sanitizeBody;

    if (
      !(
        title &&
        description &&
        category &&
        brand &&
        price &&
        totalStock &&
        averageReview
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const uploadedImg = await imageUploadUtil(req.file.buffer);

    const product = await Product.create({
      image: {
        url: uploadedImg.secure_url,
        public_id: uploadedImg.public_id,
      },
      title,
      description,
      category,
      brand,
      price,
      totalStock,
      averageReview,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in create product ${error.message}`);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    let updatedImage = product.image;

    if (req.file) {
      if (product.image && product.image.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      const uploadedImg = await imageUploadUtil(req.file.buffer);
      updatedImage = [
        {
          url: uploadedImg.secure_url,
          public_id: uploadedImg.public_id,
        },
      ];
    }

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title: req.body.title || product.title,
        description: req.body.description || product.description,
        category: req.body.category || product.category,
        brand: req.body.brand || product.brand,
        price: req.body.price || product.price,
        totalStock: req.body.totalStock || product.totalStock,
        averageReview: req.body.averageReview || product.averageReview,
        image: updatedImage,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updateProduct,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in update product ${error.message}`);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    if (product.image && product.image[0]?.public_id) {
      await cloudinary.uploader.destroy(product.image[0].public_id);
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
    logger.error(`Error in delete product ${error.message}`);
  }
};
