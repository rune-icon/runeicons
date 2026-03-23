"use client";

import { memo, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EditorAssetSummary } from "@/lib/editor/types";
import { cn } from "@/lib/utils";
import { EditorSvgPreview } from "@/components/editor/EditorSvgPreview";

interface EditorAssetLibraryProps {
  assets: EditorAssetSummary[];
  categories: Array<{ value: string; label: string }>;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  selectedAssetId: string | null;
  onAssetSelect: (asset: EditorAssetSummary) => void;
}

export const EditorAssetLibrary = memo(function EditorAssetLibrary({
  assets,
  categories,
  searchQuery,
  onSearchQueryChange,
  activeCategory,
  onCategoryChange,
  selectedAssetId,
  onAssetSelect,
}: EditorAssetLibraryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(320);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const columns = Math.max(3, Math.floor(containerWidth / 64));
  const cellSize = containerWidth / columns;
  const rowCount = Math.ceil(assets.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => cellSize,
    overscan: 3,
  });

  return (
    <div className="h-full flex flex-col bg-card border-r border-border transition-colors duration-300">
      <div className="px-3 pt-9 pb-3 border-b border-border flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search assets..."
              className="pl-9 pr-8 bg-muted/20 border-border text-foreground placeholder:text-muted-foreground h-9 rounded-md focus:bg-muted/40 focus:ring-0 shadow-none transition-all text-xs border"
              aria-label="Search Runeicons editor assets"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchQueryChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex-none">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative h-9 px-3 rounded-md border border-border bg-muted/20 text-foreground hover:bg-muted/40 flex items-center gap-2 whitespace-nowrap transition-colors text-xs font-medium focus:outline-none min-w-[112px]"
                aria-label="Asset category filter"
              >
                <span className="truncate">
                  {categories.find(
                    (category) => category.value === activeCategory,
                  )?.label ?? "All"}
                </span>
                <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-40 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end" sideOffset={8}>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.value}
                  onClick={() => onCategoryChange(category.value)}
                  className={cn(
                    "cursor-pointer",
                    activeCategory === category.value &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  {category.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
        role="tabpanel"
        aria-label="Editor assets"
      >
        {assets.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No Runeicons assets match this search.
          </div>
        ) : (
          <div
            className="relative w-full border-b border-border"
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const startIndex = virtualRow.index * columns;
              const rowAssets = assets.slice(
                startIndex,
                startIndex + columns,
              );
              return (
                <div
                  key={virtualRow.index}
                  className="absolute left-0 w-full flex"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {rowAssets.map((asset) => {
                    const isSelected = asset.id === selectedAssetId;
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => onAssetSelect(asset)}
                        className={cn(
                          "group relative aspect-square cursor-pointer overflow-hidden transition-all duration-200 border-r border-b border-border flex flex-col items-center justify-center p-2",
                          isSelected
                            ? "bg-accent"
                            : "bg-transparent hover:bg-muted",
                        )}
                        style={{ width: `${cellSize}px` }}
                        aria-label={`${asset.name} asset`}
                      >
                        <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                          <EditorSvgPreview
                            document={asset}
                            className={cn(
                              "max-h-10 max-w-10 transition-transform duration-200 group-hover:scale-110",
                              isSelected
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <span className="text-[10px] leading-tight text-center text-muted-foreground truncate w-full">
                          {asset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});
