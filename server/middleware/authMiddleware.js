const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_jwt_secret_key_12345"
      );

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found with this token",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed or expired",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

module.exports = { protect };
