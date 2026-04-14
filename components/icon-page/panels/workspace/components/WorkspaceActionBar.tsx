"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  RotateCcw,
  Code,
  Undo,
  Redo,
  Copy,
  ChevronDown,
  FileCode,
  Smartphone,
  Box,
  Layers,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  onReset,
  onCode,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  selectedIcon,
  state,
  onChange,
  className,
}: WorkspaceActionBarProps) {
  const { values, getSpring } = useTuning();
  const [isResetArmed, setIsResetArmed] = useState(false);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const disarmReset = useCallback(() => {
    setIsResetArmed(false);
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  }, []);

  const armReset = useCallback(() => {
    setIsResetArmed(true);
    resetTimeoutRef.current = setTimeout(() => {
      setIsResetArmed(false);
    }, 2000);
  }, []);

  const handleResetClick = useCallback(() => {
    if (isResetArmed) {
      disarmReset();
      onReset?.();
      toast.success("Customizations reset");
    } else {
      armReset();
    }
  }, [isResetArmed, disarmReset, armReset, onReset]);

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
  };

  return (
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="relative bg-foreground text-background hover:bg-foreground/90 h-10 px-5 rounded-lg font-medium transition-transform duration-150 ease-out hover:shadow-lg active:scale-[0.97] group overflow-hidden pr-3"
            aria-label="Download and Copy Options"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
            <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200 ease-out" />
            <span className="relative z-10 mr-1">Export SVG</span>
            <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 p-1 bg-card border-border text-foreground"
        >
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
            onClick={() =>
              selectedIcon && copyToClipboard(selectedIcon.name, "Name")
            }
          >
            <Copy className="h-4 w-4" />
            <span>Copy Name</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
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
                if (state) {
                    copyToClipboard(generateTailwindSnippet(state), "Tailwind Classes");
                }
            }}
          >
            <Smartphone className="h-4 w-4" />
            <span>Copy Tailwind Classes</span>
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


      <motion.div
        animate={isResetArmed ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={isResetArmed ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" } : { duration: 0.15 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleResetClick}
          className={cn(
            "h-10 w-10 transition-all duration-150 ease-out active:scale-[0.97] relative overflow-hidden",
            isResetArmed
              ? "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          aria-label={isResetArmed ? "Click again to confirm reset" : "Reset"}
          title={isResetArmed ? "Click again to confirm" : "Reset"}
        >
          <AnimatePresence mode="wait">
            {isResetArmed ? (
              <motion.div
                key="alert"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={getSpring({ stiffness: 500, damping: 25 })}
              >
                <AlertTriangle className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="rotate"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={getSpring({ stiffness: 400, damping: 25 })}
              >
                <RotateCcw className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 ease-out active:scale-[0.97]"
            aria-label="Animation and Code Options"
            title="Animation & Code"
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

      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 ease-out active:scale-[0.97]"
        aria-label="Undo"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        disabled={!canRedo}
        className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 ease-out active:scale-[0.97]"
        aria-label="Redo"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}
