import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  ClipboardCheck,
  FileWarning,
  LayoutDashboard,
  Settings,
  Star,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
  { label: "Users", icon: Users, to: "/admin" },
  { label: "Owner requests", icon: UserCog, to: "/admin" },
  { label: "Rooms", icon: Building2, to: "/rooms" },
  { label: "Reports", icon: FileWarning, to: "/admin" },
  { label: "Reviews", icon: Star, to: "/admin" },
  { label: "Settings", icon: Settings, to: "/admin" },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [ownerRequests, setOwnerRequests] = useState([]);
  const [actioningId, setActioningId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.admin.stats(), api.admin.users(), api.admin.ownerRequests()])
      .then(([statsData, userData, ownerRequestData]) => {
        setStats(statsData);
        setUsers(userData);
        setOwnerRequests(ownerRequestData);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const reviewOwnerRequest = async (id, status) => {
    setActioningId(id);
    setError("");
    try {
      await api.admin.updateOwnerRequest(id, status);
      setOwnerRequests((requests) => requests.filter((request) => request.id !== id));
      setStats((current) =>
        current
          ? {
              ...current,
              pendingOwnerRequests: Math.max(0, (current.pendingOwnerRequests ?? 1) - 1),
            }
          : current,
      );
      setUsers((current) =>
        current.map((user) =>
          user.id === id
            ? { ...user, status: status === "approved" ? "Active" : "Rejected" }
            : user,
        ),
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setActioningId(null);
    }
  };

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
        <StatCard
          label="Owner requests"
          value={stats?.pendingOwnerRequests ?? "-"}
          icon={ClipboardCheck}
          hint="Awaiting review"
        />
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="font-semibold">Owner requests</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review new owner accounts before they can manage listings.
            </p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold">
            {ownerRequests.length}
          </span>
        </div>
        {ownerRequests.length ? (
          <div className="divide-y divide-border">
            {ownerRequests.map((request) => (
              <article
                key={request.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{request.name}</p>
                  <p className="break-all text-sm text-muted-foreground">{request.email}</p>
                  <p className="mt-1 text-sm">
                    {[request.phone, request.address].filter(Boolean).join(" · ") ||
                      "No contact details provided"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitted {new Date(request.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    disabled={actioningId === request.id}
                    onClick={() => reviewOwnerRequest(request.id, "approved")}
                  >
                    <Check /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={actioningId === request.id}
                    onClick={() => reviewOwnerRequest(request.id, "rejected")}
                  >
                    <X /> Reject
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No owner requests are waiting for review.
          </p>
        )}
      </section>

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
