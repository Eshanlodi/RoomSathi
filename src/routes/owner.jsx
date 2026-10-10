import { useEffect, useState } from "react";
import { BarChart3, Building2, Eye, LayoutDashboard, PlusCircle, User, Users } from "lucide-react";
import { DashboardLayout, StatCard } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { inr } from "@/lib/data";
import { api } from "@/lib/api";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/owner" },
  { label: "Add Room", icon: PlusCircle, to: "/owner" },
  { label: "My Rooms", icon: Building2, to: "/rooms" },
  { label: "Interested Students", icon: Users, to: "/owner" },
  { label: "Analytics", icon: BarChart3, to: "/owner" },
  { label: "Profile", icon: User, to: "/profile" },
];

function OwnerDashboard() {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState(null);
  const [visitRequests, setVisitRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.rooms.mine(), api.owner.stats(), api.visitRequests.list()])
      .then(([roomResults, statsResult, requestResult]) => {
        setRooms(roomResults);
        setStats(statsResult);
        setVisitRequests(requestResult.visitRequests);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <DashboardLayout
      items={items}
      role="Owner"
      title="Owner overview"
      subtitle="Performance across your listings"
    >
      {error && (
        <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total rooms"
          value={rooms.length}
          icon={Building2}
          hint="Live database count"
        />
        <StatCard
          label="Verified rooms"
          value={rooms.filter((room) => room.verified).length}
          icon={PlusCircle}
          hint="Approved listings"
        />
        <StatCard
          label="Interested students"
          value={stats?.interestedStudents ?? 0}
          icon={Users}
          hint="Saved rooms and visit requests"
        />
        <StatCard
          label="Total views"
          value={stats?.totalViews ?? 0}
          icon={Eye}
          hint="Tracked room views"
        />
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="font-semibold">My rooms</h2>
          <Button size="sm" variant="hero">
            Add room
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Room</th>
                <th className="px-6 py-3">City</th>
                <th className="px-6 py-3">Rent</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-t border-border">
                  <td className="px-6 py-4 font-medium">{room.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{room.city}</td>
                  <td className="px-6 py-4">{inr(room.rent)}</td>
                  <td className="px-6 py-4">{room.verified ? "Active" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rooms.length && !error && (
          <p className="p-8 text-center text-sm text-muted-foreground">No rooms listed yet.</p>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold">Interested students and visit requests</h2>
        <div className="mt-4 space-y-3">
          {visitRequests.length ? (
            visitRequests.map((request) => (
              <div
                key={request._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary/50 p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{request.studentId?.name || "Student"}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.roomId?.name} · {request.status}
                  </p>
                </div>
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        api.visitRequests
                          .updateStatus(request._id, "accepted")
                          .then(() =>
                            setVisitRequests((items) =>
                              items.map((item) =>
                                item._id === request._id ? { ...item, status: "accepted" } : item,
                              ),
                            ),
                          )
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        api.visitRequests
                          .updateStatus(request._id, "rejected")
                          .then(() =>
                            setVisitRequests((items) =>
                              items.map((item) =>
                                item._id === request._id ? { ...item, status: "rejected" } : item,
                              ),
                            ),
                          )
                      }
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No visit requests yet.</p>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default OwnerDashboard;
