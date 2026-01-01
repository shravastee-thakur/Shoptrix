import Order from "../../models/OrderModel.js";
import logger from "../../utils/logger.js";

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true, runValidators: true }
    ).lean();

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    return res
      .status(200)
      .json({ success: true, message: "Status updated", order });
  } catch (error) {
    next(error);
    logger.error(`Error is update order status ${error.message}`);
  }
};
