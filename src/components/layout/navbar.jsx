import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
const links = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Find Rooms" },
  { to: "/roommates", label: "Find Roommates" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" }
];
function Logo() {
  return <Link to="/" className="flex items-center gap-2">
      <span className="gradient-hero flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground shadow-soft">
        <Home className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        Room<span className="text-primary">Sathi</span>
      </span>
    </Link>;
}
function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => <NavLink
    key={l.to}
    to={l.to}
    end={l.to === "/"}
    className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
  >
              {l.label}
            </NavLink>)}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {user ? <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">
                  <User className="h-4 w-4" /> {user.name?.split(" ")[0]}
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </> : <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>}
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>
      {open && <div className="border-t border-border/60 bg-background px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => <Link
    key={l.to}
    to={l.to}
    onClick={() => setOpen(false)}
    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
  >
                {l.label}
              </Link>)}
            <div className="mt-2 flex gap-2">
              {user ? <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="hero" className="flex-1" onClick={handleLogout}>
                    Logout
                  </Button>
                </> : <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button variant="hero" className="flex-1" asChild>
                    <Link to="/register" onClick={() => setOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </>}
            </div>
          </div>
        </div>}
    </header>;
}
export {
  Logo,
  Navbar
};