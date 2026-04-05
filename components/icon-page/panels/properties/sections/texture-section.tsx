import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";
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
    <Card className="bg-card border-border py-0 gap-0">
      <div className="w-full flex items-center justify-between p-1 pr-3">
        <button
          onClick={onToggle}
          className="flex-1 p-2 flex items-center gap-2 hover:bg-muted/50 transition-colors rounded-xl text-left"
          aria-expanded={!isCollapsed}
          aria-controls="section-texture-content"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
          <h3 className="text-sm font-medium text-foreground">Texture Overlay</h3>
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onChange({
              texture: { ...state.texture, enabled: !state.texture.enabled },
            });
          }}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          title={state.texture.enabled ? "Disable Texture" : "Enable Texture"}
        >
          {state.texture.enabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>
      {!isCollapsed && state.texture.enabled && (
        <div id="section-texture-content" className="px-4 pb-3 space-y-2">
          <p className="text-[10px] text-muted-foreground pt-1">
            Apply subtle texturing
          </p>
          <p className="text-xs text-muted-foreground hidden">
            Apply texture overlays
          </p>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="texture-type"
                className="text-xs font-medium text-muted-foreground mb-1 block"
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
              <div className="pt-1">
                <Scrubber
                  label="Opacity"
                  value={state.texture.opacity}
                  onChange={(val: number) =>
                    onChange({
                      texture: { ...state.texture, opacity: val },
                    })
                  }
                  min={0}
                  max={100}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
