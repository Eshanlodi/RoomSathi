import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SiteLayout } from "@/components/layout/site-layout";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/protected-route";

const Home = lazy(() => import("@/routes/index"));
const About = lazy(() => import("@/routes/about"));
const Admin = lazy(() => import("@/routes/admin"));
const Contact = lazy(() => import("@/routes/contact"));
const Dashboard = lazy(() => import("@/routes/dashboard"));
const Expenses = lazy(() => import("@/routes/expenses"));
const Login = lazy(() => import("@/routes/login"));
const Owner = lazy(() => import("@/routes/owner"));
const OwnerRegister = lazy(() => import("@/routes/owner-register"));
const Profile = lazy(() => import("@/routes/profile"));
const Register = lazy(() => import("@/routes/register"));
const Roommates = lazy(() => import("@/routes/roommates"));
const Rooms = lazy(() => import("@/routes/rooms"));
const RoomDetails = lazy(() => import("@/routes/room-details"));

function NotFound() {
  return (
    <SiteLayout>
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="grid min-h-screen place-items-center" role="status" aria-live="polite">
              Loading page...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={["owner", "admin"]}>
                  <Owner />
                </ProtectedRoute>
              }
            />
            <Route path="/owner-register" element={<OwnerRegister />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/roommates" element={<Roommates />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:roomId" element={<RoomDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}
