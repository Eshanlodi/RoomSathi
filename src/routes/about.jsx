import { Heart, ShieldCheck, Target, Users } from "lucide-react";
import { SiteLayout } from "@/components/layout/site-layout";

const values = [
  { icon: ShieldCheck, title: "Trust first", body: "Manual verification of owners and photos before any listing goes live." },
  { icon: Heart, title: "Student first", body: "Free forever for students. No hidden charges, no commission." },
  { icon: Target, title: "Right fit", body: "Matching on lifestyle, not just price \u2014 because roommates matter." },
  { icon: Users, title: "Community", body: "Honest reviews written by students who actually lived there." }
];
function AboutPage() {
  return <SiteLayout>
      <section className="gradient-soft border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary">About us</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Housing shouldn't be the hardest part of college
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            RoomSathi started when three students spent a month sleeping on a friend's floor because
            every "available" room turned out to be a broker's bait listing. We built the platform we
            wished existed: verified rooms, transparent rent and roommates you actually get along with.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <v.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-semibold">{v.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </div>)}
        </div>

        <div className="mt-16 grid gap-6 rounded-3xl border border-border bg-card p-8 shadow-soft sm:grid-cols-3">
          {[
    { k: "0+", v: "Verified rooms listed" },
    { k: "0+", v: "Owners onboarded" },
    { k: "0+", v: "Students housed" }
  ].map((s) => <div key={s.k} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-primary">{s.k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
            </div>)}
        </div>
      </section>
    </SiteLayout>;
}
export default AboutPage;
