import { Router } from "express";
import { User } from "../models/user.model.js";
import { Room } from "../models/room.model.js";
import { Review } from "../models/review.model.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({}, "name email role college createdAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json(
      users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        city: "Indore",
        joined: user.createdAt,
        status: "Active",
      })),
    );
  } catch (error) {
    return next(error);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const [students, owners, rooms, reviews] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "owner" }),
      Room.countDocuments(),
      Review.countDocuments(),
    ]);
    return res.json({ students, owners, rooms, reviews, growth: [] });
  } catch (error) {
    return next(error);
  }
});

export default router;
