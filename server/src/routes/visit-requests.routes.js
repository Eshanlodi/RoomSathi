import { Router } from "express";
import { Room } from "../models/room.model.js";
import { Notification } from "../models/notification.model.js";
import { VisitRequest } from "../models/visit-request.model.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.post("/", async (req, res, next) => {
  try {
    const room = await Room.findById(req.body.roomId).populate("ownerId", "name");
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.ownerId._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot request a visit to your own room" });
    }

    const visitRequest = await VisitRequest.create({
      roomId: room._id,
      studentId: req.user._id,
      ownerId: room.ownerId._id,
      preferredDate: req.body.preferredDate,
      message: req.body.message,
    });
    await Notification.create({
      userId: room.ownerId._id,
      type: "booking_request",
      title: "New visit request",
      message: `${req.user.name} requested a visit for ${room.name}`,
      actionUrl: "/owner",
    });
    return res.status(201).json({ visitRequest });
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const filter =
      req.user.role === "owner" ? { ownerId: req.user._id } : { studentId: req.user._id };
    const visitRequests = await VisitRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate("roomId", "name city college rent")
      .populate("studentId", "name email college phone")
      .populate("ownerId", "name email phone");
    return res.json({ visitRequests });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id/status", requireRole("owner", "admin"), async (req, res, next) => {
  try {
    const filter =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, ownerId: req.user._id };
    const visitRequest = await VisitRequest.findOneAndUpdate(
      filter,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!visitRequest) return res.status(404).json({ message: "Visit request not found" });
    await Notification.create({
      userId: visitRequest.studentId,
      type: "booking_status",
      title: `Visit request ${visitRequest.status}`,
      message: `Your visit request status is now ${visitRequest.status}`,
      actionUrl: "/dashboard",
    });
    return res.json({ visitRequest });
  } catch (error) {
    return next(error);
  }
});

export default router;
