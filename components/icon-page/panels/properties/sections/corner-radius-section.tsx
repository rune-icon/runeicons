import { Card } from "@/components/ui/card";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";
import { CustomizationState } from "@/lib/types";

interface CornerRadiusSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function CornerRadiusSection({
  state,
  onChange,
}: CornerRadiusSectionProps) {
  return (
    <div className="px-4 pb-4 space-y-4">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider opacity-70 text-balance pt-2">
        Corner Radius
      </h3>
      <div className="flex flex-col gap-5">
        <Scrubber
          label="Radius"
          value={state.cornerRadius}
          onChange={(val: number) => onChange({ cornerRadius: val })}
          min={0}
          max={50}
        />
      </div>
    </div>
  );
}
