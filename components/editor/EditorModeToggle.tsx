"use client";

import { memo } from "react";
import { MousePointer, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

type EditorMode = "edit" | "draw";

interface EditorModeToggleProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}

export const EditorModeToggle = memo(function EditorModeToggle({
  mode,
  onModeChange,
}: EditorModeToggleProps) {
  return (
    <div>
      <div className="flex items-center gap-0.5 p-0.5 bg-background/90 backdrop-blur-xl border border-border rounded-lg shadow-sm">
        <button
          type="button"
          onClick={() => onModeChange("edit")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            mode === "edit"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          <MousePointer className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onModeChange("draw")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            mode === "draw"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          <Pencil className="h-3.5 w-3.5" />
          Draw
        </button>
      </div>
    </div>
  );
});
