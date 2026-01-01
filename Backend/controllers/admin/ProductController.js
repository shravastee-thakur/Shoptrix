import Product from "../../models/ProductModel.js";
import logger from "../../utils/logger.js";
import { imageUploadUtil } from "../../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import sanitize from "mongo-sanitize";

export const createProduct = async (req, res, next) => {
  try {
    const body = sanitize(req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const uploadedImg = await imageUploadUtil(req.file.buffer);

    const product = await Product.create({
      ...body,
      image: {
        url: uploadedImg.secure_url,
        public_id: uploadedImg.public_id,
      },
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
    const body = sanitize(req.body);
    const productId = req.params.id;

    const updateData = { ...body };

    if (req.file) {
      const oldProduct = await Product.findById(productId).lean();

      if (oldProduct?.image?.public_id) {
        await cloudinary.uploader.destroy(oldProduct.image.public_id);
      }

      const uploadedImg = await imageUploadUtil(req.file.buffer);
      updateData.image = {
        url: uploadedImg.secure_url,
        public_id: uploadedImg.public_id,
      };
    }

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updateProduct)
      return res.status(404).json({ success: false, message: "Not found" });

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
    const product = await Product.findByIdAndDelete(productId).lean();

    if (product?.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
    logger.error(`Error in delete product ${error.message}`);
  }
};
