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
  const [inputFormat, setInputFormat] = useState<"hex" | "rgb">("hex");

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    return `rgb(${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)})`;
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

      let validColor = value;
      if (hexPattern.test(value)) {
        validColor = value;
      } else if (rgbPattern.test(value)) {
        const rgbMatch = value.match(rgbPattern)!;
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
    return inputFormat === "hex" ? color : hexToRgb(color);
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
