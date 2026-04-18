import { cn } from "@/lib/utils";
import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";
import { TEXTURES } from "@/lib/visual-effects";

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
  return (
    <div className="pt-2 px-4 pb-4">
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider opacity-70">
          Texture Overlay
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          {TEXTURES.map((tex) => (
            <button
              key={tex.id}
              onClick={() => onChange({
                texture: { ...state.texture, selected: tex.id },
              })}
              className={cn(
                "group relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-200 ease-out active:scale-95 overflow-hidden",
                state.texture.selected === tex.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-muted/20 hover:border-border/80 hover:bg-muted/30"
              )}
            >
              <div 
                className="w-full aspect-square rounded-lg border border-border/50 bg-background overflow-hidden relative"
                style={tex.id !== 'none' ? {
                  backgroundImage: `url(${tex.path || `/placeholder.svg?height=100&width=100&query=${tex.id}-texture`}) `,
                  backgroundSize: 'cover'
                } : {}}
              >
                {tex.id === 'none' && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                    <span className="text-[10px] font-bold">X</span>
                  </div>
                )}
                {state.texture.selected === tex.id && (
                  <div className="absolute inset-0 ring-2 ring-primary ring-inset rounded-lg" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight transition-colors",
                state.texture.selected === tex.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {tex.name}
              </span>
            </button>
          ))}
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
    </div>
  );
}
