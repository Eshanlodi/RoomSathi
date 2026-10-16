import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { User } from "../models/user.model.js";
import { requireAuth } from "../middleware/auth.js";
import { createToken, serializeUser } from "../utils/auth.js";

const router = Router();
const gmailPattern = /^[^\s@]+@gmail\.com$/i;

router.post("/register", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      college,
      role = "student",
      address,
      aadhaar,
      avatar,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!gmailPattern.test(email)) {
      return res
        .status(400)
        .json({ message: "Only Gmail addresses ending in @gmail.com are accepted" });
    }

    if (!["student", "owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with that email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      college,
      role,
      address,
      aadhaar,
      avatar,
    });

    return res.status(201).json({ token: createToken(user), user: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");

    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({ token: createToken(user), user: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select(
      "+passwordResetTokenHash +passwordResetExpiresAt",
    );
    if (!user)
      return res.json({ message: "If that account exists, reset instructions have been created" });

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    return res.json({ message: "Reset token created", resetToken: token });
  } catch (error) {
    return next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(req.body.token || "")
      .digest("hex");
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("+passwordResetTokenHash +passwordResetExpiresAt");
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });
    if (!req.body.password || req.body.password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    user.password = await bcrypt.hash(req.body.password, 12);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json(serializeUser(req.user));
});

router.put("/me", requireAuth, async (req, res, next) => {
  try {
    const allowedFields = ["name", "email", "phone", "college", "address", "avatar"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
    );
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json({ user: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
