const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const app = express();

// Global Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Mini E-Commerce API is operational",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `[Server running]: http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`
    );
  });
}

module.exports = app;
