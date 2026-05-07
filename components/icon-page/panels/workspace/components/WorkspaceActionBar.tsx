"use client";

import { useCallback, useRef, useState } from "react";

import {
  Box,
  Check,
  ChevronDown,
  Code,
  Download,
  FileCode,
  Grid3X3,
  Layers,
  Redo,
  RotateCcw,
  Undo,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { useTuning } from "@/components/icon-page/tuning";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  generateFigmaSvgSnippet,
  generateFramerMotionSnippet,
  generateReactSnippet,
  generateTailwindSnippet,
} from "@/lib/code-snippets";
import { generateStandaloneSvg } from "@/lib/svg-export-utils";
import { CustomizationState, IconData } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface WorkspaceActionBarProps {
  onDownload?: () => void;
  onReset?: () => void;
  onCode?: (code: string) => void;
  onGridToggle?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  showGrid?: boolean;
  selectedIcon?: IconData | null;
  state?: CustomizationState;
  onChange?: (updates: Partial<CustomizationState>) => void;
  className?: string;
}

export function WorkspaceActionBar({
  onDownload,
  onReset,
  onCode,
  onGridToggle,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  showGrid = false,
  selectedIcon,
  state,
  onChange,
  className,
}: WorkspaceActionBarProps) {
  useTuning();
  const [isResetArmed, setIsResetArmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const disarmReset = useCallback(() => {
    setIsResetArmed(false);
    setTimeLeft(5);
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const armReset = useCallback(() => {
    setIsResetArmed(true);
    setTimeLeft(5);

    // Countdown interval
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          disarmReset();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    // Safety auto-close timeout
    resetTimeoutRef.current = setTimeout(() => {
      disarmReset();
    }, 5000);
  }, [disarmReset]);

  const handleResetClick = useCallback(() => {
    if (!isResetArmed) {
      armReset();
    }
  }, [isResetArmed, armReset]);

  const handleConfirmReset = useCallback(() => {
    disarmReset();
    onReset?.();
    toast.success("Customizations reset");
  }, [disarmReset, onReset]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getSvgContent = () => {
    if (!selectedIcon || !state) return "";
    try {
      return generateStandaloneSvg(selectedIcon, state);
    } catch (error) {
      console.error("Failed to generate SVG:", error);
      toast.error("Enhanced export failed. Falling back to basic copy.");
      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${state.width}" height="${state.height}" viewBox="0 0 24 24" fill="none" stroke="${state.colors[0]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <use href="#${selectedIcon.id}" />
</svg>`;
    }
  };

  const downloadSvg = () => {
    const svg = getSvgContent();
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedIcon?.name.toLowerCase().replace(/\s+/g, "-") || "icon"}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("SVG downloaded successfully");
    onDownload?.();
  };

  return (
    <TooltipProvider delayDuration={400}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border bg-background/90 px-1 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_24px_-12px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-shadow duration-200 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.4),0_12px_24px_-12px_rgba(0,0,0,0.5)]",
          className,
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="group flex h-10 min-w-[100px] items-center justify-between gap-2 border-border bg-background px-4 text-foreground hover:bg-muted"
              aria-label="Change Dimension"
            >
              <span className="text-sm font-medium">{state?.width}px</span>
              <ChevronDown className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)] border-border bg-card p-1 text-foreground"
          >
            {[16, 20, 24, 28, 32, 48, 64, 96, 128].map((size) => (
              <DropdownMenuItem
                key={size}
                className="relative flex cursor-pointer items-center justify-start px-2 py-1.5 text-sm focus:bg-muted focus:text-foreground"
                onClick={() => onChange?.({ width: size, height: size })}
              >
                <span className="font-medium">{size}px</span>
                {state?.width === size && state?.height === size && (
                  <Check className="absolute right-4 h-3.5 w-3.5 opacity-50" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center -space-x-px">
          <Button
            onClick={() => {
              const svg = getSvgContent();
              if (svg) {
                copyToClipboard(svg, "SVG");
              } else {
                toast.error("Select an icon first");
              }
            }}
            className="group relative h-10 overflow-hidden rounded-l-lg rounded-r-none border-r border-background/20 bg-foreground px-5 font-medium text-background transition-[scale,background-color] duration-150 ease-out hover:z-10 hover:bg-foreground/90 active:scale-[0.96]"
            aria-label="Copy SVG to clipboard"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
            <Download className="mr-2 h-4 w-4 transition-transform duration-200 ease-out group-hover:scale-110" />
            <span className="relative z-10">Export SVG</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-10 rounded-l-none rounded-r-lg border-l border-background/10 bg-foreground px-2 text-background transition-[scale,background-color] hover:bg-foreground/90 active:scale-[0.96]"
                aria-label="More Export Options"
              >
                <ChevronDown className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 border-border bg-card p-1 text-foreground"
            >
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-3 px-2 py-1.5 text-sm focus:bg-muted focus:text-foreground"
                onClick={() => {
                  const svg = getSvgContent();
                  if (svg) {
                    copyToClipboard(svg, "SVG");
                  } else {
                    toast.error("Select an icon first");
                  }
                }}
              >
                <FileCode className="h-4 w-4" />
                <div className="flex flex-1 items-center justify-between">
                  <span>Copy as SVG</span>
                  <span className="font-mono text-[10px] opacity-50">SVG</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-3 px-2 py-1.5 text-sm focus:bg-muted focus:text-foreground"
                onClick={() => {
                  if (selectedIcon && state) {
                    copyToClipboard(generateReactSnippet(selectedIcon, state), "React Component");
                  }
                }}
              >
                <Layers className="h-4 w-4" />
                <span>Copy as React</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-3 px-2 py-1.5 text-sm focus:bg-muted focus:text-foreground"
                onClick={() => {
                  if (selectedIcon && state) {
                    copyToClipboard(generateFigmaSvgSnippet(selectedIcon, state), "Figma SVG");
                  }
                }}
              >
                <Box className="h-4 w-4" />
                <span>Copy for Figma</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-3 bg-foreground px-2 py-1.5 text-sm font-medium text-background focus:bg-foreground focus:text-background"
                onClick={downloadSvg}
              >
                <Download className="h-4 w-4" />
                <span>Download as SVG</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence mode="popLayout">
            {isResetArmed && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="flex items-center gap-0 overflow-hidden rounded-lg border border-border bg-muted/50 p-0.5"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleConfirmReset}
                  className="h-8 w-8 rounded-md bg-primary/10 text-foreground transition-colors hover:bg-primary/20"
                  aria-label="Confirm Reset"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <div className="w-6 px-2 text-center font-mono text-[10px] font-bold text-muted-foreground">
                  {timeLeft}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={disarmReset}
                  className="h-8 w-8 rounded-md text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Cancel Reset"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetClick}
                disabled={isResetArmed}
                className={cn(
                  "h-10 w-10 text-muted-foreground transition-all duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.96]",
                  isResetArmed && "pointer-events-none scale-75 opacity-0",
                )}
                aria-label="Reset all customizations"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Reset all customizations</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.96]"
              aria-label="Animation and Code Options"
            >
              <Code className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 border-border bg-card p-1 text-foreground"
          >
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-3 px-2 py-1.5 text-sm focus:bg-muted focus:text-foreground"
              onClick={() => {
                if (selectedIcon && state && onCode) {
                  onCode(generateReactSnippet(selectedIcon, state));
                }
              }}
            >
              <Code className="h-4 w-4" />
              <span>View React Code</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-3 px-2 py-1.5 text-sm focus:bg-muted focus:text-foreground"
              onClick={() => {
                if (selectedIcon && state) {
                  copyToClipboard(
                    generateFramerMotionSnippet(selectedIcon, state),
                    "Animation Code",
                  );
                }
              }}
            >
              <Layers className="h-4 w-4" />
              <span>Copy Animation (Framer)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-3 px-2 py-1.5 text-sm focus:bg-muted focus:text-foreground"
              onClick={() => {
                if (state) {
                  copyToClipboard(generateTailwindSnippet(state), "CSS Animation");
                }
              }}
            >
              <FileCode className="h-4 w-4" />
              <span>Copy CSS Props</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden h-6 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-10 w-10 text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>
              Undo <span className="ml-1 text-[10px] opacity-50">Ctrl+Z</span>
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-10 w-10 text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>
              Redo <span className="ml-1 text-[10px] opacity-50">Ctrl+Shift+Z</span>
            </p>
          </TooltipContent>
        </Tooltip>

        <div className="h-6 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={showGrid ? "secondary" : "ghost"}
              size="icon"
              onClick={onGridToggle}
              className={cn(
                "h-10 w-10 transition-colors duration-150 ease-out active:scale-[0.96]",
                showGrid
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-label={showGrid ? "Hide Grid" : "Show Grid"}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{showGrid ? "Hide Grid" : "Show Grid"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
