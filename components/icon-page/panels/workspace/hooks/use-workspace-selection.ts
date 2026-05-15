"use client";

import { useState, useCallback, useEffect } from "react";
import { IconCategory, IconData, CustomizationState } from "@/lib/types";
import { DEFAULT_TRAY_ICONS } from "@/constants/workspace";
import { getIconDataById, type IconType } from "@/lib/icons";

function customIconToData(
  ci: { id: string; name: string; url: string },
  iconType: IconType,
): IconData {
  return {
    id: ci.id,
    name: ci.name,
    url: ci.url,
    category: "custom",
    tags: ["custom", "upload"],
    iconType,
  };
}

type StoredSlot = { id: string; iconType?: IconType };

function parseTrayStorage(raw: string | null): StoredSlot[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed
      .map((entry): StoredSlot | null => {
        if (typeof entry === "string") return { id: entry };
        if (entry && typeof entry === "object" && typeof entry.id === "string") {
          return { id: entry.id, iconType: entry.iconType };
        }
        return null;
      })
      .filter((s): s is StoredSlot => s !== null);
  } catch {
    return null;
  }
}

function parseSelectedStorage(raw: string | null): StoredSlot | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.id === "string") {
      return { id: parsed.id, iconType: parsed.iconType };
    }
  } catch {
    if (typeof raw === "string" && raw.length > 0) return { id: raw };
  }
  if (typeof raw === "string" && raw.length > 0) return { id: raw };
  return null;
}

export function useWorkspaceSelection(
  customIcons: CustomizationState["customIcons"] = [],
  iconType: IconType,
) {
  const [activeCategory, setActiveCategory] = useState<IconCategory>("all");
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [trayIcons, setTrayIcons] = useState<IconData[]>(DEFAULT_TRAY_ICONS);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasLoaded) return;

    try {
      const savedSelected = parseSelectedStorage(
        localStorage.getItem("rune_selected_icon_id"),
      );
      const savedTray = parseTrayStorage(
        localStorage.getItem("rune_tray_icon_ids"),
      );

      const lookup = (slot: StoredSlot): IconData | null => {
        const slotType = slot.iconType ?? iconType;
        const custom = customIcons.find((ci) => ci.id === slot.id);
        if (custom) return customIconToData(custom, slotType);
        const data = getIconDataById(slot.id, slotType);
        return data ? { ...data, iconType: slotType } : null;
      };

      if (savedSelected) {
        const icon = lookup(savedSelected);
        if (icon) setSelectedIcon(icon);
      }

      if (savedTray && savedTray.length > 0) {
        const icons = savedTray.map(lookup).filter(Boolean) as IconData[];
        if (icons.length > 0) setTrayIcons(icons);
      }
    } catch (error) {
      console.error("Failed to load selection from storage:", error);
    } finally {
      setHasLoaded(true);
    }
  }, [hasLoaded, customIcons, iconType]);

  useEffect(() => {
    if (!hasLoaded) return;

    try {
      if (selectedIcon) {
        localStorage.setItem(
          "rune_selected_icon_id",
          JSON.stringify({
            id: selectedIcon.id,
            iconType: selectedIcon.iconType,
          }),
        );
      }
      localStorage.setItem(
        "rune_tray_icon_ids",
        JSON.stringify(
          trayIcons.map((i) => ({ id: i.id, iconType: i.iconType })),
        ),
      );
    } catch (error) {
      console.error("Failed to save selection to storage:", error);
    }
  }, [selectedIcon, trayIcons, hasLoaded]);

  const handleIconSelect = useCallback(
    (icon: IconData) => {
      const stamped: IconData = {
        ...icon,
        iconType: icon.iconType ?? iconType,
      };
      setSelectedIcon(stamped);
      setTrayIcons((prev) => {
        if (prev.find((i) => i.id === stamped.id)) return prev;
        if (prev.length >= 8) return [stamped, ...prev.slice(0, 7)];
        return [stamped, ...prev];
      });
    },
    [iconType],
  );

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
