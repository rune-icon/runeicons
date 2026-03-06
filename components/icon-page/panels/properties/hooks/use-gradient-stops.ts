import { useCallback } from "react";
import { CustomizationState } from "@/lib/types";

export function useGradientStops(
  state: CustomizationState,
  onChange: (updates: Partial<CustomizationState>) => void
) {
  const addGradientStop = useCallback(() => {
    const newStops = [
      ...state.gradient.stops,
      { color: "#000000", position: 50 },
    ];
    onChange({
      gradient: { ...state.gradient, stops: newStops },
    });
  }, [state.gradient, onChange]);

  const updateGradientStop = useCallback(
    (index: number, updates: Partial<{ color: string; position: number }>) => {
      const newStops = [...state.gradient.stops];
      newStops[index] = { ...newStops[index], ...updates };
      onChange({
        gradient: { ...state.gradient, stops: newStops },
      });
    },
    [state.gradient, onChange],
  );

  const removeGradientStop = useCallback(
    (index: number) => {
      if (state.gradient.stops.length <= 2) return;
      const newStops = state.gradient.stops.filter((_, i) => i !== index);
      onChange({
        gradient: { ...state.gradient, stops: newStops },
      });
    },
    [state.gradient, onChange],
  );

  return {
    addGradientStop,
    updateGradientStop,
    removeGradientStop,
  };
}
