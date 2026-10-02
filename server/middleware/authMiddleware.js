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

      if (!token) {
        res.status(401);
        throw new Error("Not authorized, token missing");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next();
    } catch (error) {
      res.status(401);
      next(
        new Error(
          error.name === "TokenExpiredError"
            ? "Not authorized, token expired"
            : error.message || "Not authorized, token failed"
        )
      );
    }
  } else {
    res.status(401);
    next(new Error("Not authorized, no token provided"));
  }
};

module.exports = { protect };
