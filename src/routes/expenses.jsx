import { motion } from "motion/react";
import { Calculator, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/layout/site-layout";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { inr } from "@/lib/data";

const initial = {
  Rent: 12e3,
  Electricity: 1400,
  Water: 300,
  Gas: 800,
  Internet: 900,
  Maintenance: 600
};
function ExpensesPage() {
  const [values, setValues] = useState(initial);
  const [members, setMembers] = useState(3);
  const total = Object.values(values).reduce((a, b) => a + (b || 0), 0);
  const perPerson = Math.round(total / Math.max(members, 1));
  return <SiteLayout>
      <section className="gradient-soft border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
          <span className="gradient-hero mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-primary-foreground shadow-lift">
            <Calculator className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight">Expense split calculator</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Add your monthly bills, set the number of members, and settle up without arguments.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h2 className="font-semibold">Monthly expenses</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Object.keys(initial).map((key) => <Field key={key} label={`${key} (\u20B9)`} htmlFor={key}>
                <Input
    id={key}
    type="number"
    min={0}
    value={values[key] ?? 0}
    onChange={(e) => setValues({ ...values, [key]: Number(e.target.value) })}
  />
              </Field>)}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-secondary/60 p-4">
            <div>
              <p className="text-sm font-semibold">Members</p>
              <p className="text-xs text-muted-foreground">People sharing these bills</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" aria-label="Remove member" onClick={() => setMembers(Math.max(1, members - 1))}>
                <Minus />
              </Button>
              <span className="w-8 text-center text-lg font-bold">{members}</span>
              <Button variant="outline" size="icon" aria-label="Add member" onClick={() => setMembers(members + 1)}>
                <Plus />
              </Button>
            </div>
          </div>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <motion.div
    key={perPerson}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="gradient-hero rounded-3xl p-8 text-center shadow-lift"
  >
            <p className="text-sm text-primary-foreground/80">Per person, per month</p>
            <p className="mt-2 text-5xl font-extrabold text-primary-foreground">{inr(perPerson)}</p>
            <p className="mt-3 text-sm text-primary-foreground/85">
              Total {inr(total)} split across {members} member{members > 1 ? "s" : ""}
            </p>
          </motion.div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-sm font-semibold">Breakdown per person</h2>
            <ul className="mt-4 space-y-3">
              {Object.entries(values).map(([k, v]) => <li key={k} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold">{inr(Math.round((v || 0) / Math.max(members, 1)))}</span>
                </li>)}
              <li className="flex items-center justify-between border-t border-border pt-3 text-sm font-bold">
                <span>Total</span>
                <span className="text-primary">{inr(perPerson)}</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </SiteLayout>;
}
export default ExpensesPage;
