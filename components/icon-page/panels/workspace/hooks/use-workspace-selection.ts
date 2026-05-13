"use client";

import { useState, useCallback, useEffect } from "react";
import { IconCategory, IconData, CustomizationState } from "@/lib/types";
import { DEFAULT_TRAY_ICONS } from "@/constants/workspace";
import { REAL_ICONS } from "../../icon-library/icons-data";

export function useWorkspaceSelection(customIcons: CustomizationState["customIcons"] = []) {
  const [activeCategory, setActiveCategory] = useState<IconCategory>("all");
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [trayIcons, setTrayIcons] = useState<IconData[]>(DEFAULT_TRAY_ICONS);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasLoaded) return;

    try {
      const savedIconId = localStorage.getItem("rune_selected_icon_id");
      const savedTrayIds = localStorage.getItem("rune_tray_icon_ids");

      const allIcons = [
        ...REAL_ICONS,
        ...customIcons.map((ci) => ({
          id: ci.id,
          name: ci.name,
          icon: null as any,
          url: ci.url,
          category: "custom" as const,
          tags: ["custom", "upload"],
        })),
      ];

      if (savedIconId) {
        const icon = allIcons.find((i: any) => i.id === savedIconId);
        if (icon) setSelectedIcon(icon);
      }

      if (savedTrayIds) {
        const ids = JSON.parse(savedTrayIds) as string[];
        const icons = ids
          .map((id) => allIcons.find((i: any) => i.id === id))
          .filter(Boolean) as IconData[];
        if (icons.length > 0) setTrayIcons(icons);
      }
    } catch (error) {
      console.error("Failed to load selection from storage:", error);
    } finally {
      setHasLoaded(true);
    }
  }, [hasLoaded, customIcons]);

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
    setTrayIcons((prev) => {
      if (prev.find((i) => i.id === icon.id)) return prev;
      if (prev.length >= 8) return [icon, ...prev.slice(0, 7)];
      return [icon, ...prev];
    });
  }, []);

  const handleRemoveFromTray = (iconId: string) => {
    setTrayIcons((prev) => prev.filter((i) => i.id !== iconId));
  };

  const handleRemoveById = useCallback((id: string) => {
    setTrayIcons((prev) => prev.filter((i) => i.id !== id));
    setSelectedIcon((prev) => (prev?.id === id ? null : prev));
  }, []);

  return {
    activeCategory,
    setActiveCategory,
    selectedIcon,
    setSelectedIcon,
    trayIcons,
    handleIconSelect,
    handleRemoveFromTray,
    handleRemoveById,
  };
}
