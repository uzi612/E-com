const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0.01, "Price must be greater than zero"],
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer",
      },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ category: 1 });
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
