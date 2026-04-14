import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";
import { NOISE_STYLES } from "@/lib/visual-effects";

interface NoiseSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function NoiseSection({
  state,
  onChange,
}: NoiseSectionProps) {
  return (
    <div className="pt-2 px-4 pb-4">
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider opacity-70">
          Noise Grain
        </h3>
        
        <div className="pt-1 relative">
          <style dangerouslySetInnerHTML={{
            __html: NOISE_STYLES
          }} />
          <Scrubber
            label="Intensity"
            value={state.noise.intensity}
            onChange={(val: number) =>
              onChange({
                noise: { ...state.noise, intensity: val },
              })
            }
            min={0}
            max={100}
            trackClassName="noise-track-custom"
            fillClassName="hidden"
          />
        </div>
      </div>
    </div>
  );
}
