import Cart from "../../models/CartModel.js";
import Product from "../../models/ProductModel.js";
import logger from "../../utils/logger.js";

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "title price image totalStock"
    );

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      if (item.productId) {
        return total + item.productId.price * item.quantity;
      }
      return total;
    }, 0);

    return res.status(200).json({ success: true, cart, totalPrice });
  } catch (error) {
    next(error);
    logger.error(`Error in get cart ${error.message}`);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const availableStock = product.totalStock;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      if (quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
          availableStock,
        });
      }

      cart = await Cart.create({ userId, items: [{ productId, quantity }] });
      return res.status(201).json({ success: true, cart });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    const newTotalQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (newTotalQuantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available`,
        availableStock,
      });
    }

    // Update or Add item
    if (existingItem) {
      existingItem.quantity = newTotalQuantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
    logger.error(`Error in create cart ${error.message}`);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    const product = await Product.findById(productId);
    if (!product || quantity > product.totalStock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
    logger.error(`Error in update cart ${error.message}`);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
    logger.error(`Error in remove cart ${error.message}`);
  }
};

// export const clearCart = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });
//     }

//     cart.items = [];
//     await cart.save();

//     return res.status(200).json({ success: true, cart });
//   } catch (error) {
//     next(error);
//     logger.error(`Error in clear cart ${error.message}`);
//   }
// };
