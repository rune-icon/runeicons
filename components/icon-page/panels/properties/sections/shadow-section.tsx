import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";

interface ShadowSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function ShadowSection({
  state,
  onChange,
}: ShadowSectionProps) {
  return (
    <div className="pt-2 px-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider opacity-70">
          Shadow
        </h3>
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
              "h-7 px-3 text-[10px] font-bold uppercase tracking-tighter rounded-md transition-all duration-200 ease-out active:scale-[0.97]",
              !state.shadow.inner
                ? "bg-background text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
            style={!state.shadow.inner ? { 
              boxShadow: `0 4px 12px rgba(0,0,0,0.1)` 
            } : {}}
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
              "h-7 px-3 text-[10px] font-bold uppercase tracking-tighter rounded-md transition-all duration-200 ease-out active:scale-[0.97]",
              state.shadow.inner
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
            style={state.shadow.inner ? { 
              boxShadow: `inset 0 4px 12px rgba(0,0,0,0.1)` 
            } : {}}
          >
            Inner
          </Button>
        </div>
      </div>
      
      <div id="section-shadow-content" className="space-y-5">
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

        <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}
