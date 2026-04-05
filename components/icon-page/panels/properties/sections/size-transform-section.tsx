import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";

interface SizeTransformSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SizeTransformSection({
  state,
  onChange,
  isCollapsed,
  onToggle,
}: SizeTransformSectionProps) {
  return (
    <Card className="bg-card border-border py-0 gap-0">
      <div className="w-full flex items-center justify-between p-1 pr-3">
        <button
          onClick={onToggle}
          className="flex-1 p-2 flex items-center gap-2 hover:bg-muted/50 transition-colors rounded-xl text-left"
          aria-expanded={!isCollapsed}
          aria-controls="section-size-transform-content"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
          <h3 className="text-sm font-medium text-foreground">
            Size & Transform
          </h3>
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onChange({ blurEnabled: !state.blurEnabled });
          }}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={state.blurEnabled ? "Disable Blur" : "Enable Blur"}
        >
          {state.blurEnabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>
      {!isCollapsed && state.blurEnabled && (
        <div id="section-size-transform-content" className="px-4 pb-3 space-y-1.5">
          <div className="pt-1">
            <Scrubber
              label="Blur"
              value={state.blur}
              onChange={(val: number) => onChange({ blur: val })}
              min={0}
              max={50}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
