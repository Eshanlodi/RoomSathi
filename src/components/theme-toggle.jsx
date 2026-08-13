import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("roomsathi-theme");
    const isDark = stored ? stored === "dark" : false;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("roomsathi-theme", next ? "dark" : "light");
  };
  return <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={toggle}>
      {dark ? <Sun /> : <Moon />}
    </Button>;
}
export {
  ThemeToggle
};
