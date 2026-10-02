const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Order = require("./models/Order");

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "adminpassword123",
    role: "admin",
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    role: "customer",
  },
  {
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
    role: "customer",
  },
];

const categories = [
  {
    name: "Electronics",
    description: "Gadgets, audio devices, smart accessories, and computers",
  },
  {
    name: "Fashion",
    description: "Apparel, streetwear, jackets, and everyday wear",
  },
  {
    name: "Shoes",
    description: "Athletic sneakers, running shoes, boots, and casual footwear",
  },
];

const getProducts = (categoryMap) => [
  {
    name: "Wireless Noise Cancelling Headphones",
    description: "Premium over-ear headphones with 30-hour battery life, active noise cancellation, and ultra-comfortable ear cushions.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: categoryMap["Electronics"],
    stock: 25,
  },
  {
    name: "Smart Watch Ultra GPS",
    description: "High-resolution OLED display with heart rate tracking, titanium case, and 100m water resistance.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: categoryMap["Electronics"],
    stock: 18,
  },
  {
    name: "Mechanical Gaming Keyboard RGB",
    description: "Custom mechanical switches with hot-swappable PCB, RGB backlighting, and aircraft-grade aluminum frame.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    category: categoryMap["Electronics"],
    stock: 40,
  },
  {
    name: "Classic Denim Jacket",
    description: "Vintage washed authentic denim jacket featuring sturdy brass buttons and deep utility pockets.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    category: categoryMap["Fashion"],
    stock: 35,
  },
  {
    name: "Premium Cotton Hoodie",
    description: "Heavyweight 400 GSM brushed fleece cotton hoodie with reinforced seams and relaxed modern silhouette.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
    category: categoryMap["Fashion"],
    stock: 50,
  },
  {
    name: "Minimalist Linen Casual Shirt",
    description: "Breathable pure linen button-up shirt crafted for lightweight comfort and relaxed weekend styling.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    category: categoryMap["Fashion"],
    stock: 30,
  },
  {
    name: "Air Performance Running Sneakers",
    description: "Engineered mesh running shoes with responsive foam cushioning, breathable knit upper, and rugged grip outsole.",
    price: 139.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    category: categoryMap["Shoes"],
    stock: 22,
  },
  {
    name: "Retro Leather Low-Top Sneakers",
    description: "Handcrafted full-grain white leather low-top court sneakers with timeless vintage profile.",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
    category: categoryMap["Shoes"],
    stock: 15,
  },
  {
    name: "All-Terrain Hiking Trail Boots",
    description: "Waterproof leather hiking boots with deep lugged rubber tread and shock-absorbing EVA midsole.",
    price: 169.99,
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80",
    category: categoryMap["Shoes"],
    stock: 12,
  },
];

const importData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/mini-ecommerce"
    );
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log("Existing data cleared.");

    // 1. Insert Users (using User.create so pre-save password hash hook executes)
    const createdUsers = [];
    for (const user of users) {
      const created = await User.create(user);
      createdUsers.push(created);
    }
    console.log(`Created ${createdUsers.length} users (including Admin).`);

    // 2. Insert Categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories.`);

    const categoryMap = {};
    for (const cat of createdCategories) {
      categoryMap[cat.name] = cat._id;
    }

    // 3. Insert Products
    const productsData = getProducts(categoryMap);
    const createdProducts = await Product.insertMany(productsData);
    console.log(`Created ${createdProducts.length} sample products.`);

    console.log("🌱 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/mini-ecommerce"
    );
    console.log("Connected to MongoDB for data purge...");

    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log("💥 All data destroyed successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Error purging data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
