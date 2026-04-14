"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { IconData } from "@/lib/types";

type ShortcutHandler = (e: KeyboardEvent) => boolean | void;

interface Options {
  onCopySvg?: () => void;
  onExport?: () => void;
  onReset?: () => void;
  onSelectTraySlot?: (index: number) => void;
  trayIcons: IconData[];
  canCopy?: boolean;
}

interface Return {
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}

const isTyping = (e: KeyboardEvent) =>
  e.target instanceof HTMLInputElement ||
  e.target instanceof HTMLTextAreaElement ||
  e.target instanceof HTMLSelectElement ||
  (e.target as HTMLElement)?.isContentEditable;

const isMac = () => navigator.platform.toUpperCase().includes("MAC");
const mod = (e: KeyboardEvent) => (isMac() ? e.metaKey : e.ctrlKey);

export function useKeyboardShortcuts({
  onCopySvg,
  onExport,
  onReset,
  onSelectTraySlot,
  trayIcons,
  canCopy,
}: Options): Return {
  const [showHelp, setShowHelp] = useState(false);
  const [armed, setArmed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const arm = () => {
    setArmed(true);
    timeoutRef.current = setTimeout(() => setArmed(false), 2000);
  };

  const disarm = () => {
    setArmed(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const shortcuts: Record<string, ShortcutHandler> = {
    c: (e) => {
      if (!mod(e) || e.shiftKey) return false;
      if (window.getSelection()?.toString()) return false;
      e.preventDefault();
      if (canCopy) onCopySvg?.();
      return true;
    },
    e: (e) => {
      if (!mod(e)) return false;
      e.preventDefault();
      onExport?.();
      return true;
    },
    r: (e) => {
      if (mod(e) || e.altKey) return false;
      e.preventDefault();
      armed ? (disarm(), onReset?.()) : arm();
      return true;
    },
    Escape: () => {
      if (armed) {
        disarm();
        return true;
      }
      if (showHelp) {
        setShowHelp(false);
        return true;
      }
      return false;
    },
    "?": (e) => {
      if (isTyping(e) && e.shiftKey) return false;
      e.preventDefault();
      setShowHelp(true);
      return true;
    },
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isTyping(e)) {
        if (e.key === "?" && !e.shiftKey) {
          e.preventDefault();
          setShowHelp(true);
        }
        return;
      }

      // Tray slots 1-8
      if (/^[1-8]$/.test(e.key) && !mod(e) && !e.altKey) {
        const idx = parseInt(e.key) - 1;
        if (idx < trayIcons.length) {
          e.preventDefault();
          onSelectTraySlot?.(idx);
        }
        return;
      }

      shortcuts[e.key]?.(e);
    },
    [trayIcons, onSelectTraySlot, canCopy, onCopySvg, onExport, onReset, armed, showHelp]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { showHelp, setShowHelp };
}

export const KEYBOARD_SHORTCUTS = [
  {
    category: "Actions",
    items: [
      { key: "⌘C / Ctrl+C", desc: "Copy SVG" },
      { key: "⌘E / Ctrl+E", desc: "Export" },
      { key: "⌘Z / Ctrl+Z", desc: "Undo" },
      { key: "⌘⇧Z / Ctrl+Shift+Z", desc: "Redo" },
      { key: "R", desc: "Reset (press twice)" },
    ],
  },
  {
    category: "Tray",
    items: [{ key: "1–8", desc: "Select slot" }],
  },
  {
    category: "Help",
    items: [
      { key: "?", desc: "Shortcuts" },
      { key: "Esc", desc: "Close / Cancel" },
    ],
  },
] as const;
