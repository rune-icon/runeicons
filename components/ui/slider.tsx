"use client";

import { forwardRef } from "react";
import { Slider as FluidSlider, SliderProps, SliderValue } from "./slider/slider";
import { ValuePosition } from "./slider/value-display";

export const Slider = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { value, onChange, onValueChange, label, trackClassName, fillClassName, ...rest } = props;
  
  const val = Array.isArray(value) ? value[0] : (value ?? 0);

  const handleChange = (v: SliderValue) => {
    const singleVal = Array.isArray(v) ? v[0] : v;
    onChange?.(singleVal);
    onValueChange?.([singleVal]);
  };

  return (
    <FluidSlider
      ref={ref}
      value={val}
      onChange={handleChange}
      label={typeof label === "string" ? label : undefined}
      formatValue={(v) => typeof label === "function" ? String(label(v)) : `${v}${label && typeof label === "string" && !label.includes(" ") ? label : ""}`}
      trackClassName={trackClassName}
      fillClassName={fillClassName}
      {...rest}
    />
  );
});
Slider.displayName = "Slider";

export const DualRangeSlider = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { value, onValueChange, labelPosition, label, trackClassName, fillClassName, ...rest } = props;
  return (
    <FluidSlider
      ref={ref}
      value={Array.isArray(value) ? (value as [number, number]) : (value ?? [0, 0])}
      onChange={(v) => onValueChange?.(Array.isArray(v) ? v : [v])}
      valuePosition={labelPosition || "bottom"}
      label={typeof label === "string" ? label : undefined}
      formatValue={(v) => typeof label === "function" ? String(label(v)) : `${v}${label && typeof label === "string" && !label.includes(" ") ? label : ""}`}
      trackClassName={trackClassName}
      fillClassName={fillClassName}
      {...rest}
    />
  );
});
DualRangeSlider.displayName = "DualRangeSlider";

export { FluidSlider as SliderV2 };
export type { SliderProps, SliderValue, ValuePosition };
