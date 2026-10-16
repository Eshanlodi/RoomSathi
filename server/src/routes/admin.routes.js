import { Router } from "express";
import { User } from "../models/user.model.js";
import { Room } from "../models/room.model.js";
import { Review } from "../models/review.model.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({}, "name email role ownerApprovalStatus college createdAt")
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
        status:
          user.role === "owner" && user.ownerApprovalStatus === "pending"
            ? "Pending approval"
            : user.role === "owner" && user.ownerApprovalStatus === "rejected"
              ? "Rejected"
              : "Active",
      })),
    );
  } catch (error) {
    return next(error);
  }
});

router.get("/owner-requests", async (req, res, next) => {
  try {
    const requests = await User.find(
      { role: "owner", ownerApprovalStatus: "pending" },
      "name email phone address createdAt",
    )
      .sort({ createdAt: 1 })
      .lean();
    return res.json(
      requests.map((request) => ({
        id: request._id.toString(),
        name: request.name,
        email: request.email,
        phone: request.phone,
        address: request.address,
        submittedAt: request.createdAt,
      })),
    );
  } catch (error) {
    return next(error);
  }
});

router.put("/owner-requests/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }
    const owner = await User.findOneAndUpdate(
      { _id: req.params.id, role: "owner", ownerApprovalStatus: "pending" },
      { ownerApprovalStatus: status },
      { new: true, runValidators: true },
    ).select("name email ownerApprovalStatus");
    if (!owner) return res.status(404).json({ message: "Pending owner request not found" });
    return res.json({
      request: {
        id: owner._id.toString(),
        name: owner.name,
        email: owner.email,
        status: owner.ownerApprovalStatus,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const [students, owners, rooms, reviews, pendingOwnerRequests] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "owner" }),
      Room.countDocuments(),
      Review.countDocuments(),
      User.countDocuments({ role: "owner", ownerApprovalStatus: "pending" }),
    ]);
    return res.json({ students, owners, rooms, reviews, pendingOwnerRequests, growth: [] });
  } catch (error) {
    return next(error);
  }
});

export default router;
