import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";
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
    <div className="border-t border-border mt-2 pt-2">
      <div className="w-full flex items-center justify-between p-1 pr-3">
        <button
          onClick={onToggle}
          className="flex-1 p-2 flex items-center gap-2 hover:bg-muted/50 transition-colors rounded-xl text-left"
          aria-expanded={!isCollapsed}
          aria-controls="section-shadow-content"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out",
              isCollapsed && "rotate-180",
            )}
          />
          <h3 className="text-sm font-medium text-foreground">Shadow</h3>
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onChange({
              shadow: { ...state.shadow, enabled: !state.shadow.enabled },
            });
          }}
          className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors duration-150 ease-out active:scale-[0.97]"
          title={state.shadow.enabled ? "Disable Shadow" : "Enable Shadow"}
        >
          {state.shadow.enabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>
      {!isCollapsed && state.shadow.enabled && (
        <div id="section-shadow-content" className="px-4 pb-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground pt-1">
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
                  "h-6 px-2 text-[10px] font-medium rounded-md transition-colors duration-150 ease-out active:scale-[0.97]",
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
                  "h-6 px-2 text-[10px] font-medium rounded-md transition-colors duration-150 ease-out active:scale-[0.97]",
                  state.shadow.inner
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Inner
              </Button>
            </div>
          </div>
          <div className="space-y-4 pt-1">
            <Scrubber
              label="Opacity"
              value={state.shadow.opacity}
              onChange={(val: number) =>
                onChange({
                  shadow: { ...state.shadow, opacity: val },
                })
              }
              min={0}
              max={100}
            />

            <Scrubber
              label="Blur"
              value={state.shadow.blur}
              onChange={(val: number) =>
                onChange({
                  shadow: { ...state.shadow, blur: val },
                })
              }
              min={0}
              max={50}
            />

            <Scrubber
              label="Offset X"
              value={state.shadow.offsetX}
              onChange={(val: number) =>
                onChange({
                  shadow: { ...state.shadow, offsetX: val },
                })
              }
              min={-50}
              max={50}
            />

            <Scrubber
              label="Offset Y"
              value={state.shadow.offsetY}
              onChange={(val: number) =>
                onChange({
                  shadow: { ...state.shadow, offsetY: val },
                })
              }
              min={-50}
              max={50}
            />
          </div>
        </div>
      )}
    </div>
  );
}
