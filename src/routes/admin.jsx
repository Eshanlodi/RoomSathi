import { useEffect, useState } from "react";
import {
  Building2,
  FileWarning,
  LayoutDashboard,
  Settings,
  Star,
  UserCog,
  Users,
} from "lucide-react";
import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { api } from "@/lib/api";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Users", icon: Users, to: "/admin" },
  { label: "Owners", icon: UserCog, to: "/admin" },
  { label: "Rooms", icon: Building2, to: "/rooms" },
  { label: "Reports", icon: FileWarning, to: "/admin" },
  { label: "Reviews", icon: Star, to: "/admin" },
  { label: "Settings", icon: Settings, to: "/admin" },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.admin.stats(), api.admin.users()])
      .then(([statsData, userData]) => {
        setStats(statsData);
        setUsers(userData);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <DashboardLayout
      items={items}
      role="Admin"
      title="Platform overview"
      subtitle="Live statistics across RoomSathi"
    >
      {error && (
        <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total students"
          value={stats?.students ?? "-"}
          icon={Users}
          hint="Live database count"
        />
        <StatCard
          label="Total owners"
          value={stats?.owners ?? "-"}
          icon={UserCog}
          hint="Live database count"
        />
        <StatCard
          label="Listed rooms"
          value={stats?.rooms ?? "-"}
          icon={Building2}
          hint="Live database count"
        />
        <StatCard
          label="Reviews"
          value={stats?.reviews ?? "-"}
          icon={Star}
          hint="Live database count"
        />
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="border-b border-border p-6">
          <h2 className="font-semibold">Recent users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-6 py-4">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-accent">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default AdminDashboard;
