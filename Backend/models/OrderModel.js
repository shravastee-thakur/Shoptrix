import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    shippingAddress: {
      fullName: String,
      phoneNumber: String,
      address: String,
      city: String,
      state: String,
      pinCode: String,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentMethod: { type: String, default: "stripe" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true },
    transactionId: String,
  },
  { timestamps: true }
);
orderSchema.index({ createdAt: -1, orderStatus: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
