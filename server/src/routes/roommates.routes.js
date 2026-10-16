import { Router } from "express";
import { RoommateProfile } from "../models/roommate-profile.model.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scoreMatch(source, candidate) {
  const fields = [
    "sleepSchedule",
    "cleanliness",
    "smoking",
    "drinking",
    "guestsFrequency",
    "studyHabits",
    "foodPreference",
  ];
  const sourceLifestyle = source.lifestyle || {};
  const candidateLifestyle = candidate.lifestyle || {};
  const comparable = fields.filter(
    (field) => sourceLifestyle[field] !== undefined && candidateLifestyle[field] !== undefined,
  );
  const lifestyleScore = comparable.length
    ? comparable.filter((field) => sourceLifestyle[field] === candidateLifestyle[field]).length /
      comparable.length
    : 0;
  const budgetScore =
    source.budget && candidate.budget
      ? Math.max(0, 1 - Math.abs(source.budget - candidate.budget) / source.budget)
      : 0;
  return Math.round((lifestyleScore * 0.7 + budgetScore * 0.3) * 100);
}

function serializeProfile(profile) {
  const user = profile.userId;
  const lifestyle = profile.lifestyle || {};
  const tags = [
    lifestyle.foodPreference === "veg"
      ? "Vegetarian"
      : lifestyle.foodPreference === "non_veg"
        ? "Non-vegetarian"
        : "Flexible food",
    lifestyle.smoking ? "Smoker" : "Non-smoker",
    lifestyle.sleepSchedule === "night_owl"
      ? "Night owl"
      : lifestyle.sleepSchedule === "early_bird"
        ? "Early riser"
        : "Flexible schedule",
    lifestyle.cleanliness >= 4 ? "Very tidy" : lifestyle.cleanliness === 3 ? "Tidy" : "Relaxed",
  ];
  return {
    id: profile._id.toString(),
    userId: user?._id?.toString() || profile.userId.toString(),
    name: user?.name,
    avatar: user?.avatar,
    college: profile.college,
    city: profile.city,
    budget: profile.budget,
    lifestyle,
    tags,
    createdAt: profile.createdAt,
  };
}

router.use(requireAuth);

router.post("/", async (req, res, next) => {
  try {
    const profile = await RoommateProfile.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body, userId: req.user._id },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return res.json({ profile: serializeProfile({ ...profile.toObject(), userId: req.user }) });
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const ownProfile = await RoommateProfile.findOne({ userId: req.user._id });
    const filter = { userId: { $ne: req.user._id } };
    if (req.query.city) filter.city = new RegExp(escapeRegex(req.query.city), "i");
    if (req.query.college) filter.college = new RegExp(escapeRegex(req.query.college), "i");

    const profiles = await RoommateProfile.find(filter)
      .populate({ path: "userId", select: "name avatar role", match: { role: "student" } })
      .limit(50);
    return res.json(
      profiles
        .filter((profile) => profile.userId)
        .map((profile) => ({
          ...serializeProfile(profile),
          matchPercentage: ownProfile ? scoreMatch(ownProfile, profile) : undefined,
        })),
    );
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const profile = await RoommateProfile.findById(req.params.id).populate({
      path: "userId",
      select: "name avatar role",
      match: { role: "student" },
    });
    if (!profile || !profile.userId) {
      return res.status(404).json({ message: "Roommate profile not found" });
    }
    return res.json(serializeProfile(profile));
  } catch (error) {
    return next(error);
  }
});

export default router;
