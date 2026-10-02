# 🏛️ System Architecture & Workflow Specification

This document details the architectural decisions, authentication lifecycle, security models, transaction workflows, and error handling for the **Mini E-Commerce Demo Project**.

---

## 1. High-Level System Architecture

The application adopts a decoupled client-server architecture:
- **Client (Single Page Application)**: React 18, React Router v6, Tailwind CSS, built via Vite.
- **Server (RESTful API Server)**: Node.js with Express.js providing JSON-based REST endpoints.
- **Persistence Layer**: MongoDB database managed via the Mongoose ODM with connection pooling.

```
       +-------------------------------------------------------------+
       |                         USER CLIENT                         |
       |                (Desktop / Tablet / Mobile)                  |
       +------------------------------+------------------------------+
                                      |
                           HTTP Requests (JSON)
                                      |
       +------------------------------v------------------------------+
       |                      EXPRESS HTTP SERVER                    |
       |                                                             |
       |  +-------------------------------------------------------+  |
       |  |                    Global Middlewares                 |  |
       |  |   - cors()                                            |  |
       |  |   - express.json()                                    |  |
       |  +---------------------------+---------------------------+  |
       |                              |                              |
       |  +---------------------------v---------------------------+  |
       |  |                    Route Dispatcher                   |  |
       |  |  /api/auth  |  /api/categories  |  /api/products      |  |
       |  |  /api/orders|  /api/admin                             |  |
       |  +---------------------------+---------------------------+  |
       |                              |                              |
       |  +---------------------------v---------------------------+  |
       |  |             Authentication & Authorization            |  |
       |  |       [verifyToken] ----> [requireAdminRole]          |  |
       |  +---------------------------+---------------------------+  |
       |                              |                              |
       |  +---------------------------v---------------------------+  |
       |  |                    Controllers                        |  |
       |  |  authController  | categoryController                 |  |
       |  |  productController | orderController                 |  |
       |  +---------------------------+---------------------------+  |
       +------------------------------+------------------------------+
                                      |
                                 Mongoose ODM
                                      |
       +------------------------------v------------------------------+
       |                        MONGODB DATABASE                     |
       |          users | categories | products | orders             |
       +-------------------------------------------------------------+
```

---

## 2. Authentication & Authorization Lifecycle

### 2.1 JWT Workflow
Authentication relies on stateless **JSON Web Tokens (JWT)**.
1. When a user logs in or registers, the server validates credentials (`bcrypt.compare`).
2. If valid, the server signs a JWT payload:
   ```json
   {
     "id": "<user_mongodb_id>",
     "role": "customer" // or "admin"
   }
   ```
3. The token is issued with an expiration (e.g. `7d`) and returned in the JSON response payload.
4. The React client persists the token in `localStorage` and configures Axios to automatically attach it to the `Authorization` header:
   ```
   Authorization: Bearer <token>
   ```

### 2.2 Middleware Stack

#### A. `authMiddleware` (`protect`)
- Extracts the token from `headers.authorization`.
- Verifies token signature and expiration via `jwt.verify(token, JWT_SECRET)`.
- Fetches the active user from MongoDB (excluding password hash) and attaches it to `req.user`.
- Rejects requests with `401 Unauthorized` if token is missing, invalid, or expired.

#### B. `adminMiddleware` (`adminOnly`)
- Executes **after** `authMiddleware`.
- Checks if `req.user.role === 'admin'`.
- Returns `403 Forbidden` if role is not `'admin'`.

```
Incoming Request
      │
      ▼
[authMiddleware]
  ├── Bearer token present? ── No ──► 401 Unauthorized
  ├── Token signature valid? ── No ──► 401 Unauthorized
  └── Attach req.user
      │
      ▼
(Is route Admin Protected?)
  ├── No ──► Proceed to Controller
  └── Yes ─► [adminMiddleware]
               ├── req.user.role === 'admin'?
               │      ├── Yes ─► Proceed to Controller
               │      └── No  ─► 403 Forbidden
```

---

## 3. Order Processing & Inventory Decrement Workflow

A critical requirement of e-commerce systems is **zero client-side trust** for calculations and stock management.

### 3.1 Step-by-Step Order Placement

```text
Client Cart                                                  Backend API
    │                                                             │
    │  POST /api/orders                                          │
    │  { shippingAddress, items: [{ product: id, quantity: n }] } │
    ├────────────────────────────────────────────────────────────►│
    │                                                             │
    │                                                  [1. Validate Request]
    │                                                  Required shipping fields?
    │                                                  Items array non-empty?
    │                                                             │
    │                                                  [2. Fetch Products from DB]
    │                                                  Query MongoDB using product IDs
    │                                                             │
    │                                                  [3. Stock Verification]
    │                                                  For each item:
    │                                                  if (product.stock < item.quantity)
    │                                                    RETURN 400 "Insufficient stock"
    │                                                             │
    │                                                  [4. Server Price Calculation]
    │                                                  itemPrice = dbProduct.price
    │                                                  totalAmount = Σ(itemPrice * qty)
    │                                                             │
    │                                                  [5. Create Order Document]
    │                                                  Status = "Pending"
    │                                                  Payment = "Cash on Delivery"
    │                                                             │
    │                                                  [6. Decrement Stock]
    │                                                  For each item:
    │                                                    Product.findByIdAndUpdate(id, {
    │                                                      $inc: { stock: -quantity }
    │                                                    })
    │                                                             │
    │  201 Created + Order Details                                │
    │◄────────────────────────────────────────────────────────────┤
    │                                                             │
[Clear Cart]
[Navigate to My Orders]
```

### 3.2 Inventory Concurrency & Stock Floor
To prevent negative inventory under concurrent checkouts:
- When updating stock:
  ```javascript
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: item.product, stock: { $gte: item.quantity } },
    { $inc: { stock: -item.quantity } },
    { new: true }
  );
  if (!updatedProduct) {
    throw new Error(`Product ${item.product} went out of stock during checkout`);
  }
  ```
- This ensures stock never drops below zero even under fast repeated clicks.

---

## 4. Error Handling Strategy

### 4.1 Server Error Boundary
All controllers are wrapped with async error handlers (or express-async-errors) to route uncaught rejections to a central `errorMiddleware`:
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
```

### 4.2 Standard API Error Responses
Every API error adheres to a uniform structure:
```json
{
  "success": false,
  "message": "Specific human-readable error description",
  "errors": [] // Optional field validation errors
}
```

### 4.3 Client Error Handling
- **Axios Interceptors**: Listen to `401 Unauthorized` responses and trigger automatic logout / token cleanup in `AuthContext`.
- **Toast Notifications**: Every network failure or validation error renders an unobtrusive toast notification for the user.
- **Form State Validation**: Clear inline error messages for missing fields, mismatched passwords, or negative numbers before network dispatch.

---

## 5. Security & Protection Checklist

1. **Password Safety**: Salted hashes generated with `bcryptjs` with standard salt rounds (`10`). Raw passwords are never persisted or returned in user queries (`select: false`).
2. **CORS Configuration**: Restrict allowed origins to client host (`http://localhost:5173` in development).
3. **No Dynamic Price Trust**: Total amounts calculated strictly from verified database records.
4. **Data Sanitization**: Mongoose schemas enforce data type safety, trim whitespaces, and validate regex patterns for email addresses.
