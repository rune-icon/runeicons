import { useState, useCallback } from "react";
import { CustomizationState } from "@/lib/types";

export function useColorInput(
  state: CustomizationState,
  onChange: (updates: Partial<CustomizationState>) => void
) {
  const [editingColor, setEditingColor] = useState<{
    index: number;
    value: string;
  } | null>(null);
  const [inputFormat, setInputFormat] = useState<"hex" | "rgb" | "hsl">("hex");

  const hexToRgb = (hex: string): string => {
    const rawHex = hex.startsWith("#") ? hex.slice(1) : hex;
    const normalizedHex =
      rawHex.length === 3
        ? rawHex
            .split("")
            .map((ch) => ch + ch)
            .join("")
        : rawHex;
    if (!/^[a-f\d]{6}$/i.test(normalizedHex)) return hex;
    const r = Number.parseInt(normalizedHex.slice(0, 2), 16);
    const g = Number.parseInt(normalizedHex.slice(2, 4), 16);
    const b = Number.parseInt(normalizedHex.slice(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = Number.parseInt(result[1], 16) / 255;
    const g = Number.parseInt(result[2], 16) / 255;
    const b = Number.parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;
    const l = (max + min) / 2;
    let s = 0;
    if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r:
          h = ((g - b) / delta) % 6;
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        default:
          h = (r - g) / delta + 4;
          break;
      }
      h *= 60;
      if (h < 0) h += 360;
    }
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(
      /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
    );
    if (!match) return rgb;
    const r = Math.min(255, Number.parseInt(match[1])).toString(16).padStart(2, "0");
    const g = Math.min(255, Number.parseInt(match[2])).toString(16).padStart(2, "0");
    const b = Math.min(255, Number.parseInt(match[3])).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  };

  const handleColorInputChange = useCallback((index: number, value: string) => {
    setEditingColor({ index, value });
  }, []);

  const handleColorInputBlur = useCallback(
    (index: number, value: string) => {
      const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbPattern =
        /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

      let validColor: string;
      if (hexPattern.test(value)) {
        validColor = value;
      } else if (rgbPattern.test(value)) {
        const rgbMatch = value.match(rgbPattern);
        if (!rgbMatch) {
          setEditingColor(null);
          return;
        }
        const vals = [rgbMatch[1], rgbMatch[2], rgbMatch[3]].map(Number);
        if (vals.some((v) => v > 255)) {
          setEditingColor(null);
          return;
        }
        validColor = rgbToHex(value);
      } else {
        setEditingColor(null);
        return;
      }

      const newColors = [...state.colors];
      newColors[index] = validColor;
      onChange({ colors: newColors });
      setEditingColor(null);
    },
    [state.colors, onChange],
  );

  const getColorInputValue = (index: number) => {
    if (editingColor?.index === index) {
      return editingColor.value;
    }
    const color = state.colors[index];
    if (inputFormat === "hex") return color;
    if (inputFormat === "rgb") return hexToRgb(color);
    return hexToHsl(color);
  };

  return {
    editingColor,
    inputFormat,
    setInputFormat,
    handleColorInputChange,
    handleColorInputBlur,
    getColorInputValue,
  };
}
