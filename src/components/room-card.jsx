import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { BadgeCheck, Heart, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { inr } from "@/lib/data";
function RoomCard({ room, index = 0 }) {
  const [saved, setSaved] = useState(false);
  return <motion.article
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
    className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
  >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
    src={room.images[0]}
    alt={room.name}
    loading="lazy"
    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
  />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
            {room.type}
          </span>
          {room.verified && <span className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified
            </span>}
        </div>
        <button
    type="button"
    aria-label="Save room"
    onClick={() => {
      setSaved(!saved);
      toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
    }}
    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur transition-colors hover:bg-background"
  >
          <Heart
    className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
  />
        </button>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{room.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {room.distance} · {room.city}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs font-semibold">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {room.rating}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {room.facilities.slice(0, 4).map((f) => <span key={f} className="rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
              {f}
            </span>)}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <p className="text-lg font-bold">
            {inr(room.rent)}
            <span className="text-xs font-normal text-muted-foreground">/month</span>
          </p>
          <Button size="sm" asChild>
            <Link to={`/rooms/${room.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>;
}
export {
  RoomCard
};
