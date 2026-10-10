import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  },
  { timestamps: true },
);

wishlistSchema.index({ userId: 1, roomId: 1 }, { unique: true });

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
