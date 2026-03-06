"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion, AnimatePresence } from "framer-motion";
import { BlossomColorPicker } from "./blossom-color-picker";
import { cn } from "@/lib/utils";

interface ModernColorPickerProps {
  color?: string;
  onChange?: (color: string) => void;
  className?: string;
}

/**
 * Parses HSL string to object
 */
const parseHsl = (hsl: string) => {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (match)
    return {
      h: parseInt(match[1]),
      s: parseInt(match[2]),
      l: parseInt(match[3]),
    };
  return { h: 36, s: 70, l: 50 };
};

/**
 * ModernColorPicker Component
 * A premium Apple-style color picker with a gradient slider and a rainbow hue trigger.
 */
export function ModernColorPicker({
  color = "hsl(36, 70%, 50%)",
  onChange,
  className,
}: ModernColorPickerProps) {
  const [hsl, setHsl] = React.useState(parseHsl(color));

  // Sync internal state with prop
  React.useEffect(() => {
    setHsl(parseHsl(color));
  }, [color]);

  const currentColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  const handleLightnessChange = (values: number[]) => {
    const newHsl = { ...hsl, l: values[0] };
    setHsl(newHsl);
    onChange?.(`hsl(${newHsl.h}, ${newHsl.s}%, ${newHsl.l}%)`);
  };

  const handleHueChange = (newColor: string) => {
    const newHsl = parseHsl(newColor);
    setHsl(newHsl);
    onChange?.(newColor);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 bg-[#1C1C1E] p-2 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10",
        className,
      )}
    >
      {/* Horizontal Gradient Slider */}
      <div className="relative flex items-center px-1">
        <SliderPrimitive.Root
          className="relative flex items-center select-none touch-none w-52 h-10 group cursor-pointer"
          value={[hsl.l]}
          onValueChange={handleLightnessChange}
          max={100}
          step={1}
        >
          <SliderPrimitive.Track className="relative h-full grow rounded-lg overflow-hidden bg-white/5">
            {/* Gradient Background: From Hue-White to Full Hue */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background: `linear-gradient(to right, white, hsl(${hsl.h}, 100%, 50%))`,
              }}
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className="block w-9 h-9 rounded-lg border-[3px] border-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-white/30 transition-shadow"
            style={{ backgroundColor: currentColor }}
          />
        </SliderPrimitive.Root>
      </div>

      {/* Rainbow Hue Trigger */}
      <div className="relative mr-1">
        <BlossomColorPicker
          color={currentColor}
          onColorSelect={handleHueChange}
          triggerClassName={cn(
            "w-9 h-9 !opacity-100 !ring-0 border-[2px] border-white/20 shadow-lg cursor-pointer transition-all hover:scale-110 active:scale-95 rounded-md",
            "bg-[conic-gradient(from_0deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)]",
          )}
        />
        {/* Subtle Glow behind the rainbow button */}
        <div className="absolute inset-0 rounded-md blur-[4px] opacity-30 bg-[conic-gradient(from_0deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] -z-10" />
      </div>
    </div>
  );
}
