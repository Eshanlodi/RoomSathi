import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, trim: true },
    rent: { type: Number, required: true, min: 0 },
    deposit: { type: Number, min: 0 },
    city: { type: String, required: true, trim: true },
    college: { type: String, trim: true },
    distance: { type: String, trim: true },
    sharing: { type: String, enum: ["Single", "Double", "Triple"] },
    verified: { type: Boolean, default: false },
    images: [{ type: String, trim: true }],
    facilities: [{ type: String, trim: true }],
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Room = mongoose.model("Room", roomSchema);
