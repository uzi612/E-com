const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.route("/").get(getCategories).post(protect, adminOnly, createCategory);

router
  .route("/:id")
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

module.exports = router;
