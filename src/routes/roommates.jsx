import { motion } from "motion/react";
import { Heart, MessageCircle, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { inr, roommateMatches } from "@/lib/data";

function RoommatesPage() {
  const [submitted, setSubmitted] = useState(false);
  return <SiteLayout>
      <section className="gradient-soft border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Lifestyle based matching
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Find your roommate match</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Nine quick questions. We score compatibility on budget, habits and routine — then show
            students who actually fit.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_400px] lg:px-8">
        <form
    onSubmit={(e) => {
      e.preventDefault();
      setSubmitted(true);
      toast.success("Matches updated", { description: "3 compatible students found." });
    }}
    className="rounded-3xl border border-border bg-card p-8 shadow-soft"
  >
          <h2 className="font-semibold">Your preferences</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Budget (₹ / month)" htmlFor="mbudget">
              <Input id="mbudget" type="number" defaultValue={8e3} step={500} />
            </Field>
            <Field label="Food Preference" htmlFor="mfood">
              <Select id="mfood" defaultValue="Vegetarian">
                <option>Vegetarian</option>
                <option>Eggetarian</option>
                <option>Non-vegetarian</option>
                <option>Vegan</option>
              </Select>
            </Field>
            <Field label="Smoking" htmlFor="msmoke">
              <Select id="msmoke" defaultValue="No">
                <option>No</option>
                <option>Occasionally</option>
                <option>Yes</option>
              </Select>
            </Field>
            <Field label="Drinking" htmlFor="mdrink">
              <Select id="mdrink" defaultValue="No">
                <option>No</option>
                <option>Occasionally</option>
                <option>Yes</option>
              </Select>
            </Field>
            <Field label="Study Hours" htmlFor="mstudy">
              <Select id="mstudy" defaultValue="4-6 hours">
                <option>0-2 hours</option>
                <option>2-4 hours</option>
                <option>4-6 hours</option>
                <option>6+ hours</option>
              </Select>
            </Field>
            <Field label="Sleep Time" htmlFor="msleep">
              <Select id="msleep" defaultValue="11 PM - 12 AM">
                <option>Before 10 PM</option>
                <option>10 PM - 11 PM</option>
                <option>11 PM - 12 AM</option>
                <option>After 12 AM</option>
              </Select>
            </Field>
            <Field label="Wake Up Time" htmlFor="mwake">
              <Select id="mwake" defaultValue="6 AM - 7 AM">
                <option>Before 6 AM</option>
                <option>6 AM - 7 AM</option>
                <option>7 AM - 9 AM</option>
                <option>After 9 AM</option>
              </Select>
            </Field>
            <Field label="Cleanliness" htmlFor="mclean">
              <Select id="mclean" defaultValue="Tidy">
                <option>Very tidy</option>
                <option>Tidy</option>
                <option>Average</option>
                <option>Relaxed</option>
              </Select>
            </Field>
            <Field label="Preferred Sharing" htmlFor="msharing" className="sm:col-span-2">
              <Select id="msharing" defaultValue="Double">
                <option>Single</option>
                <option>Double</option>
                <option>Triple</option>
              </Select>
            </Field>
          </div>
          <Button type="submit" variant="hero" size="xl" className="mt-7 w-full sm:w-56">
            <Users /> Find matches
          </Button>
        </form>

        <aside className="space-y-4">
          <motion.div
    key={submitted ? "done" : "idle"}
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="gradient-hero rounded-3xl p-8 text-center shadow-lift"
  >
            <p className="text-sm text-primary-foreground/80">Your best match</p>
            <p className="mt-2 text-6xl font-extrabold text-primary-foreground">95%</p>
            <p className="mt-2 text-sm text-primary-foreground/85">
              Nikhil Verma · COEP Technological University
            </p>
            <Button variant="secondary" className="mt-6" onClick={() => toast.success("Request sent")}>
              <Heart /> Send match request
            </Button>
          </motion.div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-semibold">Recommended students</h2>
            <div className="mt-4 space-y-4">
              {roommateMatches.map((m) => <div key={m.name} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <img src={m.avatar} alt={m.name} loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.college}</p>
                    </div>
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-bold text-accent">
                      {m.match}%
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.tags.map((t) => <span key={t} className="rounded-md bg-secondary px-2 py-1 text-[11px] text-muted-foreground">
                        {t}
                      </span>)}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Budget {inr(m.budget)}</p>
                    <Button size="sm" variant="soft" onClick={() => toast("Chat request sent")}>
                      <MessageCircle /> Connect
                    </Button>
                  </div>
                </div>)}
            </div>
          </div>
        </aside>
      </section>
    </SiteLayout>;
}
export default RoommatesPage;
