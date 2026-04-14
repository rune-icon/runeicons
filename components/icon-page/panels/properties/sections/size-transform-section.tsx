import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";

interface SizeTransformSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
}

export function SizeTransformSection({
  state,
  onChange,
}: SizeTransformSectionProps) {
  return (
    <div className="px-4 pb-4 space-y-5">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider opacity-70 mb-4">Size</h3>
      <div className="flex flex-col gap-5 pt-2">
        <Scrubber
          label="Scale"
          value={state.scale}
          onChange={(val: number) => onChange({ scale: val })}
          min={1}
          max={3}
          step={1}
        />
        <Scrubber
          label="Blur"
          value={state.blur}
          onChange={(val: number) => 
            onChange({ 
              blur: val,
              blurEnabled: true
            })
          }
          min={0}
          max={50}
        />
      </div>
    </div>
  );
}
