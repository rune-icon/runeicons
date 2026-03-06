import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DualRangeSlider } from "@/components/ui/slider";
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
    <Card className="bg-card border-border py-0">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center rounded-xl justify-between hover:bg-muted/50 transition-colors"
        aria-expanded={!isCollapsed}
        aria-controls="section-size-transform-content"
      >
        <h3 className="text-sm font-medium text-foreground">
          Size & Transform
        </h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isCollapsed && "rotate-180",
          )}
        />
      </button>
      {!isCollapsed && (
        <div id="section-size-transform-content" className="px-4 pb-3 space-y-2">
          <div className="">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Scale</span>
            </div>
            <DualRangeSlider
              label=""
              labelPosition="static"
              labelContentPos="right"
              value={[state.scale]}
              onValueChange={([val]) => val != null && onChange({ scale: val })}
              min={0.1}
              max={2}
              step={0.1}
            />
          </div>

          <div className="">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Blur</span>
            </div>
            <DualRangeSlider
              label="px"
              labelPosition="static"
              labelContentPos="right"
              value={[state.blur]}
              onValueChange={([val]) => val != null && onChange({ blur: val })}
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
