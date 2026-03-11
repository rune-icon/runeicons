import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DualRangeSlider } from "@/components/ui/slider";
import { CustomizationState } from "@/lib/types";

interface TextureSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function TextureSection({
  state,
  onChange,
  isCollapsed,
  onToggle,
}: TextureSectionProps) {
  return (
    <Card className="bg-card border-border py-0">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        aria-expanded={!isCollapsed}
        aria-controls="section-texture-content"
      >
        <h3 className="text-sm font-medium text-foreground">Texture</h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isCollapsed && "rotate-180",
          )}
        />
      </button>
      {!isCollapsed && (
        <div id="section-texture-content" className="px-4 pb-3 space-y-3">
          <p className="text-xs text-muted-foreground">
            Apply texture overlays
          </p>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="texture-type"
                className="text-xs font-medium text-muted-foreground mb-2 block"
              >
                Texture Type
              </label>
              <select
                id="texture-type"
                value={state.texture.selected}
                onChange={(e) =>
                  onChange({
                    texture: { ...state.texture, selected: e.target.value },
                  })
                }
                className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Select texture type"
              >
                <option value="none">None</option>
                <option value="paper">Paper</option>
                <option value="fabric">Fabric</option>
                <option value="concrete">Concrete</option>
                <option value="wood">Wood</option>
                <option value="metal">Metal</option>
              </select>
            </div>

            {state.texture.selected !== "none" && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Opacity
                  </span>
                </div>
                <DualRangeSlider
                  label="%"
                  labelPosition="static"
                  labelContentPos="right"
                  value={[state.texture.opacity]}
                  onValueChange={([val]: number[]) =>
                    val != null &&
                    onChange({
                      texture: { ...state.texture, opacity: val },
                    })
                  }
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
