import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    image: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    averageReview: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);
ProductSchema.index({
  title: "text",
  description: "text",
  brand: "text",
  category: "text",
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
