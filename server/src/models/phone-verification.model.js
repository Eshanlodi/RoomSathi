import mongoose from "mongoose";

const phoneVerificationSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    otpHash: { type: String, select: false },
    attempts: { type: Number, default: 0 },
    sentAt: { type: Date, required: true },
    verifiedAt: Date,
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true },
);

export const PhoneVerification = mongoose.model("PhoneVerification", phoneVerificationSchema);
