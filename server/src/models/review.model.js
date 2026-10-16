import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

reviewSchema.index({ roomId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
