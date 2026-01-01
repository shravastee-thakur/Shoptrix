import Order from "../../models/OrderModel.js";
import Cart from "../../models/CartModel.js";
import logger from "../../utils/logger.js";
import Address from "../../models/AddressModel.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addressId, paymentMethod } = req.body;

    // 1. Get Cart and Address in parallel for speed
    const [cart, shippingAddress] = await Promise.all([
      Cart.findOne({ userId }).lean(),
      Address.findOne({ _id: addressId, userId }).lean(),
    ]);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }
    if (!shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Valid shipping address required" });
    }

    const newOrder = await Order.create({
      userId,
      cartItems: cart.items,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phoneNumber: shippingAddress.phoneNumber,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pinCode: shippingAddress.pinCode,
      },
      totalAmount: cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      paymentMethod: paymentMethod || "stripe",
    });

    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalQuantity: 0 } }
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in create order ${error.message}`);
  }
};

// my order
export const getOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in get order ${error.message}`);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .select("_id createdAt orderStatus totalAmount cartItems")
      .populate("cartItems.productId", "title price")
      .populate("userId", "email");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in get order ${error.message}`);
  }
};
