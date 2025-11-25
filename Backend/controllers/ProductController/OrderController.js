import Order from "../../models/OrderModel.js";
import Cart from "../../models/CartModel.js";
import logger from "../../utils/logger.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const price = item.productId.price;
      const totalItemPrice = price * item.quantity;

      orderItems.push({
        productId: item.productId._id,
        quantity: item.quantity,
        price,
        totalItemPrice,
      });

      totalAmount += totalItemPrice;
    }

    const newOrder = await Order.create({
      userId,
      cartItems: orderItems,
      totalAmount,
    });

    // Clear user cart after order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

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

export const getOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .select("_id createdAt orderStatus totalAmount");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in get order ${error.message}`);
  }
};

// export const getSingleOrder = async (req, res, next) => {
//   try {
//     const orderId = req.params.id;
//     const userId = req.user.id;

//     const order = await Order.findOne({ _id: orderId, userId }).populate(
//       "cartItems.productId",
//       "title image price"
//     );

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     next(error);
//     logger.error(`Error in get single order ${error.message}`);
//   }
// };
