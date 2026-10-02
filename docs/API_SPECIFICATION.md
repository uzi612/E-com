# 📡 REST API Specification

This document provides the complete API contracts, query parameters, request bodies, response payloads, and HTTP status codes for the **Mini E-Commerce Demo Backend**.

---

## Base URL
```
http://localhost:5000/api
```

## Authentication Header
Protected endpoints require an `Authorization` header containing a valid Bearer token:
```http
Authorization: Bearer <jwt_token_string>
```

---

## 1. Authentication Endpoints

### 1.1 Register Customer
Create a new customer account.

- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secretpassword",
  "confirmPassword": "secretpassword"
}
```
- **Validation**:
  - `name`, `email`, `password`, `confirmPassword` are required.
  - `password === confirmPassword`.
  - `password.length >= 6`.
  - `email` must be valid and unique.
- **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error Response (`400 Bad Request`)**:
```json
{
  "success": false,
  "message": "Email already registered or validation error"
}
```

---

### 1.2 User / Admin Login
Authenticates credentials and returns a JWT token.

- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "secretpassword"
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "customer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error Response (`401 Unauthorized`)**:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 2. Category Endpoints

### 2.1 Get All Categories
Retrieve list of all product categories.

- **Method**: `GET`
- **Route**: `/api/categories`
- **Access**: Public
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "651c10014d5e6f7a8b9c0d21",
      "name": "Electronics",
      "description": "Gadgets, smartphones, and computers",
      "createdAt": "2026-10-02T10:00:00.000Z"
    },
    {
      "_id": "651c10014d5e6f7a8b9c0d22",
      "name": "Fashion",
      "description": "Apparel, footwear, and accessories",
      "createdAt": "2026-10-02T10:05:00.000Z"
    }
  ]
}
```

---

### 2.2 Create Category
Create a new category.

- **Method**: `POST`
- **Route**: `/api/categories`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "name": "Shoes",
  "description": "Athletic and casual footwear"
}
```
- **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "651c10014d5e6f7a8b9c0d23",
    "name": "Shoes",
    "description": "Athletic and casual footwear",
    "createdAt": "2026-10-02T10:10:00.000Z"
  }
}
```

---

### 2.3 Update Category
Edit an existing category.

- **Method**: `PUT`
- **Route**: `/api/categories/:id`
- **Access**: Private (Admin Only)
- **Request Body**:
```json
{
  "name": "Footwear",
  "description": "All kinds of shoes, boots and sandals"
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "651c10014d5e6f7a8b9c0d23",
    "name": "Footwear",
    "description": "All kinds of shoes, boots and sandals",
    "updatedAt": "2026-10-02T10:15:00.000Z"
  }
}
```

---

### 2.4 Delete Category
Remove a category.

- **Method**: `DELETE`
- **Route**: `/api/categories/:id`
- **Access**: Private (Admin Only)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```
- **Error Response (`400 Bad Request`)**:
```json
{
  "success": false,
  "message": "Cannot delete category that contains active products"
}
```

---

## 3. Product Endpoints

### 3.1 Get All Products (Filter & Search)
Fetch products with optional category filtering and search query.

- **Method**: `GET`
- **Route**: `/api/products`
- **Access**: Public
- **Query Parameters**:
  - `category` (optional): Category ID or category slug/name
  - `search` (optional): Case-insensitive keyword search
- **Example**:
  ```http
  GET /api/products?category=651c10014d5e6f7a8b9c0d21&search=phone
  ```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "651d20014d5e6f7a8b9c0d31",
      "name": "Smart Phone Pro X",
      "description": "OLED display with flagship processor and 256GB storage.",
      "price": 899.99,
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "category": {
        "_id": "651c10014d5e6f7a8b9c0d21",
        "name": "Electronics"
      },
      "stock": 15,
      "createdAt": "2026-10-02T10:20:00.000Z"
    }
  ]
}
```

---

### 3.2 Get Single Product by ID
Retrieve full product details.

- **Method**: `GET`
- **Route**: `/api/products/:id`
- **Access**: Public
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "_id": "651d20014d5e6f7a8b9c0d31",
    "name": "Smart Phone Pro X",
    "description": "OLED display with flagship processor and 256GB storage.",
    "price": 899.99,
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    "category": {
      "_id": "651c10014d5e6f7a8b9c0d21",
      "name": "Electronics",
      "description": "Gadgets, smartphones, and computers"
    },
    "stock": 15,
    "createdAt": "2026-10-02T10:20:00.000Z"
  }
}
```
- **Error Response (`404 Not Found`)**:
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 3.3 Create Product
Add a new product to inventory.

- **Method**: `POST`
- **Route**: `/api/products`
- **Access**: Private (Admin Only)
- **Request Body**:
```json
{
  "name": "Wireless Noise Cancelling Headphones",
  "description": "High fidelity audio with 30-hour battery life",
  "price": 199.99,
  "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  "category": "651c10014d5e6f7a8b9c0d21",
  "stock": 25
}
```
- **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "651d20014d5e6f7a8b9c0d32",
    "name": "Wireless Noise Cancelling Headphones",
    "price": 199.99,
    "stock": 25,
    "category": "651c10014d5e6f7a8b9c0d21",
    "createdAt": "2026-10-02T10:30:00.000Z"
  }
}
```

