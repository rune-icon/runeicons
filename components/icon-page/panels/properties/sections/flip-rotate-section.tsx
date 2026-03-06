import { Card } from "@/components/ui/card";
import { ChevronDown, FlipHorizontal, FlipVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/slider";
import { CustomizationState } from "@/lib/types";

interface FlipRotateSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function FlipRotateSection({
  state,
  onChange,
  isCollapsed,
  onToggle,
}: FlipRotateSectionProps) {
  return (
    <Card className="bg-card border-border py-0">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-xl"
        aria-expanded={!isCollapsed}
        aria-controls="section-flip-rotate-content"
      >
        <h3 className="text-sm font-medium text-foreground">Flip & Rotate</h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isCollapsed && "rotate-180",
          )}
        />
      </button>
      {!isCollapsed && (
        <div id="section-flip-rotate-content" className="px-4 pb-3">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Flip
              </label>
              <div
                className="flex gap-2"
                role="group"
                aria-label="Flip controls"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange({ flipH: !state.flipH })}
                  className={cn(
                    "flex-1 border-border",
                    state.flipH
                      ? "bg-foreground text-background hover:bg-foreground/90 border-foreground"
                      : "bg-background text-foreground hover:bg-muted",
                  )}
                  aria-pressed={state.flipH}
                  aria-label="Flip horizontal"
                >
                  <FlipHorizontal className="h-4 w-4 mr-2" />
                  Horizontal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChange({ flipV: !state.flipV })}
                  className={cn(
                    "flex-1 border-border",
                    state.flipV
                      ? "bg-foreground text-background hover:bg-foreground/90 border-foreground"
                      : "bg-background text-foreground hover:bg-muted",
                  )}
                  aria-pressed={state.flipV}
                  aria-label="Flip vertical"
                >
                  <FlipVertical className="h-4 w-4 mr-2" />
                  Vertical
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Rotation
                </span>
              </div>
              <DualRangeSlider
                label="°"
                labelPosition="static"
                labelContentPos="right"
                value={[state.rotation]}
                onValueChange={([val]) =>
                  val != null && onChange({ rotation: val })
                }
                min={0}
                max={360}
                step={1}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
