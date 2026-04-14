"use client";

import { create } from "zustand";
import { IconData, IconCategory } from "@/lib/types";
import { DEFAULT_TRAY_ICONS } from "@/constants/workspace";

const MAX_TRAY_ITEMS = 5;

interface WorkspaceSelectionStore {
  activeCategory: IconCategory;
  selectedIcon: IconData | null;
  trayIcons: IconData[];
  setActiveCategory: (category: IconCategory) => void;
  setSelectedIcon: (icon: IconData | null) => void;
  handleIconSelect: (icon: IconData) => void;
  handleRemoveFromTray: (iconName: string) => void;
}

export const useWorkspaceSelectionStore = create<WorkspaceSelectionStore>(
  (set) => ({
    activeCategory: "all",
    selectedIcon: null,
    trayIcons: DEFAULT_TRAY_ICONS,
    setActiveCategory: (category) => set({ activeCategory: category }),
    setSelectedIcon: (icon) => set({ selectedIcon: icon }),
    handleIconSelect: (icon) =>
      set((state) => ({
        selectedIcon: icon,
        trayIcons: state.trayIcons.find((i) => i.name === icon.name)
          ? state.trayIcons
          : state.trayIcons.length >= MAX_TRAY_ITEMS
            ? [icon, ...state.trayIcons.slice(0, MAX_TRAY_ITEMS - 1)]
            : [icon, ...state.trayIcons],
      })),
    handleRemoveFromTray: (iconName) =>
      set((state) => ({
        trayIcons: state.trayIcons.filter((i) => i.name !== iconName),
      })),
  }),
);
