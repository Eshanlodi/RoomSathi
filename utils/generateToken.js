const jwt = require("jsonwebtoken");

// Creates a signed JWT containing the user's id and role.
// Payload stays small on purpose - just enough to identify the user.
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
