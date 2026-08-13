import {
  Building2,
  FileWarning,
  LayoutDashboard,
  Settings,
  Star,
  UserCog,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";
import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { adminUsers, monthlyStats } from "@/lib/data";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Users", icon: Users, to: "/admin" },
  { label: "Owners", icon: UserCog, to: "/admin" },
  { label: "Rooms", icon: Building2, to: "/rooms" },
  { label: "Reports", icon: FileWarning, to: "/admin" },
  { label: "Reviews", icon: Star, to: "/admin" },
  { label: "Settings", icon: Settings, to: "/admin" }
];
function AdminDashboard() {
  return <DashboardLayout items={items} role="Admin" title="Platform overview" subtitle="Live statistics across RoomSathi">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value="2,043" icon={Users} hint="+124 this month" />
        <StatCard label="Total owners" value="312" icon={UserCog} hint="+18 this month" />
        <StatCard label="Listed rooms" value="524" icon={Building2} hint="41 pending review" />
        <StatCard label="Open reports" value="6" icon={FileWarning} hint="2 high priority" />
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold">Growth</h2>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyStats}>
              <defs>
                <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
    contentStyle={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      fontSize: 12
    }}
  />
              <Area type="monotone" dataKey="students" stroke="var(--primary)" fill="url(#growth)" strokeWidth={2} />
              <Area type="monotone" dataKey="rooms" stroke="var(--accent)" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border p-6">
            <h2 className="font-semibold">Recent users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((u) => <tr key={u.email} className="border-t border-border">
                    <td className="px-6 py-4">
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{u.city}</td>
                    <td className="px-6 py-4 text-muted-foreground">{u.joined}</td>
                    <td className="px-6 py-4">
                      <span
    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.status === "Active" ? "bg-accent/15 text-accent" : u.status === "Pending" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}
  >
                        {u.status}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Recent activity</h2>
          <ul className="mt-4 space-y-4">
            {[
    { t: "New owner verified", d: "Sneha Kulkarni \xB7 Pune", time: "10 min ago" },
    { t: "Listing reported", d: "Study Hub Hostel \xB7 Mumbai", time: "1 h ago" },
    { t: "Review flagged", d: "Campus Corner Girls PG", time: "3 h ago" },
    { t: "Room approved", d: "Urban Stay Studio \xB7 Bengaluru", time: "Yesterday" }
  ].map((a) => <li key={a.t} className="flex gap-3 rounded-xl bg-secondary/50 p-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-semibold">{a.t}</p>
                  <p className="text-xs text-muted-foreground">{a.d}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{a.time}</p>
                </div>
              </li>)}
          </ul>
        </section>
      </div>
    </DashboardLayout>;
}
export default AdminDashboard;
