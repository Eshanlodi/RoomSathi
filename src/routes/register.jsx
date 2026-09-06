import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Field, FormSection, Select } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { colleges, cities } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  mapCleanliness,
  mapFoodPreference,
  mapGuestsFrequency,
  mapSleepSchedule,
  mapStudyHabits,
  mapYesNo,
} from "@/lib/mappers";

function RegisterPage() {
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    college: "",
    city: "",
    budget: "",
    food: "Vegetarian",
    smoke: "No",
    drink: "No",
    sleep: "11 PM - 12 AM",
    clean: "Tidy",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Step 1: create the account (name, email, password, role, college, phone)
      await register({
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: "student",
        college: form.college,
        phone: form.phone,
      });

      // Step 2: save the lifestyle/roommate-matching details against the new account.
      // This runs right after register() so the JWT is already set on the request.
      try {
        await api.roommates.upsertProfile({
          college: form.college,
          city: form.city,
          budget: Number(form.budget) || 0,
          lifestyle: {
            sleepSchedule: mapSleepSchedule(form.sleep),
            cleanliness: mapCleanliness(form.clean),
            smoking: mapYesNo(form.smoke),
            drinking: mapYesNo(form.drink),
            guestsFrequency: mapGuestsFrequency(),
            studyHabits: mapStudyHabits(),
            foodPreference: mapFoodPreference(form.food),
          },
        });
      } catch (profileErr) {
        // Account creation succeeded even if this secondary step fails - don't block signup over it
        console.error("Roommate profile save failed:", profileErr.message);
      }

      toast.success("Account created", { description: "Your student profile is ready." });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error("Registration failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };
  return <SiteLayout>
      <div className="gradient-soft border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <p className="text-sm font-semibold text-primary">Student sign up</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Build your student profile
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            The lifestyle details help us match you with the right room and the right roommate.
          </p>
        </div>
      </div>

      <motion.form
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    onSubmit={onSubmit}
    className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6"
  >
        <FormSection title="Account details" description="How you log in and how owners reach you.">
          <Field label="Full Name" htmlFor="fullName">
            <Input id="fullName" required placeholder="Aditi Joshi" value={form.fullName} onChange={update("fullName")} />
          </Field>
          <Field label="Email" htmlFor="remail">
            <Input id="remail" type="email" required placeholder="you@college.edu" value={form.email} onChange={update("email")} />
          </Field>
          <Field label="Password" htmlFor="rpassword">
            <Input id="rpassword" type="password" required minLength={6} placeholder="••••••••" value={form.password} onChange={update("password")} />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" type="tel" required placeholder="+91 90000 12345" value={form.phone} onChange={update("phone")} />
          </Field>
          <Field label="Gender" htmlFor="gender">
            <Select id="gender" defaultValue="">
              <option value="" disabled>
                Select gender
              </option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </Select>
          </Field>
          <Field label="Profile Picture" htmlFor="avatar">
            <label
    htmlFor="avatar"
    className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary"
  >
              {preview ? <img src={preview} alt="Preview" className="h-8 w-8 rounded-full object-cover" /> : <Upload className="h-4 w-4" />}
              {preview ? "Change photo" : "Upload photo"}
              <input
    id="avatar"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) setPreview(URL.createObjectURL(file));
    }}
  />
            </label>
          </Field>
        </FormSection>

        <FormSection title="College & budget" description="So we can sort rooms by distance and rent.">
          <Field label="College" htmlFor="college">
            <Select id="college" value={form.college} onChange={update("college")}>
              <option value="" disabled>
                Select college
              </option>
              {colleges.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="City" htmlFor="city">
            <Select id="city" value={form.city} onChange={update("city")}>
              <option value="" disabled>
                Select city
              </option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Monthly Budget (₹)" htmlFor="budget">
            <Input id="budget" type="number" min={1e3} step={500} placeholder="8000" value={form.budget} onChange={update("budget")} />
          </Field>
          <Field label="Preferred Sharing" htmlFor="sharing">
            <Select id="sharing" defaultValue="Double">
              <option>Single</option>
              <option>Double</option>
              <option>Triple</option>
            </Select>
          </Field>
        </FormSection>

        <FormSection title="Lifestyle" description="Used only for roommate compatibility scoring.">
          <Field label="Food Preference" htmlFor="food">
            <Select id="food" value={form.food} onChange={update("food")}>
              <option>Vegetarian</option>
              <option>Eggetarian</option>
              <option>Non-vegetarian</option>
              <option>Vegan</option>
            </Select>
          </Field>
          <Field label="Smoking" htmlFor="smoke">
            <Select id="smoke" value={form.smoke} onChange={update("smoke")}>
              <option>No</option>
              <option>Occasionally</option>
              <option>Yes</option>
            </Select>
          </Field>
          <Field label="Drinking" htmlFor="drink">
            <Select id="drink" value={form.drink} onChange={update("drink")}>
              <option>No</option>
              <option>Occasionally</option>
              <option>Yes</option>
            </Select>
          </Field>
          <Field label="Study Hours / day" htmlFor="study">
            <Select id="study" defaultValue="4-6 hours">
              <option>0-2 hours</option>
              <option>2-4 hours</option>
              <option>4-6 hours</option>
              <option>6+ hours</option>
            </Select>
          </Field>
          <Field label="Sleep Time" htmlFor="sleep">
            <Select id="sleep" value={form.sleep} onChange={update("sleep")}>
              <option>Before 10 PM</option>
              <option>10 PM - 11 PM</option>
              <option>11 PM - 12 AM</option>
              <option>After 12 AM</option>
            </Select>
          </Field>
          <Field label="Cleanliness" htmlFor="clean">
            <Select id="clean" value={form.clean} onChange={update("clean")}>
              <option>Very tidy</option>
              <option>Tidy</option>
              <option>Average</option>
              <option>Relaxed</option>
            </Select>
          </Field>
        </FormSection>

        <div className="flex flex-col items-center gap-3">
          <Button type="submit" variant="hero" size="xl" className="w-full sm:w-64" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.form>
    </SiteLayout>;
}
export default RegisterPage;