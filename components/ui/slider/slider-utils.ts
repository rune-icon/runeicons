export const THUMB_SIZE = 20;

export function valueToPixel(
  v: number,
  min: number,
  max: number,
  trackWidth: number
): number {
  if (max === min) return 0;
  const usable = trackWidth - THUMB_SIZE;
  return ((v - min) / (max - min)) * usable;
}

export function pixelToValue(
  px: number,
  min: number,
  max: number,
  step: number,
  trackWidth: number
): number {
  const usable = trackWidth - THUMB_SIZE;
  if (usable <= 0) return min;
  const raw = (px / usable) * (max - min) + min;
  const snapped = Math.round((raw - min) / step) * step + min;
  return Math.max(min, Math.min(max, snapped));
}

export function toRadixValue(value: number | [number, number]): number[] {
  return Array.isArray(value) ? value : [value];
}
