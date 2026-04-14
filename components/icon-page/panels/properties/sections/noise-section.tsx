import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";
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
    <Card className="bg-card border-border py-0 gap-0">
      <div className="w-full flex items-center justify-between p-1 pr-3">
        <button
          onClick={onToggle}
          className="flex-1 p-2 flex items-center gap-2 hover:bg-muted/50 transition-colors rounded-xl text-left"
          aria-expanded={!isCollapsed}
          aria-controls="section-noise-content"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
          <h3 className="text-sm font-medium text-foreground">Noise</h3>
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onChange({
              noise: { ...state.noise, enabled: !state.noise.enabled },
            });
          }}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={state.noise.enabled ? "Disable Noise" : "Enable Noise"}
        >
          {state.noise.enabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>
      {!isCollapsed && state.noise.enabled && (
        <div id="section-noise-content" className="px-4 pb-3 space-y-2 pt-1">
          <p className="text-[10px] text-muted-foreground pt-1">
            Add subtle grain/noise overlay
          </p>

          <div className="pt-1 relative">
            <Scrubber
              label="Intensity"
              value={state.noise.intensity}
              onChange={(val: number) =>
                onChange({
                  noise: { ...state.noise, intensity: val },
                })
              }
              min={0}
              max={100}
              trackClassName="noise-track-custom"
              fillClassName="hidden"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
