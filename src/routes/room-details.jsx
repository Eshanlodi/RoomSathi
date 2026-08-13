import { Link, useParams } from "react-router-dom";
import {
  BadgeCheck,
  CalendarCheck,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
  Star
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/site-layout";
import { RoomCard } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { inr, roomReviews, rooms } from "@/lib/data";

function RoomDetails() {
  const { roomId } = useParams();
  const [active, setActive] = useState(0);
  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Room not found</h1>
        <p className="mt-3 text-muted-foreground">The room you are looking for does not exist or may have been removed.</p>
        <Link to="/rooms" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Back to rooms</Link>
      </div>
    </SiteLayout>;
  }
  const similar = rooms.filter((r) => r.id !== room.id).slice(0, 3);
  return <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="text-sm text-muted-foreground">
          <Link to="/rooms" className="hover:text-primary">
            Find Rooms
          </Link>{" "}
          / <span className="text-foreground">{room.name}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{room.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {room.distance} · {room.city}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" /> {room.rating} ({room.reviews}{" "}
                reviews)
              </span>
              {room.verified && <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-accent">
                  <BadgeCheck className="h-4 w-4" /> Verified
                </span>}
            </p>
          </div>
          <Button variant="outline" onClick={() => toast.success("Link copied to clipboard")}>
            <Share2 /> Share
          </Button>
        </div>

        {
    /* Gallery */
  }
        <div className="mt-6 grid gap-3 lg:grid-cols-[2fr_1fr]">
          <img
    src={room.images[active]}
    alt={room.name}
    className="h-[280px] w-full rounded-2xl object-cover shadow-soft sm:h-[440px]"
  />
          <div className="grid grid-cols-4 gap-3 lg:grid-cols-2">
            {room.images.map((src, i) => <button
    key={src + i}
    onClick={() => setActive(i)}
    className={`overflow-hidden rounded-xl border-2 transition-all ${active === i ? "border-primary" : "border-transparent opacity-80 hover:opacity-100"}`}
  >
                <img src={src} alt="" loading="lazy" className="h-20 w-full object-cover lg:h-[104px]" />
              </button>)}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-semibold">Room information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                {[
    { k: "Rent", v: `${inr(room.rent)}/mo` },
    { k: "Deposit", v: inr(room.deposit) },
    { k: "Sharing", v: room.sharing },
    { k: "Type", v: room.type }
  ].map((i) => <div key={i.k} className="rounded-xl bg-secondary/60 p-4">
                    <p className="text-xs text-muted-foreground">{i.k}</p>
                    <p className="mt-1 font-semibold">{i.v}</p>
                  </div>)}
              </div>
              <h3 className="mt-6 text-sm font-semibold">Facilities</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {room.facilities.map((f) => <span
    key={f}
    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
  >
                    {f}
                  </span>)}
              </div>
              <h3 className="mt-6 text-sm font-semibold">Description</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{room.description}</p>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="border-b border-border p-6">
                <h2 className="font-semibold">Location</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {room.distance} — {room.college}
                </p>
              </div>
              <div className="relative flex h-64 items-center justify-center bg-secondary">
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:32px_32px]" />
                <div className="relative text-center">
                  <span className="gradient-hero mx-auto flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground shadow-lift">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-sm font-medium">Google Map preview</p>
                  <p className="text-xs text-muted-foreground">{room.city}, India</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-semibold">Student reviews</h2>
              <div className="mt-5 space-y-5">
                {roomReviews.map((r) => <div key={r.name} className="border-b border-border pb-5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{r.name}</p>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />)}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                  </div>)}
              </div>
            </section>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lift">
              <p className="text-3xl font-extrabold">
                {inr(room.rent)}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Deposit {inr(room.deposit)} · No brokerage
              </p>
              <div className="mt-5 flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {room.owner.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{room.owner.name}</p>
                  <p className="text-xs text-muted-foreground">Owner since {room.owner.since}</p>
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <Button variant="hero" size="xl" className="w-full" onClick={() => toast.success("Visit request sent")}>
                  <CalendarCheck /> Book Visit
                </Button>
                <Button variant="outline" size="xl" className="w-full" onClick={() => toast("Calling " + room.owner.phone)}>
                  <Phone /> Call Owner
                </Button>
                <Button variant="accent" size="xl" className="w-full" onClick={() => toast("Opening WhatsApp chat")}>
                  <MessageCircle /> WhatsApp Owner
                </Button>
              </div>
              <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Owner identity verified by
                RoomSathi
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Similar rooms</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
          </div>
        </section>
      </div>
    </SiteLayout>;
}
export default RoomDetails;
