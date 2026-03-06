import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/slider";
import { CustomizationState } from "@/lib/types";

interface NoiseSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function NoiseSection({
  state,
  onChange,
  isCollapsed,
  onToggle,
}: NoiseSectionProps) {
  return (
    <Card className="bg-card border-border py-0">
      <div className="flex items-center justify-between p-3">
        <button onClick={onToggle} className="flex items-center gap-2 flex-1" aria-expanded={!isCollapsed} aria-controls="section-noise-content">
          <div>
            <h3 className="text-sm font-medium text-foreground">Noise</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add subtle grain/noise overlay
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform ml-auto",
              isCollapsed && "rotate-180",
            )}
          />
        </button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onChange({
              noise: { ...state.noise, enabled: !state.noise.enabled },
            })
          }
          aria-pressed={state.noise.enabled}
          aria-label={state.noise.enabled ? "Disable noise" : "Enable noise"}
          className={cn(
            "border-border ml-2",
            state.noise.enabled
              ? "bg-foreground text-background hover:bg-foreground/90 border-foreground"
              : "bg-background text-muted-foreground hover:bg-muted",
          )}
        >
          {state.noise.enabled ? "On" : "Off"}
        </Button>
      </div>
      {!isCollapsed && state.noise.enabled && (
        <div id="section-noise-content" className="px-4 pb-3 space-y-3 pt-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Intensity
              </span>
            </div>
            <DualRangeSlider
              label="%"
              labelPosition="static"
              labelContentPos="right"
              value={[state.noise.intensity]}
              onValueChange={([val]: number[]) =>
                val != null &&
                onChange({
                  noise: { ...state.noise, intensity: val },
                })
              }
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
