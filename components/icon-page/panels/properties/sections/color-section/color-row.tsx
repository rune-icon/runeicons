"use client";

import { HexColor } from "@/lib/color-utils";
import { BlossomColorPicker } from "@/components/icon-page/blossom-picker/blossom-picker";

interface ColorRowProps {
  label: string;
  value: HexColor;
  onChange: (color: HexColor) => void;
  disabled?: boolean;
}

export function ColorRow({ label, value, onChange, disabled }: ColorRowProps) {
  return (
    <div className="flex items-center justify-between group h-9 px-1">
      <span className="text-sm font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors duration-200">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-[13px] tabular-nums text-muted-foreground/50 font-mono tracking-tight uppercase">
          {value}
        </span>
        <BlossomColorPicker
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
