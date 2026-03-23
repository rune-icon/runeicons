"use client";

import { memo } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  Code,
  Download,
  PencilRuler,
  Redo,
  RotateCcw,
  Save,
  Undo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CustomizationState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EditorActionBarProps {
  state: CustomizationState;
  onDimensionChange: (size: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onReset: () => void;
  onCopySvg: () => Promise<void>;
  onDownloadSvg: () => void;
  onOpenSaveDialog: () => void;
  showPathEditor: boolean;
  onTogglePathEditor: () => void;
  className?: string;
}

export const EditorActionBar = memo(function EditorActionBar({
  state,
  onDimensionChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onReset,
  onCopySvg,
  onDownloadSvg,
  onOpenSaveDialog,
  showPathEditor,
  onTogglePathEditor,
  className,
}: EditorActionBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-1 py-1 bg-background/90 backdrop-blur-xl border border-border rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_24px_-12px_rgba(0,0,0,0.2)] transition-all duration-300",
        className,
      )}
    >
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

      <Button
        className="relative bg-foreground text-background hover:bg-foreground/90 h-10 px-5 rounded-lg font-medium transition-all"
        onClick={onDownloadSvg}
      >
        <Download className="h-4 w-4 mr-2" />
        Download SVG
      </Button>

      <Button
        variant="outline"
        className="h-10"
        onClick={() => {
          void onCopySvg().then(() => {
            toast.success("SVG copied to clipboard");
          });
        }}
      >
        <Code className="h-4 w-4 mr-2" />
        Copy SVG
      </Button>

      <Button variant="outline" className="h-10" onClick={onOpenSaveDialog}>
        <Save className="h-4 w-4 mr-2" />
        Save
      </Button>

      <Button variant="outline" className="h-10" onClick={onTogglePathEditor}>
        <PencilRuler className="h-4 w-4 mr-2" />
        {showPathEditor ? "Hide Editor" : "Show Editor"}
      </Button>

      <div className="h-6 w-px bg-border" />

      <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo}>
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo}>
        <Redo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        title="Reset current asset"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
});
