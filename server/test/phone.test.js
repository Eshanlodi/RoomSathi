import test from "node:test";
import assert from "node:assert/strict";
import { hashPhoneOtp, normalizeIndianPhone, phoneLookupVariants } from "../src/utils/phone.js";

test("normalizes supported Indian mobile formats", () => {
  assert.equal(normalizeIndianPhone("90000 12345"), "+919000012345");
  assert.equal(normalizeIndianPhone("+91-90000-12345"), "+919000012345");
});

test("rejects invalid Indian mobile numbers", () => {
  assert.equal(normalizeIndianPhone("12345"), null);
  assert.equal(normalizeIndianPhone("+1 415 555 0123"), null);
  assert.equal(normalizeIndianPhone("50000 12345"), null);
  assert.equal(normalizeIndianPhone(null), null);
});

test("duplicate lookup covers E.164 and legacy national formats", () => {
  assert.deepEqual(phoneLookupVariants("+919000012345"), ["+919000012345", "9000012345"]);
});

test("OTP hashes are keyed and code-specific", () => {
  process.env.JWT_SECRET = "unit-test-secret";
  const firstHash = hashPhoneOtp("+919000012345", "123456");
  assert.match(firstHash, /^[a-f0-9]{64}$/);
  assert.notEqual(firstHash, hashPhoneOtp("+919000012345", "123457"));
});
