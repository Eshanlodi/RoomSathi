import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

function isValidIndianPhone(value) {
  return /^(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(value.trim());
}

export function PhoneVerificationField({ phone, onPhoneChange, verified, onVerifiedChange }) {
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const sendCode = async () => {
    if (!isValidIndianPhone(phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setBusy(true);
    try {
      const result = await api.auth.sendPhoneOtp(phone);
      setCodeSent(true);
      setCode("");
      onVerifiedChange(false);
      if (result.developmentCode) {
        toast.info(`Local development OTP: ${result.developmentCode}`);
      } else {
        toast.success("Verification code sent by SMS");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    setBusy(true);
    try {
      await api.auth.verifyPhoneOtp(phone, code);
      onVerifiedChange(true);
      toast.success("Phone number verified");
    } catch (error) {
      onVerifiedChange(false);
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <Field label="Phone number" htmlFor="registration-phone">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="registration-phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            pattern="(?:\+91[ -]?)?[6-9][0-9]{4}[ -]?[0-9]{5}"
            placeholder="+91 90000 12345"
            value={phone}
            onChange={(event) => {
              onPhoneChange(event.target.value);
              onVerifiedChange(false);
              setCodeSent(false);
              setCode("");
            }}
          />
          <Button type="button" variant="outline" disabled={busy} onClick={sendCode}>
            {busy && !verified ? "Please wait..." : "Send code"}
          </Button>
        </div>
      </Field>
      {codeSent && !verified && (
        <Field label="6-digit verification code" htmlFor="phone-otp">
          <div className="flex gap-2">
            <Input
              id="phone-otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              placeholder="000000"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            <Button type="button" disabled={busy || code.length !== 6} onClick={verifyCode}>
              {busy ? "Checking..." : "Verify"}
            </Button>
          </div>
        </Field>
      )}
      <p className={`text-xs ${verified ? "text-accent" : "text-muted-foreground"}`}>
        {verified ? "Phone number verified" : "Verify this Indian mobile number before continuing."}
      </p>
    </div>
  );
}
