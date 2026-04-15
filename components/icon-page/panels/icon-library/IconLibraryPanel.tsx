"use client";

import { IconLibraryPanelProps } from "./types";
import { useIconLibrary } from "./hooks/use-icon-library";
import { IconLibraryHeader } from "./components/IconLibraryHeader";
import { IconGrid } from "./components/IconGrid";
import { EmptyState } from "./components/EmptyState";

export function IconLibraryPanel({
  onIconSelect,
  selectedIconId,
  selectedCategory,
  onCategoryChange,
}: IconLibraryPanelProps) {
  const {
    searchQuery,
    setSearchQuery,
    filteredIcons,
    handleIconClick,
    clearSearch,
    searchInputRef,
  } = useIconLibrary(selectedCategory, onIconSelect);

  return (
    <div className="h-full flex flex-col bg-workspace-pattern border-r border-border relative group/panel">
      <div className="absolute inset-0 bg-background/80 pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <IconLibraryHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          searchInputRef={searchInputRef}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />

        <div
          className="flex-1 overflow-y-auto scrollbar-hide"
          role="tabpanel"
          aria-label="Assets"
        >
          <IconGrid
            icons={filteredIcons}
            selectedIconId={selectedIconId ?? null}
            onIconClick={handleIconClick}
          />
          <EmptyState isVisible={filteredIcons.length === 0} onClearSearch={clearSearch} />
        </div>
      </div>
    </div>
  );
}
