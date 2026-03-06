import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DualRangeSlider } from "@/components/ui/slider";
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
    <Card className="bg-card border-border py-0">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-xl"
        aria-expanded={!isCollapsed}
        aria-controls="section-corner-radius-content"
      >
        <h3 className="text-sm font-medium text-foreground">Corner Radius</h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isCollapsed && "rotate-180",
          )}
        />
      </button>
      {!isCollapsed && (
        <div id="section-corner-radius-content" className="px-4 pb-3 space-y-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Radius
              </span>
              <span className="text-xs text-muted-foreground">
                {state.cornerRadius}px
              </span>
            </div>
            <DualRangeSlider
              label="px"
              labelPosition="static"
              labelContentPos="right"
              value={[state.cornerRadius]}
              onValueChange={([val]) =>
                val != null && onChange({ cornerRadius: val })
              }
              min={0}
              max={50}
              step={1}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
