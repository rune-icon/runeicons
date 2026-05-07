"use client";

import type { JSX } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomizationState, IconData } from "@/lib/types";
import { X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NormalIcon } from "@/components/icons/NormalIcon";
import { DuotoneIcon } from "@/components/icons/DuotoneIcon";
import { FillIcon } from "@/components/icons/FillIcon";
import { PixelatedIcon } from "@/components/icons/PixelatedIcon";
import { GlassIcon } from "@/components/icons/GlassIcon";
import { IsometricIcon } from "@/components/icons/IsometricIcon";
import { DitherIcon } from "@/components/icons/DitherIcon";

type IconType = CustomizationState["iconType"];

const iconTypes: Array<{
  id: IconType;
  label: string;
  icon: () => JSX.Element;
}> = [
  {
    id: "normal",
    label: "Normal",
    icon: () => <NormalIcon className="h-4 w-4" />,
  },
  {
    id: "duotone",
    label: "Duotone",
    icon: () => <DuotoneIcon className="h-4 w-4" />,
  },
  {
    id: "fill",
    label: "Fill",
    icon: () => <FillIcon className="h-4 w-4" />,
  },
  {
    id: "pixelated",
    label: "Pixelated",
    icon: () => <PixelatedIcon className="h-4 w-4" />,
  },
  {
    id: "glass",
    label: "Glass",
    icon: () => <GlassIcon className="h-4 w-4" />,
  },
  {
    id: "isometric",
    label: "Isometric",
    icon: () => <IsometricIcon className="h-4 w-4" />,
  },
  {
    id: "dither",
    label: "Dither",
    icon: () => <DitherIcon className="h-4 w-4" />,
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
    <TooltipProvider delayDuration={0}>
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
            <Tooltip key={type.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTypeChange?.(type.id)}
                  className={cn(
                    "h-8 w-8 rounded-md transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.96]",
                    isActive
                      ? "bg-primary/20 text-primary hover:bg-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  aria-label={type.label}
                  aria-pressed={isActive}
                >
                  <Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={compact ? "right" : "bottom"} className="font-medium text-xs">
                {type.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

export function ToolRail({ activeType = "normal", onTypeChange }: ToolRailProps) {
  return (
    <aside 
      className="h-full border-r border-border p-2 flex flex-col justify-between z-10 relative bg-workspace-pattern"
    >
      <div className="absolute inset-0 bg-background/90 pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <IconTypeList activeType={activeType} onTypeChange={onTypeChange} compact />
        <div className="mt-auto pt-4 flex justify-center border-t border-border/20">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.96]">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
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
    <div className="h-full flex flex-col bg-workspace-pattern border-r border-border relative">
      <div className="absolute inset-0 bg-background/80 pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="px-3 pt-3 pb-2 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Outline</h2>
          <p 
            className="text-xs text-muted-foreground mt-1 whitespace-normal"
            style={{ textWrap: 'balance' } as any}
          >
            Layers and styles
          </p>
          <div className="mt-3">
            <IconTypeList activeType={activeType} onTypeChange={onTypeChange} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          <AnimatePresence mode="popLayout" initial={false}>
            {trayIcons.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                className="px-2 py-4"
              >
                <p className="text-xs text-muted-foreground">No layers in tray.</p>
              </motion.div>
            ) : (
              trayIcons.map((icon, index) => {
                const isSelected = selectedIcon?.id === icon.id;
                return (
                  <motion.div
                    key={`${icon.id}-${index}`}
                    initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                    transition={{
                      type: "spring",
                      duration: 0.3,
                      bounce: 0,
                      delay: Math.min(index * 0.05, 0.3),
                    }}
                    className={cn(
                      "group w-full rounded-md border px-2 py-2 flex items-center gap-2 transition-[background-color,border-color,scale,box-shadow] duration-150 ease-out active:scale-[0.96] outline outline-1 -outline-offset-1 outline-black/5 dark:outline-white/5 shadow-sm",
                      isSelected
                        ? "bg-accent border-border/60"
                        : "bg-background border-transparent hover:border-border/30 hover:bg-muted/40",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectIcon(icon)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left"
                      aria-label={`Select ${icon.name}`}
                    >
                      <icon.icon className={cn(
                        "h-4 w-4 shrink-0 transition-colors duration-200",
                        isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className={cn(
                        "text-xs truncate transition-colors duration-200",
                        isSelected ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {icon.name}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveFromTray(icon.name)}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity active:scale-[0.96]"
                      aria-label={`Remove ${icon.name}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
