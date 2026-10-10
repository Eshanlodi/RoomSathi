import mongoose from "mongoose";

const roommateProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    college: { type: String, trim: true },
    city: { type: String, trim: true },
    budget: { type: Number, min: 0 },
    lifestyle: {
      sleepSchedule: { type: String, enum: ["early_bird", "flexible", "night_owl"] },
      cleanliness: { type: Number, min: 1, max: 5 },
      smoking: Boolean,
      drinking: Boolean,
      guestsFrequency: { type: String, enum: ["rarely", "sometimes", "often"] },
      studyHabits: { type: String, enum: ["silent", "moderate", "flexible"] },
      foodPreference: { type: String, enum: ["veg", "non_veg", "either"] },
    },
  },
  { timestamps: true },
);

export const RoommateProfile = mongoose.model("RoommateProfile", roommateProfileSchema);
