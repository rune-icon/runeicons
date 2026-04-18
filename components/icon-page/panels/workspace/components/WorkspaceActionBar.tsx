"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  RotateCcw,
  Code,
  Undo,
  Redo,
  ChevronDown,
  FileCode,
  Box,
  Layers,
  Check,
  X,
  Grid3X3,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IconData, CustomizationState } from "@/lib/types";
import { generateStandaloneSvg } from "@/lib/svg-export-utils";
import {
  generateReactSnippet,
  generateFramerMotionSnippet,
  generateTailwindSnippet,
  generateFigmaSvgSnippet,
} from "@/lib/code-snippets";
import { useTuning } from "@/components/icon-page/tuning";
import { motion, AnimatePresence } from "motion/react";

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
          "flex items-center gap-3 px-1 py-1 bg-background/90 backdrop-blur-xl border border-border rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_24px_-12px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.4),0_12px_24px_-12px_rgba(0,0,0,0.5)] transition-shadow duration-200",
          className,
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 border-border bg-background text-foreground hover:bg-muted flex items-center gap-2 group min-w-[100px] justify-between"
              aria-label="Change Dimension"
            >
              <span className="text-sm font-medium">{state?.width}px</span>
              <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-24 p-1 bg-card border-border text-foreground"
          >
            {[16, 20, 24, 28, 32, 48, 64, 96, 128].map((size) => (
              <DropdownMenuItem
                key={size}
                className="flex items-center justify-between px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
                onClick={() => onChange?.({ width: size, height: size })}
              >
                <span>{size}px</span>
                {state?.width === size && state?.height === size && (
                  <Check className="h-3.5 w-3.5 ml-2" />
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
            className="relative bg-foreground text-background hover:bg-foreground/90 h-10 px-5 rounded-l-lg rounded-r-none font-medium transition-transform duration-150 ease-out hover:z-10 group overflow-hidden border-r border-background/20"
            aria-label="Copy SVG to clipboard"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
            <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200 ease-out" />
            <span className="relative z-10">Export SVG</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-foreground text-background hover:bg-foreground/90 h-10 px-2 rounded-r-lg rounded-l-none border-l border-background/10 transition-colors"
                aria-label="More Export Options"
              >
                <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-1 bg-card border-border text-foreground"
            >
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
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
                <div className="flex-1 flex items-center justify-between">
                  <span>Copy as SVG</span>
                  <span className="text-[10px] opacity-50 font-mono">SVG</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
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
                className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
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
                className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-foreground focus:text-background bg-foreground text-background font-medium cursor-pointer"
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
                className="flex items-center gap-0 bg-muted/50 rounded-lg p-0.5 border border-border overflow-hidden"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleConfirmReset}
                  className="h-8 w-8 text-foreground hover:bg-primary/20 bg-primary/10 rounded-md transition-colors"
                  aria-label="Confirm Reset"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <div className="px-2 text-[10px] font-mono font-bold text-muted-foreground w-6 text-center">
                  {timeLeft}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={disarmReset}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-md transition-colors"
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
                  "h-10 w-10 transition-all duration-150 ease-out active:scale-[0.97] text-muted-foreground hover:text-foreground hover:bg-muted",
                  isResetArmed && "opacity-0 scale-75 pointer-events-none"
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
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 ease-out active:scale-[0.97]"
              aria-label="Animation and Code Options"
            >
              <Code className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 p-1 bg-card border-border text-foreground"
          >
            <DropdownMenuItem
              className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
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
              className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
              onClick={() => {
                if (selectedIcon && state) {
                  copyToClipboard(generateFramerMotionSnippet(selectedIcon, state), "Animation Code");
                }
              }}
            >
              <Layers className="h-4 w-4" />
              <span>Copy Animation (Framer)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
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

        <div className="h-6 w-px bg-border hidden" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 ease-out active:scale-[0.97]"
              aria-label="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Undo <span className="opacity-50 text-[10px] ml-1">Ctrl+Z</span></p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 ease-out active:scale-[0.97]"
              aria-label="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Redo <span className="opacity-50 text-[10px] ml-1">Ctrl+Shift+Z</span></p>
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
                "h-10 w-10 transition-colors duration-150 ease-out active:scale-[0.97]",
                showGrid ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
