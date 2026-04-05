import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";

interface CornerRadiusSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function CornerRadiusSection({
  state,
  onChange,
  isCollapsed,
  onToggle,
}: CornerRadiusSectionProps) {
  return (
    <Card className="bg-card border-border py-0 gap-0">
      <div className="w-full flex items-center justify-between p-1 pr-3">
        <button
          onClick={onToggle}
          className="flex-1 p-2 flex items-center gap-2 hover:bg-muted/50 transition-colors rounded-xl text-left"
          aria-expanded={!isCollapsed}
          aria-controls="section-corner-radius-content"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
          <h3 className="text-sm font-medium text-foreground">Corner Radius</h3>
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onChange({ cornerRadiusEnabled: !state.cornerRadiusEnabled });
          }}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={state.cornerRadiusEnabled ? "Disable Corner Radius" : "Enable Corner Radius"}
        >
          {state.cornerRadiusEnabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>
      {!isCollapsed && state.cornerRadiusEnabled && (
        <div id="section-corner-radius-content" className="px-4 pb-8 space-y-2">
          <div>
            <Scrubber
              label="Radius"
              value={state.cornerRadius}
              onChange={(val: number) => onChange({ cornerRadius: val })}
              min={0}
              max={50}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
