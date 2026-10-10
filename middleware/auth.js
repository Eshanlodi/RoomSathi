const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects a route: checks for a valid JWT in the Authorization header
// Expected header format: "Authorization: Bearer <token>"
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (without password) to the request object
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please log in again" });
      }
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Restricts a route to specific roles, e.g. authorize("owner", "admin")
// Must be used AFTER protect, since it relies on req.user
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user ? req.user.role : "unknown"}' is not allowed to perform this action`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
