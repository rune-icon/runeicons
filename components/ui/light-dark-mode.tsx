"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function LightDarkMode() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button size="icon" onClick={handleThemeToggle} aria-label="Toggle theme">
      <Sun className=" dark:hidden block" />
      <Moon className=" hidden dark:block" />
    </Button>
  );
}
