# 👥 Team Task Assignments & Responsibilities

This document defines the team task distribution, module ownership, and GitHub issue assignments for our 4 contributors.

---

## 👥 Contributor Overview & Assignments

| Contributor | GitHub Username | Role & Workstream | Assigned Issue |
| :--- | :--- | :--- | :--- |
| **Uzair Shaikh** | `@uzi612` | Lead & Backend Core (Auth & Database) | [#1](https://github.com/uzi612/E-com/issues/1) |
| **Abhinav Patil** | `@abhinavpatil41` | Backend Catalog & Order APIs | [#2](https://github.com/uzi612/E-com/issues/2) |
| **Anuj Shelke** | `@Anuj-Shelke` | Frontend Storefront & Cart | [#3](https://github.com/uzi612/E-com/issues/3) |
| **Sujeet Sonawane** | `@Sujeet-Sonawane` | Checkout, Order History & Admin Dashboard | [#4](https://github.com/uzi612/E-com/issues/4) |

---

## 📌 Detailed Workstream Breakdown

### 1. @uzi612 — Backend Foundation, Database & Authentication
- **Express Server Setup**: Initialize `/server` with `dotenv`, `cors`, `express.json()`, and modular routes.
- **MongoDB Connection**: Configure Mongoose connection with error handling in `config/db.js`.
- **User Model**: Implement `models/User.js` with `bcryptjs` pre-save password hashing and role (`customer` / `admin`).
- **Auth APIs**:
  - `POST /api/auth/register` (Validate email, min 6 char password, match password).
  - `POST /api/auth/login` (Verify credentials, issue signed JWT token).
- **Security Middlewares**:
  - `middleware/authMiddleware.js` (Verify JWT token and attach user).
  - `middleware/adminMiddleware.js` (Verify admin role access).
  - `middleware/errorMiddleware.js` (Centralized error handler).

---

### 2. @abhinavpatil41 — Backend Catalog, Order APIs & Seeder
- **Mongoose Models**:
  - `models/Category.js` (Name, description).
  - `models/Product.js` (Name, description, price, image, category ref, stock).
  - `models/Order.js` (User ref, products array, totalAmount, shippingAddress, status enum).
- **Category APIs**:
  - `GET /api/categories` (Public).
  - `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id` (Admin only).
- **Product APIs**:
  - `GET /api/products` with query support: `category` & `search`.
  - `GET /api/products/:id` (Single product details).
  - `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` (Admin only).
- **Order APIs & Stock Deduction**:
  - `POST /api/orders`: Validate shipping info, verify stock, recalculate price from DB, deduct stock atomically, create order.
  - `GET /api/orders/my-orders`: Retrieve logged-in customer's orders.
  - `GET /api/admin/orders`: Retrieve all customer orders (Admin only).
  - `PATCH /api/admin/orders/:id/status`: Update status between Pending, Confirmed, Shipped, Delivered, Cancelled.
- **Data Seeder**: Create `server/seeder.js` with initial demo admin, categories, and products.

---

### 3. @Anuj-Shelke — Frontend Foundation, Storefront UI & Cart
- **Client Project Setup**: Initialize `/client` with React 18, Vite, and Tailwind CSS.
- **API & State Layer**:
  - Axios client instance with base URL and JWT request interceptor.
  - `AuthContext.jsx`: Login, register, logout, and token persistence in `localStorage`.
  - `CartContext.jsx`: Cart items in `localStorage`, dynamic subtotal, and stock limit guard.
- **Storefront Components & Layout**:
  - `Navbar.jsx`: Brand logo, navigation links, search, cart item counter badge, auth dropdown.
  - `Footer.jsx`: Clean minimal footer.
  - `ProductCard.jsx` & `ProductGrid.jsx`: Responsive layout, price tag, stock badge, "Add to Cart" button.
  - `CategoryFilter.jsx`: Dynamic category chips with active state.
- **Storefront Pages**:
  - `Home.jsx`: Hero banner and featured products.
  - `Products.jsx`: Keyword search and category filtering.
  - `ProductDetail.jsx`: Product image, full description, price, stock counter, and quantity picker.
  - `Cart.jsx`: Item table, quantity increment/decrement (clamped to available stock), subtotal, remove item, and proceed to checkout.
  - `Login.jsx` & `Register.jsx`: Clean authentication forms with validation.

---

### 4. @Sujeet-Sonawane — Checkout, Customer Orders & Admin Dashboard UI
- **Checkout & Customer Orders**:
  - `Checkout.jsx`: Shipping address form (Name, Phone, Address, City, Pincode), Cash on Delivery option, order summary, and order submission.
  - On submit: Dispatch `POST /api/orders`, clear cart upon success, and navigate to `/my-orders`.
  - `MyOrders.jsx`: Display customer's order history, purchased items list, delivery address, and color-coded status badges (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
- **Admin Dashboard Layout & Navigation**:
  - `AdminSidebar.jsx`: Responsive navigation sidebar for Categories, Products, and Orders.
  - `AdminRoute.jsx`: Route guard restricting access to `user.role === 'admin'`.
- **Admin Management Views**:
  - `AdminCategories.jsx`: Category list table, Add/Edit category modal, and confirmation dialog for deletion.
  - `AdminProducts.jsx`: Products table with thumbnails, stock indicators, Add/Edit modal (with live image preview), and delete confirmation dialog.
  - `AdminOrders.jsx`: Orders overview table, customer information, item snapshot details, and order status dropdown updater.
- **Shared UI Elements**:
  - `Modal.jsx`, `ConfirmDialog.jsx`, `Badge.jsx`, `Loader.jsx`, `Toast.jsx`.

---

## 🔄 Collaboration & Git Workflow

1. Each contributor creates a feature branch from `main`:
   - `@uzi612`: `feature/backend-auth-db`
   - `@abhinavpatil41`: `feature/backend-catalog-orders`
   - `@Anuj-Shelke`: `feature/frontend-storefront-cart`
   - `@Sujeet-Sonawane`: `feature/frontend-checkout-admin`
2. Test changes locally before opening a Pull Request (PR) against `main`.
3. Reference assigned Issue number in commit messages (e.g. `feat: add order checkout api (fixes #2)`).
4. Review and merge via PRs.
