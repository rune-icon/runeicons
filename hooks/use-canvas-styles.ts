import { useMemo } from "react";
import { CustomizationState } from "@/lib/types";

export function useCanvasStyles(state: CustomizationState) {
  const transform = useMemo(
    () =>
      `scale(${state.scale}) translateX(${state.translateX}px) translateY(${state.translateY}px) rotate(${state.rotation}deg) ${state.flipH ? "scaleX(-1)" : ""} ${state.flipV ? "scaleY(-1)" : ""}`.trim(),
    [
      state.scale,
      state.translateX,
      state.translateY,
      state.rotation,
      state.flipH,
      state.flipV,
    ],
  );

  const background = useMemo(() => {
    return state.colors[0] || "#ffffff";
  }, [state.colors]);

  const boxShadow = useMemo(
    () =>
      state.shadow.opacity > 0
        ? `${state.shadow.offsetX}px ${state.shadow.offsetY}px ${state.shadow.blur}px rgba(0, 0, 0, ${state.shadow.opacity / 100})`
        : "none",
    [state.shadow],
  );

  const supportsFilter = useMemo(
    () =>
      typeof CSS !== "undefined" &&
      CSS.supports &&
      CSS.supports("filter", "blur(1px)"),
    [],
  );

  const noiseFilter = useMemo(
    () =>
      state.noise.enabled && supportsFilter
        ? `contrast(${100 + state.noise.intensity * 0.5}%) brightness(${100 - state.noise.intensity * 0.2}%)`
        : "",
    [state.noise.enabled, state.noise.intensity, supportsFilter],
  );

  return {
    transform,
    background,
    boxShadow,
    supportsFilter,
    noiseFilter,
  };
}
