import { cn } from "@/lib/utils";
import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";
import { TEXTURES } from "@/lib/visual-effects";
import { Section } from "../components/Section";

interface TextureSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function TextureSection({
  state,
  onChange,
}: TextureSectionProps) {
  const currentIndex = TEXTURES.findIndex(t => t.id === state.texture.selected);
  const currentTex = TEXTURES[currentIndex];

  return (
    <Section>
      <div className="space-y-4 pt-1">
        <Scrubber
          label={currentTex?.name || "None"}
          min={0}
          max={TEXTURES.length - 1}
          step={1}
          value={currentIndex}
          onChange={(val) => {
            const index = Math.round(val);
            const tex = TEXTURES[index];
            onChange({
              texture: { ...state.texture, selected: tex.id },
            });
          }}
          showInput={false}
        />

        <div className="flex justify-between px-1">
          {TEXTURES.map((tex, index) => {
            const isSelected = state.texture.selected === tex.id;
            
            return (
              <button 
                key={tex.id}
                onClick={() => {
                  onChange({
                    texture: { ...state.texture, selected: tex.id },
                  });
                }}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all group",
                  isSelected ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
              >
                <div 
                  className={cn(
                    "w-5 h-5 rounded-sm border flex items-center justify-center overflow-hidden bg-muted/10 transition-all",
                    isSelected ? "border-foreground/40 ring-1 ring-foreground/10" : "border-border/40"
                  )}
                  style={tex.id !== 'none' ? {
                    backgroundImage: `url(${tex.path || `/placeholder.svg?height=100&width=100&query=${tex.id}-texture`}) `,
                    backgroundSize: 'cover'
                  } : {}}
                >
                  {tex.id === 'none' && (
                    <span className="text-[8px] font-black opacity-40">∅</span>
                  )}
                </div>
                <div className={cn(
                  "w-1.5 h-[1.5px] transition-all",
                  isSelected ? "bg-foreground w-3" : "bg-border w-1.5"
                )} />
              </button>
            );
          })}
        </div>

        {state.texture.selected !== "none" && (
          <div className="pt-2">
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
    </Section>
  );
}
