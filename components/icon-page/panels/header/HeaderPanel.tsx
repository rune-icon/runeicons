"use client";

import { cn } from "@/lib/utils";
import { Dribbble as Scribble, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MorphHoverButton } from "@/components/icon-page/morph-hover-button";
import { HeaderLogo } from "@/components/icons/HeaderLogo";

interface HeaderPanelProps {
  className?: string;
}

export function HeaderPanel({ className }: HeaderPanelProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isEditorPage = pathname === "/editor";

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

      <Link href="/" className="w-12 h-full border-r border-border flex items-center justify-center group cursor-pointer hover:bg-muted/50 transition-colors">
        <HeaderLogo className="w-8 h-8 rounded-md transition-transform" />
      </Link>


      <div className="w-[320px] h-full border-r border-border flex items-center px-5"></div>


      <div className="flex-1 h-full border-r border-border flex items-center px-6 justify-end">
        {isEditorPage ? (
          <MorphHoverButton
            title="Icons"
            onClick={() => router.push("/icons")}
            pillColor="rgb(99, 102, 241)" /* indigo-500 */
          />
        ) : (
          <MorphHoverButton
            title="Edit"
            onClick={() => router.push("/editor")}
            pillColor="rgb(34, 197, 94)" /* green-500 */
          />
        )}
      </div>


      <div className="w-[380px] h-full flex items-center px-6 justify-end gap-3">
        <MorphHoverButton title="GitHub" href="https://github.com" />
        <MorphHoverButton title="Sponsor" href="https://github.com/sponsors" />
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          suppressHydrationWarning
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
