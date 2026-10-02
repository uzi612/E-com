# 🗺️ Project Implementation Roadmap & Milestones

This document details the step-by-step phased execution plan for constructing the **Mini E-Commerce Demo Project**.

---

## 📅 Phased Execution Plan

```
Phase 1: Specs & Architecture (Completed)
   │
   ▼
Phase 2: Backend Core (Database, Models & JWT Authentication)
   │
   ▼
Phase 3: Catalog & Admin CRUD APIs (Categories & Products)
   │
   ▼
Phase 4: Orders & Stock Management (Checkout & Transactions)
   │
   ▼
Phase 5: Frontend Core & Customer Experience (React + Tailwind)
   │
   ▼
Phase 6: Admin Dashboard & Order Management
   │
   ▼
Phase 7: End-to-End Verification, Seeding & Polish
```

---

## Phase 1: Specifications & Documentation (Current)
- [x] Create comprehensive `README.md` with system overview and installation guides.
- [x] Create `docs/ARCHITECTURE.md` detailing token lifecycles and stock decrement logic.
- [x] Create `docs/DATABASE_DESIGN.md` defining Mongoose schemas, relationships, and constraints.
- [x] Create `docs/API_SPECIFICATION.md` defining endpoint contracts and JSON formats.
- [x] Create `docs/FRONTEND_SPECIFICATION.md` detailing routing, UI components, and state.
- [x] Commit and push documentation to GitHub repository.

---

## Phase 2: Backend Core Setup
- [ ] Initialize Express.js application in `/server`.
- [ ] Configure `dotenv`, `cors`, and MongoDB connection via Mongoose.
- [ ] Implement `models/User.js` with `bcryptjs` password hashing.
- [ ] Implement `controllers/authController.js` (Register, Login).
- [ ] Implement `middleware/authMiddleware.js` (JWT verification) and `adminMiddleware.js`.
- [ ] Verify auth routes via Postman / REST Client:
  - `POST /api/auth/register`
  - `POST /api/auth/login`

---

## Phase 3: Catalog & Admin CRUD APIs
- [ ] Implement `models/Category.js` and `models/Product.js`.
- [ ] Implement `categoryController.js` and `categoryRoutes.js` (Public GET, Admin POST/PUT/DELETE).
- [ ] Implement `productController.js` and `productRoutes.js`:
  - `GET /api/products` with category filtering and keyword search.
  - `GET /api/products/:id`
  - Admin CRUD endpoints (`POST`, `PUT`, `DELETE`).
- [ ] Add category dependency validation before product deletion.

---

## Phase 4: Orders & Stock Transaction APIs
- [ ] Implement `models/Order.js`.
- [ ] Implement `orderController.js`:
  - `POST /api/orders` (Stock validation, server price recalculation, stock deduction).
  - `GET /api/orders/my-orders` (Customer order history).
  - `GET /api/admin/orders` (Admin all orders query).
  - `PATCH /api/admin/orders/:id/status` (Status updater).
- [ ] Write database seed script (`server/seeder.js`) with default Admin, Categories, and initial Products.

---

## Phase 5: Client Storefront Development
- [ ] Initialize React + Vite project in `/client`.
- [ ] Configure Tailwind CSS and color theme tokens.
- [ ] Setup Axios client with `baseURL` and Bearer token interceptor.
- [ ] Implement `AuthContext` (JWT token retention in `localStorage`) and `CartContext`.
- [ ] Build reusable UI components: `Navbar`, `Footer`, `Button`, `Modal`, `Toast`.
- [ ] Build Storefront pages:
  - `Home.jsx`
  - `Products.jsx` (with search and category chip filtering)
  - `ProductDetail.jsx` (with stock counter)
  - `Cart.jsx` (with quantity limits)
  - `Checkout.jsx` (Cash on delivery form)
  - `MyOrders.jsx` (Order history card view)
  - `Login.jsx` & `Register.jsx`

---

## Phase 6: Admin Dashboard UI
- [ ] Build `AdminSidebar.jsx` and admin layout.
- [ ] Build Category management view (Table, Create/Edit modal, Delete confirmation).
- [ ] Build Product management view (Table with stock badges, Image preview modal).
- [ ] Build Order management view (Customer info, Item listing, Status dropdown changer).

---

## Phase 7: Verification & Final Polish
- [ ] Run full end-to-end user story walkthrough:
  1. Login as Admin.
  2. Create "Electronics" category and add "Smartphone".
  3. Log out and register new customer.
  4. Find "Smartphone", verify stock limit when adding to cart.
  5. Checkout with Cash on Delivery.
  6. Verify stock decremented in DB.
  7. Check order under "My Orders".
  8. Login as Admin, inspect order and change status to "Delivered".
- [ ] Ensure all responsive views (mobile, tablet, desktop) are smooth and clean.
