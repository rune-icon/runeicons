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
    <div className="border-t border-border mt-2 pt-2">
      <div className="w-full flex items-center justify-between p-1 pr-3">
        <button
          onClick={onToggle}
          className="flex-1 p-2 flex items-center gap-2 hover:bg-muted/50 transition-colors rounded-xl text-left"
          aria-expanded={!isCollapsed}
          aria-controls="section-noise-content"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out",
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
          className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors duration-150 ease-out active:scale-[0.97]"
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
        <div id="section-noise-content" className="px-4 pb-4 space-y-2 pt-1">
          <p className="text-[10px] text-muted-foreground pt-1">
            Add subtle grain/noise overlay
          </p>

          <div className="pt-1 relative">
            <style dangerouslySetInnerHTML={{
              __html: `
                .noise-track-custom {
                  background-color: hsl(var(--background)) !important;
                  background-image: 
                    linear-gradient(to right, transparent, hsl(var(--foreground) / 0.8)),
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
                    repeating-linear-gradient(45deg, hsl(var(--border)) 25%, transparent 25%, transparent 75%, hsl(var(--border)) 75%, hsl(var(--border))), 
                    repeating-linear-gradient(45deg, hsl(var(--border)) 25%, transparent 25%, transparent 75%, hsl(var(--border)) 75%, hsl(var(--border))) !important;
                  background-size: 100% 100%, 100px 100px, 8px 8px, 8px 8px !important;
                  background-position: 0 0, 0 0, 0 0, 4px 4px !important;
                  background-blend-mode: normal, overlay, normal, normal !important;
                  box-shadow: inset 0 0 0 1px hsl(var(--border));
                }
              `
            }} />
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
    </div>
  );
}
