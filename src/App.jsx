import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/routes/index";
import About from "@/routes/about";
import Admin from "@/routes/admin";
import Contact from "@/routes/contact";
import Dashboard from "@/routes/dashboard";
import Expenses from "@/routes/expenses";
import Login from "@/routes/login";
import Owner from "@/routes/owner";
import OwnerRegister from "@/routes/owner-register";
import Profile from "@/routes/profile";
import Register from "@/routes/register";
import Roommates from "@/routes/roommates";
import Rooms from "@/routes/rooms";
import RoomDetails from "@/routes/room-details";
import { SiteLayout } from "@/components/layout/site-layout";

function NotFound() {
  return (
    <SiteLayout>
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
          <a href="/" className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</a>
        </div>
      </div>
    </SiteLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/owner-register" element={<OwnerRegister />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/roommates" element={<Roommates />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:roomId" element={<RoomDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
