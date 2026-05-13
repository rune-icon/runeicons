import { cn } from "@/lib/utils";
import { CustomizationState } from "@/lib/types";
import { STROKE_STYLE_MAP, StrokeStyle } from "@/lib/stroke-style";

interface StrokeStyleSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
}

const STROKE_VARIANTS: { id: StrokeStyle; name: string }[] = [
  { id: "round", name: "Round" },
  { id: "sharp", name: "Sharp" },
  { id: "square", name: "Square" },
  { id: "soft", name: "Soft" },
  { id: "medium", name: "Medium" },
  { id: "heavy", name: "Heavy" },
];

import { Section } from "../components/Section";
import { Scrubber } from "@/components/ui/scrubber";

const STROKE_SEQUENCE: StrokeStyle[] = ["soft", "round", "medium", "heavy", "sharp", "square"];

export function StrokeStyleSection({
  state,
  onChange,
}: StrokeStyleSectionProps) {
  const currentIndex = STROKE_SEQUENCE.indexOf(state.strokeStyle);
  const currentVariant = STROKE_VARIANTS.find(v => v.id === state.strokeStyle);

  return (
    <Section title="Stroke Style">
      <div className="space-y-4 pt-1">
        <Scrubber
          label={currentVariant?.name || "Style"}
          min={0}
          max={5}
          step={1}
          value={currentIndex}
          onChange={(val) => {
            const index = Math.round(val);
            onChange({ strokeStyle: STROKE_SEQUENCE[index] });
          }}
          showInput={false}
        />
        
        <div className="flex justify-between px-1">
          {STROKE_SEQUENCE.map((id, index) => {
            const config = STROKE_STYLE_MAP[id];
            const isSelected = state.strokeStyle === id;
            
            return (
              <button 
                key={id}
                onClick={() => onChange({ strokeStyle: id })}
                className={cn(
                  "flex flex-col items-center gap-2.5 transition-all group",
                  isSelected ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200",
                  isSelected 
                    ? "bg-muted/20 border-foreground/30 shadow-[0_2px_8px_rgba(0,0,0,0.1)] ring-1 ring-foreground/5" 
                    : "bg-muted/5 border-border/40 hover:bg-muted/10"
                )}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={config.strokeWidth * 1.5}
                    strokeLinecap={config.strokeLinecap}
                    strokeLinejoin={config.strokeLinejoin}
                    className="transition-colors"
                  >
                    <path d="M7 17V7h10" />
                  </svg>
                </div>
                <div className={cn(
                  "h-[2px] rounded-full transition-all duration-300",
                  isSelected ? "bg-foreground w-8" : "bg-border/20 w-2"
                )} />
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
