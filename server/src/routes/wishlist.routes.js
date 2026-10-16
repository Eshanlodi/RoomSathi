import { Router } from "express";
import { Wishlist } from "../models/wishlist.model.js";
import { Room } from "../models/room.model.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const entries = await Wishlist.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("roomId");
    return res.json({ wishlists: entries.map((entry) => entry.roomId).filter(Boolean) });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const room = await Room.findById(req.body.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    await Wishlist.create({ userId: req.user._id, roomId: room._id });
    return res.status(201).json({ success: true });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:roomId", async (req, res, next) => {
  try {
    await Wishlist.deleteOne({ userId: req.user._id, roomId: req.params.roomId });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
