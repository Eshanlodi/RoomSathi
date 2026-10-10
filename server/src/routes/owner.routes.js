import { Router } from "express";
import { Room } from "../models/room.model.js";
import { Wishlist } from "../models/wishlist.model.js";
import { VisitRequest } from "../models/visit-request.model.js";
import { RoomView } from "../models/room-view.model.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("owner", "admin"));

router.get("/dashboard-stats", async (req, res, next) => {
  try {
    const roomFilter =
      req.user.role === "admin" && req.query.ownerId
        ? { ownerId: req.query.ownerId }
        : { ownerId: req.user._id };
    const rooms = await Room.find(roomFilter, "_id verified").lean();
    const roomIds = rooms.map((room) => room._id);
    const [views, interestedStudents, bookingRequests] = await Promise.all([
      RoomView.countDocuments({ roomId: { $in: roomIds } }),
      Wishlist.countDocuments({ roomId: { $in: roomIds } }),
      VisitRequest.countDocuments({ ownerId: req.user._id, status: "pending" }),
    ]);
    return res.json({
      totalViews: views,
      totalRooms: rooms.length,
      activeRooms: rooms.filter((room) => room.verified).length,
      interestedStudents,
      bookingRequests,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
