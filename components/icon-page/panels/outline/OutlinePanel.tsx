"use client";

import type { JSX } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomizationState, IconData } from "@/lib/types";
import { X } from "lucide-react";

type IconType = CustomizationState["iconType"];

const iconTypes: Array<{
  id: IconType;
  label: string;
  icon: () => JSX.Element;
}> = [
  {
    id: "normal",
    label: "Normal",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
      >
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    id: "duotone",
    label: "Duotone",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" fill="currentColor" fillOpacity="0.4" />
      </svg>
    ),
  },
  {
    id: "fill",
    label: "Fill",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    id: "pixelated",
    label: "Pixelated",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <rect x="4" y="4" width="4" height="4" />
        <rect x="10" y="4" width="4" height="4" />
        <rect x="16" y="4" width="4" height="4" />
        <rect x="4" y="10" width="4" height="4" />
        <rect x="10" y="10" width="4" height="4" />
        <rect x="16" y="10" width="4" height="4" />
        <rect x="4" y="16" width="4" height="4" />
        <rect x="10" y="16" width="4" height="4" />
        <rect x="16" y="16" width="4" height="4" />
      </svg>
    ),
  },
  {
    id: "glass",
    label: "Glass",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <circle
          cx="14"
          cy="10"
          r="6"
          fill="currentColor"
          fillOpacity="0.3"
          className="backdrop-blur-[1px]"
        />
      </svg>
    ),
  },
  {
    id: "isometric",
    label: "Isometric",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
      >
        <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
      </svg>
    ),
  },
  {
    id: "dither",
    label: "Dither",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <circle cx="4" cy="4" r="0.8" />
        <circle cx="10" cy="4" r="0.4" />
        <circle cx="16" cy="4" r="0.8" />
        <circle cx="22" cy="4" r="0.4" />
        <circle cx="7" cy="10" r="0.6" />
        <circle cx="13" cy="10" r="0.8" />
        <circle cx="19" cy="10" r="0.6" />
      </svg>
    ),
  },
];

export interface OutlinePanelProps {
  activeType?: IconType;
  onTypeChange?: (type: IconType) => void;
  trayIcons: IconData[];
  selectedIcon: IconData | null;
  onSelectIcon: (icon: IconData) => void;
  onRemoveFromTray: (iconName: string) => void;
}

export interface ToolRailProps {
  activeType?: IconType;
  onTypeChange?: (type: IconType) => void;
}

function IconTypeList({
  activeType,
  onTypeChange,
  compact = false,
}: {
  activeType: IconType;
  onTypeChange?: (type: IconType) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        compact ? "grid-cols-1" : "grid-cols-3",
      )}
      role="group"
      aria-label="Icon style type"
    >
      {iconTypes.map((type) => {
        const Icon = type.icon;
        const isActive = activeType === type.id;

        return (
          <Button
            key={type.id}
            variant="ghost"
            size="icon"
            onClick={() => onTypeChange?.(type.id)}
            className={cn(
              "h-8 w-8 rounded-md transition-all",
              isActive
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
            aria-label={type.label}
            aria-pressed={isActive}
            title={type.label}
          >
            <Icon />
          </Button>
        );
      })}
    </div>
  );
}

export function ToolRail({ activeType = "normal", onTypeChange }: ToolRailProps) {
  return (
    <aside className="h-full bg-background border-r border-border p-2">
      <IconTypeList activeType={activeType} onTypeChange={onTypeChange} compact />
    </aside>
  );
}

export function OutlinePanel({
  activeType = "normal",
  onTypeChange,
  trayIcons,
  selectedIcon,
  onSelectIcon,
  onRemoveFromTray,
}: OutlinePanelProps) {
  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      <div className="px-3 pt-3 pb-2 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Outline</h2>
        <p className="text-xs text-muted-foreground mt-1">Layers and styles</p>
        <div className="mt-3">
          <IconTypeList activeType={activeType} onTypeChange={onTypeChange} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {trayIcons.length === 0 ? (
          <p className="text-xs text-muted-foreground px-2 py-4">
            No layers in tray.
          </p>
        ) : (
          trayIcons.map((icon, index) => {
            const isSelected = selectedIcon?.id === icon.id;
            return (
              <div
                key={`${icon.id}-${index}`}
                className={cn(
                  "group w-full rounded-md border px-2 py-2 flex items-center gap-2 transition-colors",
                  isSelected
                    ? "bg-accent border-border"
                    : "bg-background border-transparent hover:border-border hover:bg-muted/40",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectIcon(icon)}
                  className="flex items-center gap-2 min-w-0 flex-1 text-left"
                  aria-label={`Select ${icon.name}`}
                >
                  <icon.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-foreground truncate">
                    {icon.name}
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFromTray(icon.name)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${icon.name}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
