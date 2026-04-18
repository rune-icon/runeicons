"use client";

import { useState, useCallback, useEffect } from "react";
import { IconCategory, IconData } from "@/lib/types";
import { DEFAULT_TRAY_ICONS } from "@/constants/workspace";
import { SAMPLE_ICONS } from "../../icon-library/constants";

export function useWorkspaceSelection() {
  const [activeCategory, setActiveCategory] = useState<IconCategory>("all");
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [trayIcons, setTrayIcons] = useState<IconData[]>(DEFAULT_TRAY_ICONS);
  const [hasLoaded, setHasLoaded] = useState(false);

  // 1. Load from LocalStorage
  useEffect(() => {
    if (typeof window === "undefined" || hasLoaded) return;

    try {
      const savedIconId = localStorage.getItem("rune_selected_icon_id");
      const savedTrayIds = localStorage.getItem("rune_tray_icon_ids");

      if (savedIconId) {
        const icon = SAMPLE_ICONS.find((i: IconData) => i.id === savedIconId);
        if (icon) setSelectedIcon(icon);
      }

      if (savedTrayIds) {
        const ids = JSON.parse(savedTrayIds) as string[];
        const icons = ids
          .map((id) => SAMPLE_ICONS.find((i: IconData) => i.id === id))
          .filter(Boolean) as IconData[];
        if (icons.length > 0) setTrayIcons(icons);
      }
    } catch (error) {
      console.error("Failed to load selection from storage:", error);
    } finally {
      setHasLoaded(true);
    }
  }, [hasLoaded]);

  // 2. Save to LocalStorage
  useEffect(() => {
    if (!hasLoaded) return;

    try {
      if (selectedIcon) {
        localStorage.setItem("rune_selected_icon_id", selectedIcon.id);
      }
      localStorage.setItem(
        "rune_tray_icon_ids",
        JSON.stringify(trayIcons.map((i: IconData) => i.id))
      );
    } catch (error) {
      console.error("Failed to save selection to storage:", error);
    }
  }, [selectedIcon, trayIcons, hasLoaded]);

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
