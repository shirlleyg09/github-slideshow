"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return <button className="btn btn-secondary" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Alternar tema"><Sun className="h-4 w-4 dark:hidden"/><Moon className="hidden h-4 w-4 dark:block"/></button>;
}
