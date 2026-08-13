import { Link, NavLink } from "react-router-dom";
import { Home, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
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
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/register">Register</Link>
          </Button>
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
            </div>
          </div>
        </div>}
    </header>;
}
export {
  Logo,
  Navbar
};
