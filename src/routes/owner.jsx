import {
  BarChart3,
  Building2,
  Eye,
  LayoutDashboard,
  PlusCircle,
  User,
  Users
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { inr, monthlyStats, rooms } from "@/lib/data";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/owner" },
  { label: "Add Room", icon: PlusCircle, to: "/owner" },
  { label: "My Rooms", icon: Building2, to: "/rooms" },
  { label: "Interested Students", icon: Users, to: "/owner" },
  { label: "Analytics", icon: BarChart3, to: "/owner" },
  { label: "Profile", icon: User, to: "/profile" }
];
function OwnerDashboard() {
  return <DashboardLayout items={items} role="Owner" title="Owner overview" subtitle="Performance across your listings">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total rooms" value="12" icon={Building2} hint="+2 this month" />
        <StatCard label="Active rooms" value="9" icon={PlusCircle} hint="3 pending review" />
        <StatCard label="Interested students" value="48" icon={Users} hint="+11 this week" />
        <StatCard label="Total views" value="3,240" icon={Eye} hint="+18% vs last month" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Listing views</h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
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
                <Bar dataKey="students" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Interested students</h2>
          <ul className="mt-4 space-y-4">
            {["Aditi Joshi", "Rohan Mehta", "Fatima Shaikh", "Karan Bhatt"].map((n, i) => <li key={n} className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/80?img=${i * 9 + 5}`} alt={n} loading="lazy" className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{n}</p>
                  <p className="text-xs text-muted-foreground">Enquired about Sunrise Boys PG</p>
                </div>
                <Button size="sm" variant="soft">
                  Reply
                </Button>
              </li>)}
          </ul>
        </section>
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="border-b border-border p-6">
          <h2 className="font-semibold">My rooms</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-3">Room</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Rent</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.slice(0, 5).map((r) => <tr key={r.id} className="border-t border-border">
                  <td className="px-6 py-4 font-medium">{r.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{r.city}</td>
                  <td className="px-6 py-4">{inr(r.rent)}</td>
                  <td className="px-6 py-4">
                    <span
    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.verified ? "bg-accent/15 text-accent" : "bg-secondary text-muted-foreground"}`}
  >
                      {r.verified ? "Active" : "Pending"}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>;
}
export default OwnerDashboard;
