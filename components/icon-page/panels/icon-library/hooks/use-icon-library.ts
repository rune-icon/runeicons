import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { IconCategory, IconData } from "@/lib/types";
import { SAMPLE_ICONS } from "../constants";

export function useIconLibrary(
  selectedCategory: IconCategory,
  onIconSelect?: (icon: IconData) => void
) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Implement Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons = SAMPLE_ICONS;

    // Filter by category
    if (selectedCategory !== "all") {
      icons = icons.filter((icon) => icon.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      icons = icons.filter(
        (icon) =>
          icon.name.toLowerCase().includes(query) ||
          icon.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    return icons;
  }, [searchQuery, selectedCategory]);

  const handleIconClick = useCallback(
    (icon: IconData) => {
      onIconSelect?.(icon);
    },
    [onIconSelect],
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredIcons,
    handleIconClick,
    clearSearch,
    searchInputRef,
  };
}

