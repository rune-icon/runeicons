"use client";

import { useState } from "react";

import { SunIcon } from "@/components/icon-page/simple-svg";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => {
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle light/dark mode"
      aria-pressed={isDark}
      className="flex h-5.75 w-5.75 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
    >
      <SunIcon
        className="block h-full w-full shrink-0"
        aria-hidden="true"
        focusable="false"
      />
    </button>
  );
}
