import { Card } from "@/components/ui/card";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModernColorPicker } from "@/components/icon-page/modern-color-picker";
import { DualRangeSlider } from "@/components/ui/slider";
import { CustomizationState } from "@/lib/types";

interface ColorSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  inputFormat: "hex" | "rgb";
  setInputFormat: (format: "hex" | "rgb") => void;
  getColorInputValue: (index: number) => string;
  handleColorInputChange: (index: number, value: string) => void;
  handleColorInputBlur: (index: number, value: string) => void;
  addGradientStop: () => void;
  updateGradientStop: (
    index: number,
    updates: Partial<{ color: string; position: number }>,
  ) => void;
  removeGradientStop: (index: number) => void;
}

export function ColorSection({
  state,
  onChange,
  isCollapsed,
  onToggle,
  inputFormat,
  setInputFormat,
  getColorInputValue,
  handleColorInputChange,
  handleColorInputBlur,
  addGradientStop,
  updateGradientStop,
  removeGradientStop,
}: ColorSectionProps) {
  return (
    <Card className="bg-card border-border py-0">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-xl"
        aria-expanded={!isCollapsed}
        aria-controls="section-color-content"
      >
        <h3 className="text-sm font-medium text-foreground">Color Palette</h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isCollapsed && "rotate-180",
          )}
        />
      </button>
      {!isCollapsed && (
        <div id="section-color-content" className="px-4 pb-3 space-y-3">
          {/* Manual Color Input Section */}
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <div
                className="flex gap-1"
                role="group"
                aria-label="Color format selection"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputFormat("hex")}
                  className={cn(
                    "h-6 px-2 text-xs",
                    inputFormat === "hex"
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                  aria-pressed={inputFormat === "hex"}
                >
                  HEX
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputFormat("rgb")}
                  className={cn(
                    "h-6 px-2 text-xs",
                    inputFormat === "rgb"
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                  aria-pressed={inputFormat === "rgb"}
                >
                  RGB
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {state.colors.map((color, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Color {idx + 1}
                    </span>
                    <Input
                      type="text"
                      value={getColorInputValue(idx)}
                      onChange={(e) =>
                        handleColorInputChange(idx, e.target.value)
                      }
                      onBlur={(e) => handleColorInputBlur(idx, e.target.value)}
                      placeholder={
                        inputFormat === "hex" ? "#000000" : "rgb(0, 0, 0)"
                      }
                      className="text-[10px] font-mono h-6 w-24 border-none bg-muted/50 text-foreground placeholder:text-muted-foreground text-right focus-visible:ring-0"
                      aria-label={`Color ${idx + 1} value in ${inputFormat} format`}
                    />
                  </div>
                  <ModernColorPicker
                    color={color}
                    onChange={(newColor) => {
                      const newColors = [...state.colors];
                      newColors[idx] = newColor;
                      onChange({ colors: newColors });
                    }}
                    className="w-full justify-between py-1.5 px-3 scale-95 origin-left"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border mt-3 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Icon Gradient
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange({ iconGradient: !state.iconGradient })}
                className={cn(
                  "h-7 px-3 text-xs border-border",
                  state.iconGradient
                    ? "bg-foreground text-background hover:bg-foreground/90 border-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
                aria-pressed={state.iconGradient}
              >
                {state.iconGradient ? "On" : "Off"}
              </Button>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Gradient Type
              </label>
              <div
                className="grid grid-cols-3 gap-2"
                role="group"
                aria-label="Gradient type selection"
              >
                {(["linear", "radial", "angular"] as const).map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onChange({ gradient: { ...state.gradient, type } })
                    }
                    className={cn(
                      "text-xs border-border capitalize",
                      state.gradient.type === type
                        ? "bg-foreground text-background hover:bg-foreground/90 border-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted",
                    )}
                    aria-pressed={state.gradient.type === type}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {state.gradient.type === "linear" && (
              <div className="space-y-3 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Angle
                  </span>
                </div>
                <DualRangeSlider
                  label="°"
                  labelPosition="static"
                  labelContentPos="right"
                  value={[state.gradient.angle]}
                  onValueChange={([val]) =>
                    val != null &&
                    onChange({
                      gradient: {
                        ...state.gradient,
                        angle: val,
                      },
                    })
                  }
                  min={0}
                  max={360}
                  step={1}
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Color Stops
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addGradientStop}
                  className="h-6 text-xs hover:bg-muted text-muted-foreground hover:text-foreground"
                  aria-label="Add gradient color stop"
                >
                  + Add
                </Button>
              </div>
              <div className="space-y-2">
                {state.gradient.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) =>
                        updateGradientStop(idx, { color: e.target.value })
                      }
                      className="w-8 h-8 rounded border-2 border-border shadow-sm flex-shrink-0 cursor-pointer"
                      aria-label={`Gradient stop ${idx + 1} color`}
                    />
                    <Input
                      type="number"
                      value={stop.position}
                      onChange={(e) =>
                        updateGradientStop(idx, {
                          position: Number(e.target.value),
                        })
                      }
                      min={0}
                      max={100}
                      className="h-8 text-xs border-border bg-background text-foreground placeholder:text-muted-foreground"
                      aria-label={`Gradient stop ${idx + 1} position`}
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                    {state.gradient.stops.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGradientStop(idx)}
                        className="h-8 w-8 flex-shrink-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                        aria-label={`Remove gradient stop ${idx + 1}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
