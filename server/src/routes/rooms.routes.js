import { Router } from "express";
import { Room } from "../models/room.model.js";
import { Review } from "../models/review.model.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

function roomId(room) {
  return room._id.toString();
}

async function serializeRoom(room) {
  const [summary, reviews] = await Promise.all([
    Review.aggregate([
      { $match: { roomId: room._id } },
      { $group: { _id: null, rating: { $avg: "$rating" }, reviews: { $sum: 1 } } },
    ]),
    Review.find({ roomId: room._id }).sort({ createdAt: -1 }).limit(3).populate("userId", "name"),
  ]);

  const owner = room.ownerId && typeof room.ownerId === "object" ? room.ownerId : null;
  const stats = summary[0] || {};

  return {
    id: roomId(room),
    _id: roomId(room),
    name: room.name,
    type: room.type,
    rent: room.rent,
    deposit: room.deposit,
    city: room.city,
    college: room.college,
    distance: room.distance,
    sharing: room.sharing,
    verified: room.verified,
    images: room.images,
    facilities: room.facilities,
    description: room.description,
    rating: stats.rating ? Number(stats.rating.toFixed(1)) : 0,
    reviews: stats.reviews || 0,
    owner: owner
      ? { id: owner._id.toString(), name: owner.name, phone: owner.phone, since: owner.createdAt }
      : undefined,
    recentReviews: reviews.map((review) => ({
      id: review._id.toString(),
      name: review.userId?.name || "Anonymous",
      rating: review.rating,
      text: review.text,
      date: review.createdAt,
    })),
  };
}

router.get("/", async (req, res, next) => {
  try {
    const { city, college, budget, verified, sharing, q, facilities, limit } = req.query;
    const filter = {};

    if (city) filter.city = new RegExp(city, "i");
    if (college) filter.college = new RegExp(college, "i");
    if (q) {
      const search = new RegExp(q, "i");
      filter.$or = [{ name: search }, { city: search }, { college: search }];
    }
    if (budget && Number.isFinite(Number(budget))) filter.rent = { $lte: Number(budget) };
    if (verified === "true") filter.verified = true;
    if (sharing) filter.sharing = sharing;
    if (facilities) filter.facilities = { $all: facilities.split(",").filter(Boolean) };

    const query = Room.find(filter)
      .populate("ownerId", "name phone createdAt")
      .sort({ createdAt: -1 });
    if (Number.isFinite(Number(limit)) && Number(limit) > 0) query.limit(Number(limit));
    const rooms = await query;
    return res.json(await Promise.all(rooms.map(serializeRoom)));
  } catch (error) {
    return next(error);
  }
});

router.get("/mine", requireAuth, requireRole("owner", "admin"), async (req, res, next) => {
  try {
    const filter =
      req.user.role === "admin" && req.query.ownerId
        ? { ownerId: req.query.ownerId }
        : { ownerId: req.user._id };
    const rooms = await Room.find(filter)
      .populate("ownerId", "name phone createdAt")
      .sort({ createdAt: -1 });
    return res.json(await Promise.all(rooms.map(serializeRoom)));
  } catch (error) {
    return next(error);
  }
});

router.get("/:roomId/reviews", async (req, res, next) => {
  try {
    const reviews = await Review.find({ roomId: req.params.roomId })
      .sort({ createdAt: -1 })
      .populate("userId", "name");

    return res.json(
      reviews.map((review) => ({
        id: review._id.toString(),
        name: review.userId?.name || "Anonymous",
        rating: review.rating,
        text: review.text,
        date: review.createdAt,
      })),
    );
  } catch (error) {
    return next(error);
  }
});

router.post("/:roomId/reviews", requireAuth, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const review = await Review.create({
      roomId: room._id,
      userId: req.user._id,
      rating: req.body.rating,
      text: req.body.text,
    });

    await review.populate("userId", "name");
    return res.status(201).json({
      review: {
        id: review._id.toString(),
        name: review.userId.name,
        rating: review.rating,
        text: review.text,
        date: review.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("ownerId", "name phone createdAt");
    if (!room) return res.status(404).json({ message: "Room not found" });
    return res.json(await serializeRoom(room));
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, requireRole("owner", "admin"), async (req, res, next) => {
  try {
    const room = await Room.create({ ...req.body, ownerId: req.user._id });
    return res.status(201).json({ room: await serializeRoom(room) });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", requireAuth, requireRole("owner", "admin"), async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (req.user.role !== "admin" && room.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own rooms" });
    }

    const updates = { ...req.body };
    delete updates.ownerId;
    const updatedRoom = await Room.findByIdAndUpdate(room._id, updates, {
      new: true,
      runValidators: true,
    }).populate("ownerId", "name phone createdAt");
    return res.json({ room: await serializeRoom(updatedRoom) });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("owner", "admin"), async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (req.user.role !== "admin" && room.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own rooms" });
    }

    await Promise.all([Room.deleteOne({ _id: room._id }), Review.deleteMany({ roomId: room._id })]);
    return res.json({ message: "Room deleted" });
  } catch (error) {
    return next(error);
  }
});

export default router;
