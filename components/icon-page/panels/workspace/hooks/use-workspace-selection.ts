"use client";

import { useState, useCallback } from "react";
import { IconCategory, IconData } from "@/lib/types";
import { DEFAULT_TRAY_ICONS } from "@/constants/workspace";

export function useWorkspaceSelection() {
  const [activeCategory, setActiveCategory] = useState<IconCategory>("all");
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [trayIcons, setTrayIcons] = useState<IconData[]>(DEFAULT_TRAY_ICONS);

  const handleIconSelect = useCallback((icon: IconData) => {
    setSelectedIcon(icon);
    // Automatically add to tray if not already there and space available
    setTrayIcons((prev) => {
      if (prev.find((i) => i.name === icon.name)) return prev;
      if (prev.length >= 5) return [icon, ...prev.slice(0, 4)];
      return [icon, ...prev];
    });
  }, []);

  const handleRemoveFromTray = (iconName: string) => {
    setTrayIcons((prev) => prev.filter((i) => i.name !== iconName));
  };

  return {
    activeCategory,
    setActiveCategory,
    selectedIcon,
    setSelectedIcon,
    trayIcons,
    handleIconSelect,
    handleRemoveFromTray,
  };
}