---

### 3.4 Update Product
Update an existing product listing.

- **Method**: `PUT`
- **Route**: `/api/products/:id`
- **Access**: Private (Admin Only)
- **Request Body**:
```json
{
  "price": 179.99,
  "stock": 20
}
```
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "651d20014d5e6f7a8b9c0d32",
    "price": 179.99,
    "stock": 20
  }
}
```

---

### 3.5 Delete Product
Remove a product listing.

- **Method**: `DELETE`
- **Route**: `/api/products/:id`
- **Access**: Private (Admin Only)
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 4. Order Endpoints

### 4.1 Create Order (Checkout)
Place a new Cash on Delivery order.

- **Method**: `POST`
- **Route**: `/api/orders`
- **Access**: Private (Customer / Logged In)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "items": [
    {
      "product": "651d20014d5e6f7a8b9c0d31",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "Jane Doe",
    "phone": "+1 555-0199",
    "address": "456 Market St, Apt 2B",
    "city": "San Francisco",
    "pincode": "94105"
  }
}
```
- **Server Actions**:
  1. Validates that all fields in `shippingAddress` are provided.
  2. Queries products from MongoDB and checks available stock.
  3. Recalculates total price strictly using DB prices.
  4. Deducts product stock in DB.
  5. Creates order with `status: "Pending"`.
- **Success Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "_id": "651e30014d5e6f7a8b9c0d41",
    "user": "651a2b3c4d5e6f7a8b9c0d1e",
    "products": [
      {
        "product": "651d20014d5e6f7a8b9c0d31",
        "name": "Smart Phone Pro X",
        "price": 899.99,
        "quantity": 1
      }
    ],
    "totalAmount": 899.99,
    "shippingAddress": {
      "name": "Jane Doe",
      "phone": "+1 555-0199",
      "address": "456 Market St, Apt 2B",
      "city": "San Francisco",
      "pincode": "94105"
    },
    "paymentMethod": "Cash on Delivery",
    "status": "Pending",
    "createdAt": "2026-10-02T10:45:00.000Z"
  }
}
```
- **Error Response (`400 Bad Request`)**:
```json
{
  "success": false,
  "message": "Insufficient stock for product 'Smart Phone Pro X'"
}
```

---

### 4.2 Get Customer Order History
Retrieve all orders placed by the currently logged-in customer.

- **Method**: `GET`
- **Route**: `/api/orders/my-orders`
- **Access**: Private (Customer)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "651e30014d5e6f7a8b9c0d41",
      "products": [
        {
          "product": "651d20014d5e6f7a8b9c0d31",
          "name": "Smart Phone Pro X",
          "price": 899.99,
          "quantity": 1
        }
      ],
      "totalAmount": 899.99,
      "status": "Pending",
      "createdAt": "2026-10-02T10:45:00.000Z"
    }
  ]
}
```

---

### 4.3 Get All Orders (Admin)
List all customer orders across the platform.

- **Method**: `GET`
- **Route**: `/api/admin/orders`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "651e30014d5e6f7a8b9c0d41",
      "user": {
        "_id": "651a2b3c4d5e6f7a8b9c0d1e",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "products": [
        {
          "product": "651d20014d5e6f7a8b9c0d31",
          "name": "Smart Phone Pro X",
          "price": 899.99,
          "quantity": 1
        }
      ],
      "totalAmount": 899.99,
      "shippingAddress": {
        "name": "Jane Doe",
        "phone": "+1 555-0199",
        "city": "San Francisco"
      },
      "status": "Pending",
      "createdAt": "2026-10-02T10:45:00.000Z"
    }
  ]
}
```

---

### 4.4 Update Order Status (Admin)
Transition order between delivery states.

- **Method**: `PATCH`
- **Route**: `/api/admin/orders/:id/status`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
```json
{
  "status": "Confirmed"
}
```
*(Valid statuses: `Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`)*

- **Success Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Order status updated to Confirmed",
  "data": {
    "_id": "651e30014d5e6f7a8b9c0d41",
    "status": "Confirmed",
    "updatedAt": "2026-10-02T11:00:00.000Z"
  }
}
```
