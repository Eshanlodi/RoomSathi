import { Router } from "express";
import { Notification } from "../models/notification.model.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ notifications });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id/read", async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true },
    );
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    return res.json({ notification });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Notification.deleteOne({ _id: req.params.id, userId: req.user._id });
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
