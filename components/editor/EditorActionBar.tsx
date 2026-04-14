"use client";

import { memo } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  Code,
  Download,
  Redo,
  RotateCcw,
  Undo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { CustomizationState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EditorActionBarProps {
  state: CustomizationState;
  onDimensionChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isModified: boolean;
  onReset: () => void;
  onCopySvg: () => Promise<void>;
  onDownloadSvg: () => void;
  onOpenSaveDialog: () => void;
  className?: string;
}

export const EditorActionBar = memo(function EditorActionBar({
  state,
  onDimensionChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isModified,
  onReset,
  onCopySvg,
  onDownloadSvg,
  onOpenSaveDialog,
  className,
}: EditorActionBarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex items-center gap-3 px-1 py-1 bg-background/90 backdrop-blur-xl border border-border rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_24px_-12px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.4),0_12px_24px_-12px_rgba(0,0,0,0.5)] transition-all duration-300",
          className,
        )}
      >
        {/* Size dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 border-border bg-background text-foreground hover:bg-muted flex items-center gap-2 group min-w-[100px] justify-between"
            >
              <span className="text-sm font-medium">{state.width}px</span>
              <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-24 p-1 bg-card border-border text-foreground">
            {[16, 20, 24, 28, 32, 48, 64, 96, 128].map((size) => (
              <DropdownMenuItem key={size} onClick={() => onDimensionChange(size)}>
                {size}px
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border" />

        {/* Download button */}
        <Button
          className="relative bg-foreground text-background hover:bg-foreground/90 h-10 px-5 rounded-lg font-medium transition-all hover:shadow-lg active:scale-95 group overflow-hidden"
          onClick={onDownloadSvg}
        >
          <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          <span className="relative z-10">Download</span>
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={onReset}
              disabled={!isModified}
            >
              <RotateCcw className={cn("h-4 w-4", isModified && "text-amber-500")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isModified ? "Reset to original" : "No changes"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => {
                void onCopySvg().then(() => {
                  toast.success("SVG copied to clipboard");
                });
              }}
            >
              <Code className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy SVG</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
});
