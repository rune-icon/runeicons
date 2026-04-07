import { Card } from "@/components/ui/card";
import { ChevronDown, FlipHorizontal, FlipVertical, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";
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
    <Card className="bg-card border-border py-0 gap-0">
      <div className="w-full flex items-center justify-between p-1 pr-3">
        <button
          onClick={onToggle}
          className="flex-1 p-2 flex items-center gap-2 hover:bg-muted/50 transition-colors rounded-xl text-left"
          aria-expanded={!isCollapsed}
          aria-controls="section-flip-rotate-content"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
          <h3 className="text-sm font-medium text-foreground">Flip & Rotate</h3>
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onChange({ flipRotateEnabled: !state.flipRotateEnabled });
          }}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={state.flipRotateEnabled ? "Disable Flip & Rotate" : "Enable Flip & Rotate"}
        >
          {state.flipRotateEnabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>
      {!isCollapsed && state.flipRotateEnabled && (
        <div id="section-flip-rotate-content" className="px-4 pb-3">
          <div className="space-y-2">
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

            <div className="pt-1">
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
      )}
    </Card>
  );
}
