const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Customer order routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin order routes (accessible directly or via /api/admin/orders)
router.get("/admin", protect, adminOnly, getAllOrders);
router.patch("/admin/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
