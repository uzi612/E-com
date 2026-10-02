const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Create new order (Checkout with COD)
// @route   POST /api/orders
// @access  Private/Customer
const createOrder = async (req, res, next) => {
  try {
    const { items, products: rawProducts, shippingAddress } = req.body;
    const orderItems = items || rawProducts;

    // 1. Validate items array
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // 2. Validate shipping address fields
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide complete shipping address (name, phone, address, city, pincode)",
      });
    }

    // 3. Verify products and stock from database
    const snapshotProducts = [];
    let calculatedTotal = 0;

    for (const item of orderItems) {
      const productId = item.product || item._id;
      const quantity = Number(item.quantity);

      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product identifier in order items",
        });
      }

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Item quantity must be at least 1",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${product.name}'. Available: ${product.stock}, Requested: ${quantity}`,
        });
      }

      calculatedTotal += product.price * quantity;
      snapshotProducts.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image || "",
      });
    }

    // 4. Decrement inventory with rollback safety
    const decrementedItems = [];
    try {
      for (const item of snapshotProducts) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updated) {
          throw new Error(
            `Insufficient stock for product '${item.name}' during concurrent checkout`
          );
        }
        decrementedItems.push({ product: item.product, quantity: item.quantity });
      }
    } catch (stockError) {
      // Rollback any successfully decremented items
      for (const dec of decrementedItems) {
        await Product.findByIdAndUpdate(dec.product, {
          $inc: { stock: dec.quantity },
        });
      }
      return res.status(400).json({
        success: false,
        message: stockError.message,
      });
    }

    // 5. Create Order record
    const order = await Order.create({
      user: req.user._id,
      products: snapshotProducts,
      totalAmount: Math.round(calculatedTotal * 100) / 100,
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
      paymentMethod: "Cash on Delivery",
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in customer order history
// @route   GET /api/orders/my-orders
// @access  Private/Customer
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If changing to Cancelled from a non-cancelled state, restore product stock
    if (status === "Cancelled" && order.status !== "Cancelled") {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
