const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// @desc    Get all products with category filter & search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by Category (can be ObjectId or category name)
    if (category && category !== "all" && category !== "All") {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({
          name: { $regex: new RegExp(`^${category.trim()}$`, "i") },
        });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // If category specified but doesn't exist, return empty
          return res.status(200).json({
            success: true,
            count: 0,
            data: [],
          });
        }
      }
    }

    // Search filter (keyword in name or description)
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const products = await Product.find(query)
      .populate("category", "name description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await Product.findById(req.params.id).populate(
      "category",
      "name description"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !description || price === undefined || !image || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields",
      });
    }

    // Verify category exists
    let categoryDoc;
    if (mongoose.Types.ObjectId.isValid(category)) {
      categoryDoc = await Category.findById(category);
    } else {
      categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${category.trim()}$`, "i") },
      });
    }

    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid category selected",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image: image.trim(),
      category: categoryDoc._id,
      stock: stock !== undefined ? Number(stock) : 0,
    });

    const populatedProduct = await Product.findById(product._id).populate(
      "category",
      "name description"
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const { name, description, price, image, category, stock } = req.body;

    if (name) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (image) product.image = image.trim();
    if (stock !== undefined) product.stock = Number(stock);

    if (category) {
      let categoryDoc;
      if (mongoose.Types.ObjectId.isValid(category)) {
        categoryDoc = await Category.findById(category);
      } else {
        categoryDoc = await Category.findOne({
          name: { $regex: new RegExp(`^${category.trim()}$`, "i") },
        });
      }

      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid category selected",
        });
      }
      product.category = categoryDoc._id;
    }

    const updatedProduct = await product.save();
    const populated = await Product.findById(updatedProduct._id).populate(
      "category",
      "name description"
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
