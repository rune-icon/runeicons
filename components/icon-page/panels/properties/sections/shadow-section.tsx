import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/slider";
import { CustomizationState } from "@/lib/types";

interface ShadowSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function ShadowSection({
  state,
  onChange,
  isCollapsed,
  onToggle,
}: ShadowSectionProps) {
  return (
    <Card className="bg-card border-border py-0">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between rounded-xl hover:bg-muted/50 transition-colors"
        aria-expanded={!isCollapsed}
        aria-controls="section-shadow-content"
      >
        <h3 className="text-sm font-medium text-foreground">Shadow</h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isCollapsed && "rotate-180",
          )}
        />
      </button>
      {!isCollapsed && (
        <div id="section-shadow-content" className="px-4 pb-3 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground pt-2">
              Adjustable shadow settings
            </p>
            <div className="flex p-0.5 rounded-lg border border-border bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onChange({
                    shadow: { ...state.shadow, inner: false },
                  })
                }
                className={cn(
                  "h-6 px-2 text-[10px] font-medium rounded-md transition-all",
                  !state.shadow.inner
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Outer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  onChange({
                    shadow: { ...state.shadow, inner: true },
                  })
                }
                className={cn(
                  "h-6 px-2 text-[10px] font-medium rounded-md transition-all",
                  state.shadow.inner
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Inner
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Opacity
                </span>
              </div>
              <DualRangeSlider
                label="%"
                labelPosition="static"
                labelContentPos="right"
                value={[state.shadow.opacity]}
                onValueChange={([val]) =>
                  val != null &&
                  onChange({
                    shadow: { ...state.shadow, opacity: val },
                  })
                }
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Blur
                </span>
              </div>
              <DualRangeSlider
                label="px"
                labelPosition="static"
                labelContentPos="right"
                value={[state.shadow.blur]}
                onValueChange={([val]: number[]) =>
                  val != null &&
                  onChange({
                    shadow: { ...state.shadow, blur: val },
                  })
                }
                min={0}
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Offset X
                </span>
              </div>
              <DualRangeSlider
                label="px"
                labelPosition="static"
                labelContentPos="right"
                value={[state.shadow.offsetX]}
                onValueChange={([val]: number[]) =>
                  val != null &&
                  onChange({
                    shadow: { ...state.shadow, offsetX: val },
                  })
                }
                min={-50}
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Offset Y
                </span>
              </div>
              <DualRangeSlider
                label="px"
                labelPosition="static"
                labelContentPos="right"
                value={[state.shadow.offsetY]}
                onValueChange={([val]: number[]) =>
                  val != null &&
                  onChange({
                    shadow: { ...state.shadow, offsetY: val },
                  })
                }
                min={-50}
                max={50}
                step={1}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
