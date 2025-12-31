import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    image: {
      url: { type: String },
      public_id: { type: String },
    },

    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    brand: {
      type: String,
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
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
ProductSchema.index({ category: 1, brand: 1, price: 1 });

ProductSchema.index(
  {
    title: "text",
    brand: "text",
    category: "text",
  },
  {
    weights: { title: 10, brand: 5, category: 2 },
    name: "ProductSearchIndex",
  }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
