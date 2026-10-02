const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    next(new Error("Access denied. Admin resources only."));
  }
};

module.exports = { adminOnly };
