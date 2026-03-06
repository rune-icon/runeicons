"use client";

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

export interface WorkspaceActionBarProps {
  onDownload?: () => void;
  onReset?: () => void;
  onCode?: () => void;
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

    // Lucide icons usually render as <svg>...</svg>
    // Since we are applying styles in the main page, we should try to replicate that
    // However, for code copy, users usually want the base Lucide icon or the customized SVG

    // For a quick implementation that matches the "Customized SVG" feel:
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${state.width}" height="${state.height}" viewBox="0 0 24 24" fill="none" stroke="${state.colors[0]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Lucide Icon: ${selectedIcon.name} -->
  <use href="#${selectedIcon.id}" />
</svg>`;
    // Note: This is a placeholder for more complex SVG generation if needed.
    // In a real app, you'd render the icon component and extract its path.
  };

  const downloadSvg = () => {
    const svg = getSvgContent();
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedIcon?.name || "icon"}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("SVG downloaded successfully");
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-1 py-1 bg-background/90 backdrop-blur-xl border border-border rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1),0_12px_24px_-12px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.4),0_12px_24px_-12px_rgba(0,0,0,0.5)] transition-all duration-300",
        className,
      )}
    >
      {/* Dimension Dropdown */}
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

      {/* Divider */}
      <div className="h-6 w-px bg-border" />

      {/* Advanced Download Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="relative bg-foreground text-background hover:bg-foreground/90 h-10 px-5 rounded-lg font-medium transition-all hover:shadow-lg active:scale-95 group overflow-hidden pr-3"
            aria-label="Download and Copy Options"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            <span className="relative z-10 mr-1">Download Image</span>
            <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
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
              <span className="text-[10px] opacity-50 font-mono">✓</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
            onClick={() =>
              copyToClipboard(
                `import { ${selectedIcon?.name} } from 'lucide-react';`,
                "React",
              )
            }
          >
            <Layers className="h-4 w-4" />
            <span>Copy as React</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 text-sm opacity-50 cursor-not-allowed"
            disabled
          >
            <Smartphone className="h-4 w-4" />
            <span>Copy as React Native (Coming soon)</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 text-sm opacity-50 cursor-not-allowed"
            disabled
          >
            <Box className="h-4 w-4" />
            <span>Copy as Solid (Coming soon)</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 text-sm opacity-50 cursor-not-allowed"
            disabled
          >
            <FileCode className="h-4 w-4" />
            <span>Copy as Vue (Coming soon)</span>
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

      {/* Divider */}
      <div className="h-6 w-px bg-border" />

      {/* Secondary Actions */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (window.confirm("Reset all customizations? This cannot be undone.")) {
            onReset?.();
          }
        }}
        className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
        aria-label="Reset"
        title="Reset"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
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
            onClick={onCode}
          >
            <Code className="h-4 w-4" />
            <span>View React Code</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
            onClick={() =>
              copyToClipboard("// Framer Motion Code...", "Animation")
            }
          >
            <Layers className="h-4 w-4" />
            <span>Copy Animation (Framer)</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 text-sm focus:bg-muted focus:text-foreground cursor-pointer"
            onClick={() => copyToClipboard(".animate-pulse { ... }", "CSS")}
          >
            <FileCode className="h-4 w-4" />
            <span>Copy CSS Animation</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2 text-sm opacity-50 cursor-not-allowed"
            disabled
          >
            <Box className="h-4 w-4" />
            <span>Export as Lottie (Coming soon)</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Divider */}
      <div className="h-6 w-px bg-border hidden" />

      {/* History Actions */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        disabled={!canUndo}
        className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
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
        className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Redo"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}
