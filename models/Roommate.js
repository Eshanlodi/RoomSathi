const mongoose = require("mongoose");

const roommateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one roommate profile per user
    },
    college: { type: String, required: true },
    city: { type: String, required: true },
    budget: { type: Number, required: true },
    bio: { type: String, maxlength: 500 },
    // Lifestyle quiz answers, each scored 1-5, used for compatibility matching
    lifestyle: {
      sleepSchedule: { type: String, enum: ["early_bird", "night_owl", "flexible"] },
      cleanliness: { type: Number, min: 1, max: 5 }, // 1 = messy, 5 = very clean
      smoking: { type: Boolean, default: false },
      drinking: { type: Boolean, default: false },
      guestsFrequency: { type: String, enum: ["never", "rarely", "sometimes", "often"] },
      studyHabits: { type: String, enum: ["silent", "music", "group_study"] },
      foodPreference: { type: String, enum: ["veg", "non_veg", "either"] },
    },
    lookingFor: { type: String, maxlength: 300 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roommate", roommateSchema);
