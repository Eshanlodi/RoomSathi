import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { BadgeCheck, IndianRupee, Upload, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function OwnerRegisterPage() {
  const [preview, setPreview] = useState(null);
  const onSubmit = (e) => {
    e.preventDefault();
    toast.success("Owner account created", { description: "Verification usually takes 24 hours." });
  };
  return <SiteLayout>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-6">
          <p className="text-sm font-semibold text-primary">For property owners</p>
          <h1 className="text-4xl font-extrabold tracking-tight">
            List your property. Reach 0+ students.
          </h1>
          <p className="text-muted-foreground">
            Free listings, verified student profiles and direct enquiries. No agents, no commission
            cuts on your rent.
          </p>
          <div className="space-y-4">
            {[
    { icon: IndianRupee, t: "Zero commission", b: "Keep 100% of the rent you collect." },
    { icon: Users, t: "Genuine students", b: "Every enquiry comes from a verified college student." },
    { icon: BadgeCheck, t: "Verified badge", b: "Verified listings get 3x more visits on average." }
  ].map((i) => <div key={i.t} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <i.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{i.t}</p>
                  <p className="text-sm text-muted-foreground">{i.b}</p>
                </div>
              </div>)}
          </div>
        </div>

        <motion.form
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    onSubmit={onSubmit}
    className="space-y-4 rounded-3xl border border-border bg-card p-8 shadow-lift"
  >
          <h2 className="text-xl font-bold">Create owner account</h2>
          <Field label="Name" htmlFor="oname">
            <Input id="oname" required placeholder="Rakesh Deshmukh" />
          </Field>
          <Field label="Email" htmlFor="oemail">
            <Input id="oemail" type="email" required placeholder="owner@email.com" />
          </Field>
          <Field label="Password" htmlFor="opassword">
            <Input id="opassword" type="password" required placeholder="••••••••" />
          </Field>
          <Field label="Phone" htmlFor="ophone">
            <Input id="ophone" type="tel" required placeholder="+91 98230 11223" />
          </Field>
          <Field label="Aadhaar Number" htmlFor="aadhaar">
            <Input id="aadhaar" required inputMode="numeric" placeholder="XXXX XXXX XXXX" />
          </Field>
          <Field label="Address" htmlFor="address">
            <Textarea id="address" required rows={3} placeholder="Flat / building, street, area, city, PIN" />
          </Field>
          <Field label="Profile Image" htmlFor="oavatar">
            <label
    htmlFor="oavatar"
    className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary"
  >
              {preview ? <img src={preview} alt="Preview" className="h-8 w-8 rounded-full object-cover" /> : <Upload className="h-4 w-4" />}
              {preview ? "Change image" : "Upload image"}
              <input
    id="oavatar"
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
          <Button type="submit" variant="hero" size="xl" className="w-full">
            Register
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already listed with us?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </motion.form>
      </section>
    </SiteLayout>;
}
export default OwnerRegisterPage;
