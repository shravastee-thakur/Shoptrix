import Cart from "../../models/CartModel.js";
import Product from "../../models/ProductModel.js";
import logger from "../../utils/logger.js";
import Wishlist from "../../models/WishlistModel.js";

const calculateTotalPrice = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId }).lean();

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return res.status(200).json({
      success: true,
      cart,
      totalPrice: calculateTotalPrice(cart.items),
    });
  } catch (error) {
    logger.error(`Error in get cart ${error.message}`);
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { productId, quantity = 1 } = req.body;

    // 1. Get Product
    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Find or Create Cart in one go
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    const newQty = existingItem ? existingItem.quantity + quantity : quantity;

    // Stock Check
    if (newQty > product.totalStock) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stock" });
    }

    if (existingItem) {
      existingItem.quantity = newQty;
    } else {
      cart.items.push({
        productId,
        quantity,
        title: product.title,
        price: product.price,
        image: product.image?.url,
      });
    }

    await Promise.all([
      cart.save(),
      Wishlist.updateOne({ userId }, { $pull: { products: productId } }),
    ]);

    return res.status(200).json({
      success: true,
      cart,
      totalPrice: calculateTotalPrice(cart.items),
    });
  } catch (error) {
    next(error);
    logger.error(`Error in create cart ${error.message}`);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId)
      .select("totalStock")
      .lean();
    if (quantity > product.totalStock) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stock" });
    }

    const cart = await Cart.findOneAndUpdate(
      { userId, "items.productId": productId },
      { $set: { "items.$.quantity": quantity } }, // Find the item that matches my query, and update ONLY that one.
      { new: true }
    ).lean();


    return res.status(200).json({
      success: true,
      cart,
      totalPrice: calculateTotalPrice(cart.items),
    });
  } catch (error) {
    next(error);
    logger.error(`Error in update cart ${error.message}`);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { items: { productId: req.params.id } } },
      { new: true }
    ).lean();

    return res.status(200).json({
      success: true,
      cart,
      totalPrice: calculateTotalPrice(cart?.items || []),
    });
  } catch (error) {
    next(error);
    logger.error(`Error in remove cart ${error.message}`);
  }
};
