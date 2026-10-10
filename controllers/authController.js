const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");

// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, college, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  // Password gets hashed automatically by the pre-save hook in User model
  const user = await User.create({
    name,
    email,
    password,
    role: role === "owner" ? "owner" : "student", // never trust "admin" from client input
    college,
    phone,
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    college: user.college,
    token,
  });
});

// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // password field has select:false in schema, so explicitly include it here
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id, user.role);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    college: user.college,
    token,
  });
});

// @route   GET /api/auth/me
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  // req.user is set by the "protect" middleware after verifying the JWT
  res.json(req.user);
});

// @route   PUT /api/auth/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, college, phone, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = name ?? user.name;
  user.college = college ?? user.college;
  user.phone = phone ?? user.phone;
  user.avatar = avatar ?? user.avatar;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    college: updatedUser.college,
    phone: updatedUser.phone,
    avatar: updatedUser.avatar,
  });
});

module.exports = { registerUser, loginUser, getProfile, updateProfile };
