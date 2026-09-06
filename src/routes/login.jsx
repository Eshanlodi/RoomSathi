import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, EyeOff, Home, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

function LoginPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ email, password });
      toast.success("Logged in successfully", { description: "Welcome back to RoomSathi." });
      // Send the user back to whatever page they were trying to reach, or the dashboard
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      toast.error("Login failed", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="gradient-hero relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="absolute -right-24 -bottom-32 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
      <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="glass-card relative w-full max-w-md rounded-3xl p-8"
  >
        <Link to="/" className="flex items-center justify-center gap-2">
          <span className="gradient-hero flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
            <Home className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold">
            Room<span className="text-primary">Sathi</span>
          </span>
        </Link>
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Log in to continue your room hunt.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
    id="email"
    type="email"
    required
    placeholder="you@college.edu"
    className="pl-9"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
    id="password"
    type={show ? "text" : "password"}
    required
    placeholder="••••••••"
    className="px-9"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
              <button
    type="button"
    aria-label="Toggle password visibility"
    onClick={() => setShow(!show)}
    className="absolute top-2.5 right-3 text-muted-foreground hover:text-foreground"
  >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="accent-primary" /> Remember me
            </label>
            <button
    type="button"
    onClick={() => toast("Password reset link sent to your email")}
    className="font-medium text-primary hover:underline"
  >
              Forgot Password?
            </button>
          </div>
          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to RoomSathi?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create Account
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Property owner?{" "}
          <Link to="/owner-register" className="font-medium text-accent hover:underline">
            Register as owner
          </Link>
        </p>
      </motion.div>
    </div>;
}
export default LoginPage;