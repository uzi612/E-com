const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  image: {
    type: String,
    required: false,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Recipient name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Street address is required"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
  },
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
    trim: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (val) => val && val.length > 0,
        "Order must contain at least one item",
      ],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
      immutable: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
        message: "Status must be: Pending, Confirmed, Shipped, Delivered, or Cancelled",
      },
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
