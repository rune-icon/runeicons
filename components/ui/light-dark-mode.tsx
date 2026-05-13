"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function LightDarkMode({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      suppressHydrationWarning
    >
      <Sun className="size-4 dark:hidden block" />
      <Moon className="size-4 hidden dark:block" />
    </Button>
  );
}
