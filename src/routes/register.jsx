import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Field, FormSection, Select } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { colleges, cities } from "@/lib/data";

function RegisterPage() {
  const [preview, setPreview] = useState(null);
  const onSubmit = (e) => {
    e.preventDefault();
    toast.success("Account created", { description: "Your student profile is ready." });
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
            <Input id="fullName" required placeholder="Aditi Joshi" />
          </Field>
          <Field label="Email" htmlFor="remail">
            <Input id="remail" type="email" required placeholder="you@college.edu" />
          </Field>
          <Field label="Password" htmlFor="rpassword">
            <Input id="rpassword" type="password" required placeholder="••••••••" />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" type="tel" required placeholder="+91 90000 12345" />
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
            <Select id="college" defaultValue="">
              <option value="" disabled>
                Select college
              </option>
              {colleges.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="City" htmlFor="city">
            <Select id="city" defaultValue="">
              <option value="" disabled>
                Select city
              </option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Monthly Budget (₹)" htmlFor="budget">
            <Input id="budget" type="number" min={1e3} step={500} placeholder="8000" />
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
            <Select id="food" defaultValue="Vegetarian">
              <option>Vegetarian</option>
              <option>Eggetarian</option>
              <option>Non-vegetarian</option>
              <option>Vegan</option>
            </Select>
          </Field>
          <Field label="Smoking" htmlFor="smoke">
            <Select id="smoke" defaultValue="No">
              <option>No</option>
              <option>Occasionally</option>
              <option>Yes</option>
            </Select>
          </Field>
          <Field label="Drinking" htmlFor="drink">
            <Select id="drink" defaultValue="No">
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
            <Select id="sleep" defaultValue="11 PM - 12 AM">
              <option>Before 10 PM</option>
              <option>10 PM - 11 PM</option>
              <option>11 PM - 12 AM</option>
              <option>After 12 AM</option>
            </Select>
          </Field>
          <Field label="Cleanliness" htmlFor="clean">
            <Select id="clean" defaultValue="Tidy">
              <option>Very tidy</option>
              <option>Tidy</option>
              <option>Average</option>
              <option>Relaxed</option>
            </Select>
          </Field>
        </FormSection>

        <div className="flex flex-col items-center gap-3">
          <Button type="submit" variant="hero" size="xl" className="w-full sm:w-64">
            Register
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
