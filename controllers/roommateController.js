const Roommate = require("../models/Roommate");
const asyncHandler = require("../utils/asyncHandler");

// Calculates a simple 0-100 compatibility score between two lifestyle objects.
// This is intentionally simple and explainable for a college project viva -
// each matching trait adds points, cleanliness/closeness is scored by distance.
const calculateCompatibility = (a, b) => {
  if (!a || !b) return 0;

  let score = 0;
  const weights = {
    sleepSchedule: 20,
    cleanliness: 20,
    smoking: 15,
    drinking: 15,
    guestsFrequency: 10,
    studyHabits: 10,
    foodPreference: 10,
  };

  if (a.sleepSchedule && a.sleepSchedule === b.sleepSchedule) score += weights.sleepSchedule;
  if (a.smoking === b.smoking) score += weights.smoking;
  if (a.drinking === b.drinking) score += weights.drinking;
  if (a.guestsFrequency && a.guestsFrequency === b.guestsFrequency) score += weights.guestsFrequency;
  if (a.studyHabits && a.studyHabits === b.studyHabits) score += weights.studyHabits;
  if (a.foodPreference && a.foodPreference === b.foodPreference) score += weights.foodPreference;

  if (typeof a.cleanliness === "number" && typeof b.cleanliness === "number") {
    const diff = Math.abs(a.cleanliness - b.cleanliness); // 0 to 4
    score += Math.round(weights.cleanliness * (1 - diff / 4));
  }

  return Math.min(100, score);
};

// @route   POST /api/roommates
// @desc    Create or update the logged-in user's roommate profile
// @access  Private
const upsertRoommateProfile = asyncHandler(async (req, res) => {
  const { college, city, budget, bio, lifestyle, lookingFor } = req.body;

  const profile = await Roommate.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, college, city, budget, bio, lifestyle, lookingFor },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(profile);
});

// @route   GET /api/roommates
// @desc    List roommate profiles, optionally filtered by city/college,
//          each scored for compatibility against the logged-in user's own profile
// @access  Private
const getRoommates = asyncHandler(async (req, res) => {
  const { city, college } = req.query;

  const filter = { isActive: true, user: { $ne: req.user._id } };
  if (city) filter.city = new RegExp(city, "i");
  if (college) filter.college = new RegExp(college, "i");

  const myProfile = await Roommate.findOne({ user: req.user._id });
  const profiles = await Roommate.find(filter).populate("user", "name email avatar");

  const results = profiles
    .map((p) => ({
      ...p.toObject(),
      compatibility: myProfile ? calculateCompatibility(myProfile.lifestyle, p.lifestyle) : null,
    }))
    .sort((a, b) => (b.compatibility ?? 0) - (a.compatibility ?? 0));

  res.json({ count: results.length, roommates: results });
});

// @route   GET /api/roommates/:id
// @access  Private
const getRoommateById = asyncHandler(async (req, res) => {
  const profile = await Roommate.findById(req.params.id).populate("user", "name email avatar");

  if (!profile) {
    return res.status(404).json({ message: "Roommate profile not found" });
  }

  const myProfile = await Roommate.findOne({ user: req.user._id });
  const compatibility = myProfile ? calculateCompatibility(myProfile.lifestyle, profile.lifestyle) : null;

  res.json({ ...profile.toObject(), compatibility });
});

module.exports = { upsertRoommateProfile, getRoommates, getRoommateById };
