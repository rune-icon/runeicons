"use client";

import React, { useState, useEffect } from "react";
import { BlossomColorPicker } from "@/components/icon-page/blossom-picker/blossom-picker";
import { HexColor } from "@/lib/color-utils";

interface ColorRowProps {
  label: string;
  value: HexColor;
  onChange: (color: HexColor) => void;
  disabled?: boolean;
}

export function ColorRow({ label, value, onChange, disabled }: ColorRowProps) {
  const [inputValue, setInputValue] = useState(value.replace("#", ""));

  useEffect(() => {
    setInputValue(value.replace("#", ""));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    // 1. Check for hex (3 or 6 chars)
    if (/^[0-9A-Fa-f]{6}$/.test(val) || /^[0-9A-Fa-f]{3}$/.test(val)) {
      onChange(`#${val}` as HexColor);
      return;
    }

    // 2. Check for rgb(r, g, b)
    const rgbMatch = val.match(/^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
      onChange(`#${r}${g}${b}` as HexColor);
      return;
    }

    // 3. Simple comma separated r,g,b
    const simpleRgbMatch = val.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
    if (simpleRgbMatch) {
      const r = parseInt(simpleRgbMatch[1]).toString(16).padStart(2, '0');
      const g = parseInt(simpleRgbMatch[2]).toString(16).padStart(2, '0');
      const b = parseInt(simpleRgbMatch[3]).toString(16).padStart(2, '0');
      onChange(`#${r}${g}${b}` as HexColor);
    }
  };

  const handleBlur = () => {
    setInputValue(value.replace("#", ""));
  };

  return (
    <div className="flex items-center justify-between group h-9 px-1">
      <span className="text-sm font-medium text-muted-foreground/80 group-hover:text-foreground transition-[color] duration-150 ease-out text-pretty">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <div className="flex items-center border-b border-transparent group-hover:border-border/50 transition-[border-color] focus-within:border-primary">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            disabled={disabled}
            className="w-16 bg-transparent text-[13px] tabular-nums text-muted-foreground/70 font-mono tracking-tight uppercase focus:outline-none focus:text-foreground transition-[color]"
            spellCheck={false}
          />
        </div>
        <BlossomColorPicker
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
