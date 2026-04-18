import { Card } from "@/components/ui/card";
import { ChevronDown, FlipHorizontal, FlipVertical, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";

interface FlipRotateSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function FlipRotateSection({
  state,
  onChange,
}: FlipRotateSectionProps) {
  return (
    <div className="px-4 pb-4 space-y-5">
      <div className="flex flex-col gap-5 pt-2">
        <div className="flex items-center justify-between group">
          <span className="text-[13px] font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors duration-200">
            Flip
          </span>
          <div className="flex bg-muted p-0.5 rounded-lg border border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({ flipH: !state.flipH })}
              className={cn(
                "h-7 px-3 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 ease-out active:scale-95",
                state.flipH 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/20"
              )}
            >
              Horizontal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({ flipV: !state.flipV })}
              className={cn(
                "h-7 px-3 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all duration-200 ease-out active:scale-95",
                state.flipV 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/20"
              )}
            >
              Vertical
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <Scrubber
            label="Rotation"
            value={state.rotation}
            onChange={(val: number) => onChange({ rotation: val })}
            min={0}
            max={360}
          />
        </div>
      </div>
    </div>
  );
}
