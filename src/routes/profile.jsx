import { Link } from "react-router-dom";
import { Camera, KeyRound, LogOut, Mail, MapPin, Phone, School } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/site-layout";
import { RoomCard } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { rooms } from "@/lib/data";

function ProfilePage() {
  return <SiteLayout>
      <div className="gradient-hero h-40" />
      <div className="mx-auto -mt-20 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative">
              <img
    src="https://i.pravatar.cc/200?img=47"
    alt="Aditi Joshi"
    className="h-24 w-24 rounded-2xl border-4 border-card object-cover shadow-soft"
  />
              <button
    aria-label="Change photo"
    onClick={() => toast("Photo upload coming soon")}
    className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft"
  >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight">Aditi Joshi</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                2nd Year · COEP Technological University
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {["Vegetarian", "Non-smoker", "Very tidy", "Budget \u20B98,000"].map((t) => <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="hero" onClick={() => toast.success("Profile saved")}>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <h2 className="font-semibold">Personal information</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="pname">
                <Input id="pname" defaultValue="Aditi Joshi" />
              </Field>
              <Field label="Email" htmlFor="pemail">
                <Input id="pemail" type="email" defaultValue="aditi@student.in" />
              </Field>
              <Field label="Phone" htmlFor="pphone">
                <Input id="pphone" defaultValue="+91 98765 43210" />
              </Field>
              <Field label="City" htmlFor="pcity">
                <Input id="pcity" defaultValue="Pune" />
              </Field>
              <Field label="College" htmlFor="pcollege" className="sm:col-span-2">
                <Input id="pcollege" defaultValue="COEP Technological University" />
              </Field>
            </div>
            <Button variant="hero" className="mt-6" onClick={() => toast.success("Changes saved")}>
              Save changes
            </Button>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-sm font-semibold">Quick info</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" /> aditi@student.in
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> +91 98765 43210
                </li>
                <li className="flex items-center gap-2">
                  <School className="h-4 w-4 text-primary" /> COEP, Pune
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Shivajinagar, Pune
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-sm font-semibold">Security</h2>
              <Button variant="outline" className="mt-4 w-full" onClick={() => toast("Password reset link sent")}>
                <KeyRound /> Change password
              </Button>
              <Button variant="ghost" className="mt-2 w-full text-destructive hover:bg-destructive/10" asChild>
                <Link to="/login">
                  <LogOut /> Logout
                </Link>
              </Button>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Saved rooms</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.slice(0, 3).map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
          </div>
        </section>
      </div>
    </SiteLayout>;
}
export default ProfilePage;
