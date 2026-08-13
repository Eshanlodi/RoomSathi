import { Link, NavLink } from "react-router-dom";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/layout/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
function DashboardLayout({
  items,
  title,
  subtitle,
  role,
  children
}) {
  const [open, setOpen] = useState(false);
  const sidebar = <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-2 pt-1">
        <Logo />
        <p className="mt-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {role}
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => <NavLink
    key={item.label}
    to={item.to}
    onClick={() => setOpen(false)}
    className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
  >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>)}
      </nav>
      <Link
    to="/login"
    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
  >
        <LogOut className="h-4 w-4" />
        Logout
      </Link>
    </div>;
  return <div className="min-h-screen bg-secondary/40">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card lg:block">
        {sidebar}
      </aside>
      {open && <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-card shadow-lift">{sidebar}</aside>
        </div>}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Button
    variant="ghost"
    size="icon"
    className="lg:hidden"
    aria-label="Toggle sidebar"
    onClick={() => setOpen(!open)}
  >
              {open ? <X /> : <Menu />}
            </Button>
            <div>
              <h1 className="text-base font-semibold sm:text-lg">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell />
              <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-accent" />
            </Button>
            <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary sm:flex">
              AJ
            </span>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>;
}
function StatCard({
  label,
  value,
  icon: Icon,
  hint
}) {
  return <div className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-accent">{hint}</p>}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>;
}
export {
  DashboardLayout,
  StatCard
};
