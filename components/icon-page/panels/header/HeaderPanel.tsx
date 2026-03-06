"use client";

import { cn } from "@/lib/utils";
import { Dribbble as Scribble, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MorphHoverButton } from "@/components/icon-page/morph-hover-button";

interface HeaderPanelProps {
  className?: string;
}

export function HeaderPanel({ className }: HeaderPanelProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "h-12 border-b border-border bg-background flex items-center shrink-0 transition-colors duration-300",
        className,
      )}
    >
      {/* Section 1: Logo/Tool Rail alignment (48px) */}
      <div className="w-12 h-full border-r border-border flex items-center justify-center group cursor-pointer hover:bg-muted/50 transition-colors">
        <div className="w-8 h-8 rounded bg-foreground flex items-center justify-center transition-transform group-hover:scale-105">
          <Scribble className="h-5 w-5 text-background" />
        </div>
      </div>

      {/* Section 2: Icon Library alignment (320px) */}
      <div className="w-[320px] h-full border-r border-border flex items-center px-5"></div>

      {/* Section 3: Main Canvas alignment (flex-1) */}
      <div className="flex-1 h-full border-r border-border flex items-center px-6 justify-end">
        <MorphHoverButton
          title="Edit"
          pillColor="rgb(34, 197, 94)" /* green-500 */
        />
      </div>

      {/* Section 4: Right Panel alignment (380px) */}
      <div className="w-[380px] h-full flex items-center px-6 justify-end gap-3">
        <MorphHoverButton title="GitHub" href="https://github.com" />
        <MorphHoverButton
          title="Sponsor"
          href="https://github.com/sponsors"
          pillColor="rgb(236, 72, 153)" /* pink-500 */
        />
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
