import mongoose from "mongoose";

const visitRequestSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    preferredDate: Date,
    message: { type: String, trim: true },
  },
  { timestamps: true },
);

visitRequestSchema.index({ roomId: 1, studentId: 1, status: 1 });

export const VisitRequest = mongoose.model("VisitRequest", visitRequestSchema);
