import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { User } from "../models/user.model.js";
import { PhoneVerification } from "../models/phone-verification.model.js";
import { RoommateProfile } from "../models/roommate-profile.model.js";
import { requireAuth } from "../middleware/auth.js";
import { createToken, serializeUser } from "../utils/auth.js";
import { hashPhoneOtp, normalizeIndianPhone, phoneLookupVariants } from "../utils/phone.js";

const router = Router();
const gmailPattern = /^[^\s@]+@gmail\.com$/i;
const twilioConfig = () => ({
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  serviceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
});

function hasTwilioConfig(config) {
  return Boolean(config.accountSid && config.authToken && config.serviceSid);
}

async function twilioVerifyRequest(path, values) {
  const { accountSid, authToken, serviceSid } = twilioConfig();
  const response = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(values),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Phone verification provider failed");
  return result;
}

router.post("/phone-otp/send", async (req, res, next) => {
  try {
    const phone = normalizeIndianPhone(req.body.phone);
    if (!phone) {
      return res.status(400).json({ message: "Enter a valid 10-digit Indian mobile number" });
    }
    if (await User.exists({ phone: { $in: phoneLookupVariants(phone) } })) {
      return res.status(409).json({ message: "An account already uses this phone number" });
    }

    const now = new Date();
    const existing = await PhoneVerification.findOne({ phone });
    if (existing && now - existing.sentAt < 60_000) {
      return res.status(429).json({ message: "Wait one minute before requesting another code" });
    }

    const config = twilioConfig();
    const anyTwilioConfig = Object.values(config).some(Boolean);
    if (anyTwilioConfig && !hasTwilioConfig(config)) {
      return res
        .status(503)
        .json({ message: "Phone verification provider configuration is incomplete" });
    }
    if (!hasTwilioConfig(config) && process.env.NODE_ENV !== "development") {
      return res.status(503).json({ message: "Phone verification is not configured" });
    }

    const expiresAt = new Date(now.getTime() + 10 * 60_000);
    let developmentCode;
    let otpHash;
    if (hasTwilioConfig(config)) {
      await twilioVerifyRequest("Verifications", { To: phone, Channel: "sms" });
    } else {
      developmentCode = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
      otpHash = hashPhoneOtp(phone, developmentCode);
    }

    const verificationUpdate = {
      $set: { sentAt: now, expiresAt, attempts: 0 },
      $unset: { verifiedAt: 1 },
    };
    if (otpHash) verificationUpdate.$set.otpHash = otpHash;
    else verificationUpdate.$unset.otpHash = 1;
    await PhoneVerification.findOneAndUpdate({ phone }, verificationUpdate, {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });
    return res.json({
      message: "Verification code sent",
      expiresInSeconds: 600,
      ...(developmentCode ? { developmentCode } : {}),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/phone-otp/verify", async (req, res, next) => {
  try {
    const phone = normalizeIndianPhone(req.body.phone);
    const code = typeof req.body.code === "string" ? req.body.code.trim() : "";
    if (!phone || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ message: "Enter a valid mobile number and 6-digit code" });
    }

    const verification = await PhoneVerification.findOneAndUpdate(
      { phone, expiresAt: { $gt: new Date() }, attempts: { $lt: 5 } },
      { $inc: { attempts: 1 } },
      { new: true },
    ).select("+otpHash");
    if (!verification) {
      return res
        .status(400)
        .json({ message: "Code expired or too many attempts; request a new code" });
    }

    const config = twilioConfig();
    if (hasTwilioConfig(config)) {
      const result = await twilioVerifyRequest("VerificationCheck", { To: phone, Code: code });
      if (result.status !== "approved") {
        return res.status(400).json({ message: "The verification code is incorrect or expired" });
      }
    } else {
      const providedHash = Buffer.from(hashPhoneOtp(phone, code), "hex");
      const expectedHash = Buffer.from(verification.otpHash || "", "hex");
      if (
        providedHash.length !== expectedHash.length ||
        !crypto.timingSafeEqual(providedHash, expectedHash)
      ) {
        return res.status(400).json({ message: "The verification code is incorrect or expired" });
      }
    }

    verification.verifiedAt = new Date();
    await verification.save();
    return res.json({ message: "Phone number verified" });
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      college,
      city,
      budget,
      lifestyle,
      role = "student",
      address,
      aadhaar,
      avatar,
    } = req.body;

    const normalizedPhone = normalizeIndianPhone(phone);
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password ||
      !normalizedPhone
    ) {
      return res
        .status(400)
        .json({ message: "Name, email, password, and valid phone are required" });
    }

    if (!gmailPattern.test(email)) {
      return res
        .status(400)
        .json({ message: "Only Gmail addresses ending in @gmail.com are accepted" });
    }

    if (!["student", "owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 8 and 128 characters" });
    }
    if (role === "student") {
      const numericBudget = Number(budget);
      if (
        typeof college !== "string" ||
        !college.trim() ||
        typeof city !== "string" ||
        !city.trim() ||
        !Number.isFinite(numericBudget) ||
        numericBudget < 1000 ||
        numericBudget > 1_000_000
      ) {
        return res.status(400).json({
          message: "College, city, and a monthly budget from ₹1,000 to ₹1,000,000 are required",
        });
      }
    }
    if (
      role === "owner" &&
      (typeof address !== "string" ||
        !address.trim() ||
        typeof aadhaar !== "string" ||
        !/^\d{12}$/.test(aadhaar.replace(/\s/g, "")))
    ) {
      return res.status(400).json({
        message: "A valid 12-digit Aadhaar number and address are required for owner review",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with that email already exists" });
    }
    if (await User.exists({ phone: { $in: phoneLookupVariants(normalizedPhone) } })) {
      return res.status(409).json({ message: "An account already uses this phone number" });
    }

    const phoneVerification = await PhoneVerification.findOneAndDelete({
      phone: normalizedPhone,
      verifiedAt: { $ne: null },
      expiresAt: { $gt: new Date() },
    });
    if (!phoneVerification) {
      return res
        .status(400)
        .json({ message: "Verify your phone number before creating an account" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    let user;
    try {
      user = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        phone: normalizedPhone,
        phoneVerifiedAt: phoneVerification.verifiedAt,
        college: college?.trim(),
        role,
        ownerApprovalStatus: role === "owner" ? "pending" : undefined,
        address,
        aadhaar,
        avatar,
      });
      if (role === "student") {
        await RoommateProfile.create({
          userId: user._id,
          college: college.trim(),
          city: city.trim(),
          budget: Number(budget),
          lifestyle,
        });
      }
    } catch (error) {
      if (user) await User.deleteOne({ _id: user._id });
      throw error;
    }

    if (role === "owner") {
      return res.status(202).json({ message: "Owner request submitted for admin review" });
    }

    return res.status(201).json({ token: createToken(user), user: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");

    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.role === "owner" && user.ownerApprovalStatus === "pending") {
      return res.status(403).json({ message: "Your owner request is awaiting admin approval" });
    }
    if (user.role === "owner" && user.ownerApprovalStatus === "rejected") {
      return res.status(403).json({ message: "Your owner request was not approved" });
    }

    return res.json({ token: createToken(user), user: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select(
      "+passwordResetTokenHash +passwordResetExpiresAt",
    );
    const genericResponse = {
      message: "If that account exists, reset instructions have been created",
    };
    if (!user) return res.json(genericResponse);

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    return res.json({
      ...genericResponse,
      ...(process.env.NODE_ENV === "production" ? {} : { resetToken: token }),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(req.body.token || "")
      .digest("hex");
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("+passwordResetTokenHash +passwordResetExpiresAt");
    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });
    if (
      typeof req.body.password !== "string" ||
      req.body.password.length < 8 ||
      req.body.password.length > 128
    ) {
      return res.status(400).json({ message: "Password must be between 8 and 128 characters" });
    }

    user.password = await bcrypt.hash(req.body.password, 12);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, (req, res) => {
  res.json(serializeUser(req.user));
});

router.put("/me", requireAuth, async (req, res, next) => {
  try {
    const allowedFields = ["name", "email", "college", "address", "avatar"];
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
    );
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json({ user: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
