const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.route("/").get(getProducts).post(protect, adminOnly, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
