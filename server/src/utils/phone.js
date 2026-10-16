import crypto from "node:crypto";

export function normalizeIndianPhone(value) {
  if (typeof value !== "string") return null;
  const compact = value.trim().replace(/[\s()-]/g, "");
  const match = compact.match(/^(?:\+91)?([6-9]\d{9})$/);
  return match ? `+91${match[1]}` : null;
}

export function phoneLookupVariants(phone) {
  return [phone, phone.slice(3)];
}

export function hashPhoneOtp(phone, code) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");
  return crypto.createHmac("sha256", secret).update(`${phone}:${code}`).digest("hex");
}
