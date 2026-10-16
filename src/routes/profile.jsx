import { Link } from "react-router-dom";
import { Camera, KeyRound, LogOut, Mail, MapPin, Phone, School } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { SiteLayout } from "@/components/layout/site-layout";
import { RoomCard } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    api.wishlists
      .list()
      .then((data) => setWishlist(data.wishlists))
      .catch(() => setWishlist([]));
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    try {
      await updateProfile({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        college: form.get("college"),
      });
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SiteLayout>
      <div className="gradient-hero h-40" />
      <div className="mx-auto -mt-20 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative">
              <img
                src={user?.avatar || "/room1.jpeg"}
                alt={user?.name || "Profile"}
                className="h-24 w-24 rounded-2xl border-4 border-card object-cover shadow-soft"
              />
              <button
                type="button"
                aria-label="Change photo"
                onClick={() => toast("Photo upload requires storage configuration")}
                className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    const upload = await api.uploads.image(file);
                    await updateProfile({ avatar: upload.url });
                    toast.success("Profile photo updated");
                  } catch (error) {
                    toast.error(error.message);
                  }
                }}
              />
              {wishlist.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((room, index) => (
                    <RoomCard
                      key={room._id}
                      room={{ ...room, id: room._id, rating: 0, reviews: 0 }}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                "No saved rooms yet."
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold tracking-tight">{user?.name || "Your profile"}</h1>
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {user?.role || "student"} {user?.college ? `· ${user.college}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                  {user?.email}
                </span>
                {user?.phone && (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={saveProfile}
            className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8"
          >
            <h2 className="font-semibold">Personal information</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="pname">
                <Input name="name" id="pname" defaultValue={user?.name || ""} required />
              </Field>
              <Field label="Email" htmlFor="pemail">
                <Input
                  name="email"
                  id="pemail"
                  type="email"
                  defaultValue={user?.email || ""}
                  required
                />
              </Field>
              <Field label="Phone" htmlFor="pphone">
                <Input name="phone" id="pphone" defaultValue={user?.phone || ""} />
              </Field>
              <Field label="City" htmlFor="pcity">
                <Input id="pcity" defaultValue="Indore" disabled />
              </Field>
              <Field label="College" htmlFor="pcollege" className="sm:col-span-2">
                <Input name="college" id="pcollege" defaultValue={user?.college || ""} />
              </Field>
            </div>
            <Button type="submit" variant="hero" className="mt-6" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-sm font-semibold">Quick info</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" /> {user?.email}
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" /> {user?.phone || "Not provided"}
                </li>
                <li className="flex items-center gap-2">
                  <School className="h-4 w-4 text-primary" /> {user?.college || "Not provided"}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Indore
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-sm font-semibold">Security</h2>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => toast("Password reset is not configured yet")}
              >
                <KeyRound /> Change password
              </Button>
              <Button
                variant="ghost"
                className="mt-2 w-full text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut /> Logout
              </Button>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Saved rooms</h2>
          <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Wishlist persistence is not enabled yet. Room saving will be connected when the wishlist
            API is added.
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

export default ProfilePage;
