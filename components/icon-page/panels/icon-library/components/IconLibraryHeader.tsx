import { Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconCategory } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefObject, useMemo } from "react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  selectedCategory: IconCategory;
  onCategoryChange: (category: IconCategory) => void;
}

export function IconLibraryHeader({
  searchQuery,
  setSearchQuery,
  clearSearch,
  searchInputRef,
  selectedCategory,
  onCategoryChange,
}: HeaderProps) {
  const categories = useMemo<{ value: IconCategory; label: string }[]>(
    () => [
      { value: "all", label: "All" },
      { value: "outline", label: "Outline" },
      { value: "filled", label: "Filled" },
      { value: "duotone", label: "Duotone" },
      { value: "brand", label: "Brand" },
      { value: "custom", label: "Custom" },
    ],
    [],
  );

  return (
    <div className="px-3 pt-9 pb-3 border-b border-border flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 bg-muted/20 border-border text-foreground placeholder:text-muted-foreground h-9 rounded-md focus:bg-muted/40 focus:ring-0 shadow-none transition-all text-xs border"
            aria-label="Search icons and shapes"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-none">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative h-9 px-3 rounded-md border border-border bg-muted/20 text-foreground hover:bg-muted/40 flex items-center gap-2 whitespace-nowrap transition-colors text-xs font-medium focus:outline-none min-w-[100px]"
              aria-label="Category filter"
            >
              <div className="absolute -top-5.5 right-0 text-[10px] uppercase tracking-wider font-bold text-primary opacity-70">
                Category
              </div>
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary shrink-0"
              >
                <g>
                  <path
                    d="M3.75 5.75C3.75 4.64543 4.64543 3.75 5.75 3.75H8.25C9.35457 3.75 10.25 4.64543 10.25 5.75V8.25C10.25 9.35457 9.35457 10.25 8.25 10.25H5.75C4.64543 10.25 3.75 9.35457 3.75 8.25V5.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.75 15.75C3.75 14.6454 4.64543 13.75 5.75 13.75H8.25C9.35457 13.75 10.25 14.6454 10.25 15.75V18.25C10.25 19.3546 9.35457 20.25 8.25 20.25H5.75C4.64543 20.25 3.75 19.3546 3.75 18.25V15.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.75 17C13.75 15.2051 15.2051 13.75 17 13.75C18.7949 13.75 20.25 15.2051 20.25 17C20.25 18.7949 18.7949 20.25 17 20.25C15.2051 20.25 13.75 18.7949 13.75 17Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.75 5.75C13.75 4.64543 14.6454 3.75 15.75 3.75H18.25C19.3546 3.75 20.25 4.64543 20.25 5.75V8.25C20.25 9.35457 19.3546 10.25 18.25 10.25H15.75C14.6454 10.25 13.75 8.25V5.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
              <span className="truncate">
                {categories.find((c) => c.value === selectedCategory)?.label ||
                  "All"}
              </span>
              <ChevronDown className="ml-auto h-3.5 w-3.5 opacity-40 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end" sideOffset={8}>
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer transition-colors duration-200",
                  selectedCategory === cat.value &&
                    "bg-accent text-accent-foreground",
                )}
              >
                <div className="text-sm">{cat.label}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
