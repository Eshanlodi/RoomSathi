import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["student", "owner", "admin"], default: "student" },
    college: { type: String, trim: true },
    address: { type: String, trim: true },
    aadhaar: { type: String, trim: true, select: false },
    avatar: { type: String, trim: true },
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
