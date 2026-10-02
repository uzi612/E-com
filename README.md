# 🛍️ Mini E-Commerce Demo (MERN Stack)

A lightweight, clean, and fully responsive **Mini E-Commerce Demo Application** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) styled with **Tailwind CSS**.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture & Highlights](#-architecture--highlights)
- [Project Directory Structure](#-project-directory-structure)
- [Key Features](#-key-features)
- [End-to-End Demo Workflow](#-end-to-end-demo-workflow)
- [Documentation Index](#-documentation-index)
- [Environment Configuration](#-environment-configuration)
- [Quick Start Guide](#-quick-start-guide)
- [License](#-license)

---

## 📖 Overview

This project is tailored as a clean, production-grade reference architecture for a functional MERN e-commerce application. It focuses on essential core workflows:
- **Authentication**: JWT token-based login & registration for Customers and Admins with bcrypt password hashing.
- **Admin Management**: Category & Product CRUD, Order Status tracking, and inventory control.
- **Customer Storefront**: Responsive catalog, dynamic search & category filtering, shopping cart with stock limits, and Cash on Delivery (COD) checkout.
- **Transactional Integrity**: Price verification against database records and real-time inventory deduction upon order placement.

---

## 🛠 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18+ (Vite) | Fast, modern client SPA |
| **Styling** | Tailwind CSS | Utility-first responsive styling |
| **Icons & UI** | Lucide React | Modern, lightweight SVG icons |
| **HTTP Client** | Axios | REST API communication with interceptors |
| **Backend** | Node.js + Express.js | Modular RESTful API server |
| **Database** | MongoDB + Mongoose | Document database with ODM schema validation |
| **Security & Auth** | JWT & bcryptjs | Stateless auth tokens & password hashing |

---

## 📐 Architecture & Highlights

```
+-------------------------------------------------------------+
|                      React + Vite (Client)                  |
|  Tailwind CSS | React Router | CartContext | AuthContext    |
+------------------------------+------------------------------+
                               |
                        Axios (REST API)
                               |
+------------------------------v------------------------------+
|                    Node.js + Express Server                 |
|  Auth Middleware | Admin Guard | Controllers | Error Handler|
+------------------------------+------------------------------+
                               |
                        Mongoose ODM
                               |
+------------------------------v------------------------------+
|                        MongoDB Atlas                        |
|        Users  |  Categories  |  Products  |  Orders         |
+-------------------------------------------------------------+
```

### Core Security Rules
1. **Server-Side Price Validation**: Frontend prices are never trusted. Total amounts are recalculated strictly from the database during order creation.
2. **Atomic Stock Decrement**: Stock is checked and subtracted during checkout to prevent negative inventory or race conditions.
3. **Role-Based Access Control (RBAC)**: Protected customer routes require valid JWT tokens; Admin dashboard endpoints require `role === "admin"`.

---

## 📂 Project Directory Structure

```text
/
├── client/                     # React Frontend (Vite)
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── api/                # Axios instance & API service functions
│   │   ├── assets/             # Images & static media
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Buttons, Modals, Loaders, Toasts, Badges
│   │   │   ├── layout/         # Navbar, Footer, AdminSidebar
│   │   │   └── product/        # ProductCard, ProductGrid, Filters
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── pages/              # Public & Admin pages
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── admin/          # Admin Dashboard, Categories, Products, Orders
│   │   ├── App.jsx             # Route definitions
│   │   ├── index.css           # Tailwind directives & theme
│   │   └── main.jsx            # Entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # DB connection (db.js)
│   ├── controllers/            # Request handlers
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── middleware/             # Auth & Admin validation, Error handling
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/                 # Express API routes
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── .env.example
│   ├── server.js               # Express application entry
│   └── package.json
│
├── docs/                       # Project Specifications & Blueprints
│   ├── ARCHITECTURE.md         # System design & security workflows
│   ├── DATABASE_DESIGN.md      # Data schemas, models & relationships
│   ├── API_SPECIFICATION.md    # REST API contracts & payloads
│   ├── FRONTEND_SPECIFICATION.md # UI components, routing & state
│   └── PROJECT_ROADMAP.md      # Step-by-step implementation milestones
│
└── README.md                   # Main Project README
```

---

## 🌟 Key Features

### 1. Customer Storefront
- **Modern Clean UI**: Designed with clean typography, cards, and smooth responsive layouts.
- **Product Catalog**: Live search, category filtering chips, and dynamic product grid.
- **Product Details**: High-resolution image, stock status indicator, pricing, and category tags.
- **Interactive Cart**:
  - Add / remove products.
  - Increment / decrement quantity (hard capped at available product stock).
  - Dynamic subtotal and summary calculations.
- **Cash on Delivery Checkout**: Name, phone, delivery address, city, pincode with instant order dispatch.
- **Order History**: Personal "My Orders" tab displaying order timeline and status badge.

### 2. Admin Dashboard
- **Category Control**: Create, update, delete categories with product association checks.
- **Product Inventory**: Add products with title, image URL, category, pricing, and initial stock.
- **Order Lifecycle Manager**: View customer orders with items, delivery info, and update status:
  - `Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered` (or `Cancelled`).
- **Confirmation Modals**: Dialog protection against accidental product or category deletion.

---

## 🔄 End-to-End Demo Workflow

```text
       [Admin Login]
             │
      [Create Category] ("Electronics", "Fashion")
             │
       [Add Product] (Name, Price, Stock, Image, Category)
             │
      [Product Listed] Available on Public Storefront
             │
  [Customer Register / Login]
             │
      [Browse & Filter] Search by keyword or filter by Category
             │
       [Add to Cart] Validate against live stock
             │
     [Checkout (COD)] Fill shipping address & submit
             │
    [Process Order]
    ├── Validate stock availability
    ├── Recalculate price from MongoDB
    ├── Deduct product stock in DB
    ├── Create Order record with "Pending" status
    └── Clear client-side Cart
             │
    [Admin Dashboard]
    ├── View new incoming order
    └── Advance status: Confirmed ➔ Shipped ➔ Delivered
```

---

## 📚 Documentation Index

For in-depth technical details, consult the documentation in `/docs`:

1. [Architecture & Flows (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md) - Authentication life-cycle, stock deduction logic, and error handling.
2. [Database Design (`docs/DATABASE_DESIGN.md`)](docs/DATABASE_DESIGN.md) - Exact Mongoose models, field data types, constraints, and indexes.
3. [API Specification (`docs/API_SPECIFICATION.md`)](docs/API_SPECIFICATION.md) - Full endpoint reference with sample request/response JSON payloads.
4. [Frontend Specification (`docs/FRONTEND_SPECIFICATION.md`)](docs/FRONTEND_SPECIFICATION.md) - Component hierarchy, route guards, and state management.
5. [Project Roadmap (`docs/PROJECT_ROADMAP.md`)](docs/PROJECT_ROADMAP.md) - Phased implementation guide and verification checklists.
6. [Team Task Assignments (`docs/TASK_ASSIGNMENTS.md`)](docs/TASK_ASSIGNMENTS.md) - Contributor roles, tasks breakdown, and assigned GitHub issues.

---

## ⚙️ Environment Configuration

### Backend (`/server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mini-ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (`/client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Quick Start Guide

> *Note: Follow when development implementation begins.*

### 1. Server Setup
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### 2. Client Setup
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
