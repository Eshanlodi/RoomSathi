import {
  Bell,
  Calculator,
  Heart,
  LayoutDashboard,
  Search,
  Sparkles,
  User
} from "lucide-react";
import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { RoomCard } from "@/components/room-card";
import { notifications, rooms } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Search Rooms", icon: Search, to: "/rooms" },
  { label: "Wishlist", icon: Heart, to: "/profile" },
  { label: "Roommate Match", icon: Sparkles, to: "/roommates" },
  { label: "Expense Calculator", icon: Calculator, to: "/expenses" },
  { label: "Notifications", icon: Bell, to: "/dashboard" },
  { label: "Profile", icon: User, to: "/profile" }
];
function StudentDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Student";
  return <DashboardLayout
    items={items}
    role="Student"
    title={`Welcome back, ${firstName}`}
    subtitle={user?.college ? `Here's what's new near ${user.college}` : "Here's what's new for you"}
  >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Rooms viewed" value="24" icon={Search} hint="+6 this week" />
        <StatCard label="Wishlist" value="5" icon={Heart} hint="2 price drops" />
        <StatCard label="Roommate matches" value="3" icon={Sparkles} hint="Best 95%" />
        <StatCard label="Notifications" value="7" icon={Bell} hint="3 unread" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Recommended for you</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {rooms.slice(0, 3).map((r, i) => <RoomCard key={r.id} room={r} index={i} />)}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Recently viewed</h2>
          <ul className="mt-4 space-y-4">
            {rooms.slice(3, 6).map((r) => <li key={r.id} className="flex items-center gap-4">
                <img src={r.images[0]} alt={r.name} loading="lazy" className="h-14 w-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.distance}</p>
                </div>
                <span className="text-sm font-semibold">₹{r.rent.toLocaleString("en-IN")}</span>
              </li>)}
          </ul>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Notifications</h2>
          <ul className="mt-4 space-y-4">
            {notifications.map((n) => <li key={n.title} className="flex gap-3 rounded-xl bg-secondary/50 p-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div>
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                </div>
              </li>)}
          </ul>
        </section>
      </div>
    </DashboardLayout>;
}
export default StudentDashboard;