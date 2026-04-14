"use client";

import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  type HTMLAttributes,
} from "react";
import * as m from "motion/react-m";
import {
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
  type MotionValue,
} from "motion/react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/springs";
import { useShape } from "@/lib/shape-context";
import { 
  THUMB_SIZE, 
  valueToPixel, 
  pixelToValue, 
  toRadixValue 
} from "./slider-utils";
import { ValueDisplay, type ValuePosition } from "./value-display";

interface VisualThumbProps {
  index: number;
  motionX: MotionValue<number>;
  focusedThumb: number | null;
}

function VisualThumb({ index, motionX, focusedThumb }: VisualThumbProps) {
  return (
    <m.span
      className="flex items-center justify-center pointer-events-none"
      style={{
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        marginTop: -THUMB_SIZE / 2,
        x: motionX,
        position: "absolute",
        top: "50%",
        left: 0,
        zIndex: 10,
      }}
      transition={springs.moderate}
    >
      <m.span
        className="block rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_0_0_0.5px_rgba(0,0,0,0.05)] border border-border/50"
        animate={{
          width: THUMB_SIZE_REST,
          height: THUMB_SIZE_REST,
        }}
        transition={springs.fast}
      />
      <m.span
        className="absolute rounded-full border border-[#6B97FF]"
        animate={{ opacity: focusedThumb === index ? 1 : 0, width: THUMB_SIZE + 4, height: THUMB_SIZE + 4 }}
        transition={springs.fast}
        style={{ fontVariationSettings: "var(--font-weight-medium)" }}
      />
    </m.span>
  );
}
import { TooltipValue } from "./tooltip-value";

const THUMB_SIZE_REST = 18;
const TRACK_HEIGHT = 18;
const DOT_SIZE = 4;

export type SliderValue = number | [number, number];

export interface SliderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value: SliderValue;
  onChange: (value: SliderValue) => void;
  min?: number;
  max?: number;
  step?: number;
  showSteps?: boolean;
  showValue?: boolean;
  valuePosition?: ValuePosition;
  formatValue?: (v: number) => string;
  label?: string;
  disabled?: boolean;
  trackClassName?: string;
  fillClassName?: string;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      showSteps = false,
      showValue = true,
      valuePosition = "bottom",
      formatValue = String,
      label,
      disabled = false,
      trackClassName,
      fillClassName,
      className,
      ...props
    },
    ref
  ) => {
    const isRange = Array.isArray(value);
    const values = toRadixValue(value);
    const shape = useShape();


    const trackRef = useRef<HTMLDivElement>(null);
    const trackWidthRef = useRef(0);
    const hasMounted = useRef(false);
    const dragging = useRef(false);
    const activeDragThumb = useRef<number>(0);


    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [hoverPreview, setHoverPreview] = useState<{
      left: number;
      width: number;
      onFilledSide: boolean;
      snappedValue: number;
      cursorX: number;
    } | null>(null);
    const [focusedThumb, setFocusedThumb] = useState<number | null>(null);


    const motionX0 = useMotionValue(0);
    const motionX1 = useMotionValue(0);


    const fillLeft = useTransform(motionX0, (x) =>
      isRange ? x + THUMB_SIZE / 2 : 0
    );
    const fillWidthSingle = useTransform(motionX0, (x) => x + THUMB_SIZE / 2);
    const fillWidthRange = useTransform(
      [motionX0, motionX1] as MotionValue<number>[],
      ([x0, x1]) => (x1 as number) - (x0 as number)
    );
    const fillWidth = isRange ? fillWidthRange : fillWidthSingle;


    const computeHoverPreview = useCallback(
      (cursorX: number, trackWidth: number) => {
        const usable = trackWidth - THUMB_SIZE;
        const rawPercent = (cursorX - THUMB_SIZE / 2) / usable;
        const rawVal = rawPercent * (max - min) + min;
        const snappedVal = Math.max(
          min,
          Math.min(max, Math.round((rawVal - min) / step) * step + min)
        );
        const snappedX =
          ((snappedVal - min) / (max - min)) * usable;

        const c0 = motionX0.get();
        const c1 = motionX1.get();

        const onFilledSide = isRange
          ? snappedX > c0 && snappedX < c1
          : snappedX < c0;

        const nearestIdx = isRange
          ? (Math.abs(snappedX - c0) <= Math.abs(snappedX - c1) ? 0 : 1)
          : 0;
        const nearest = nearestIdx === 0 ? c0 : c1;

        const left = Math.min(nearest, snappedX);
        const width = Math.abs(snappedX - nearest);
        setHoverPreview({ left, width, onFilledSide, snappedValue: snappedVal, cursorX: snappedX + THUMB_SIZE / 2 });
      },
      [min, max, step, isRange, motionX0, motionX1]
    );


    useEffect(() => {
      hasMounted.current = true;
    }, []);


    useEffect(() => {
      const el = trackRef.current;
      if (!el) return;
      const ro = new ResizeObserver(([entry]) => {
        trackWidthRef.current = entry.contentRect.width;
        if (!dragging.current) {
          const tw = entry.contentRect.width;
          const px0 = valueToPixel(values[0], min, max, tw);
          if (hasMounted.current) {
            animate(motionX0, px0, springs.moderate);
          } else {
            motionX0.set(px0);
          }
          if (isRange && values[1] !== undefined) {
            const px1 = valueToPixel(values[1], min, max, tw);
            if (hasMounted.current) {
              animate(motionX1, px1, springs.moderate);
            } else {
              motionX1.set(px1);
            }
          }
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [min, max, isRange, values, motionX0, motionX1]);


    useEffect(() => {
      if (dragging.current) return;
      const tw = trackWidthRef.current;
      if (tw <= 0) return;
      const px0 = valueToPixel(values[0], min, max, tw);
      if (hasMounted.current) {
        animate(motionX0, px0, springs.moderate);
      } else {
        motionX0.set(px0);
      }
      if (isRange && values[1] !== undefined) {
        const px1 = valueToPixel(values[1], min, max, tw);
        if (hasMounted.current) {
          animate(motionX1, px1, springs.moderate);
        } else {
          motionX1.set(px1);
        }
      }
    }, [values, min, max, isRange, motionX0, motionX1]);


    const clampForRange = useCallback(
      (px: number, thumbIndex: number): number => {
        if (!isRange) return px;
        if (thumbIndex === 0) {
          return Math.min(px, motionX1.get() - THUMB_SIZE * 0.5);
        } else {
          return Math.max(px, motionX0.get() + THUMB_SIZE * 0.5);
        }
      },
      [isRange, motionX0, motionX1]
    );


    const emitChange = useCallback(
      (thumbIndex: number, newValue: number) => {
        if (isRange) {
          const newValues: [number, number] = [...(values as [number, number])];
          newValues[thumbIndex] = newValue;
          onChange(newValues);
        } else {
          onChange(newValue);
        }
      },
      [isRange, values, onChange]
    );


    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        const trackRect = trackRef.current?.getBoundingClientRect();
        if (!trackRect) return;

        const localX = e.clientX - trackRect.left - THUMB_SIZE / 2;
        const clamped = Math.max(0, Math.min(trackRect.width - THUMB_SIZE, localX));

        if (isRange) {
          const dist0 = Math.abs(clamped - motionX0.get());
          const dist1 = Math.abs(clamped - motionX1.get());
          activeDragThumb.current = dist0 <= dist1 ? 0 : 1;
        } else {
          activeDragThumb.current = 0;
        }

        dragging.current = true;
        setIsPressed(true);

        const motionX = activeDragThumb.current === 0 ? motionX0 : motionX1;
        const snappedValue = pixelToValue(clamped, min, max, step, trackRect.width);
        const snappedPx = valueToPixel(snappedValue, min, max, trackRect.width);
        const finalPx = clampForRange(snappedPx, activeDragThumb.current);
        animate(motionX, finalPx, springs.moderate);
        
        const finalValue = pixelToValue(finalPx, min, max, step, trackRect.width);
        emitChange(activeDragThumb.current, finalValue);

        setHoverPreview((prev) => ({
          left: prev?.left ?? 0,
          width: prev?.width ?? 0,
          onFilledSide: prev?.onFilledSide ?? false,
          snappedValue: finalValue,
          cursorX: finalPx + THUMB_SIZE / 2,
        }));

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      },
      [disabled, isRange, min, max, step, motionX0, motionX1, clampForRange, emitChange]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        const trackRect = trackRef.current?.getBoundingClientRect();
        if (!trackRect) return;

        const localX = e.clientX - trackRect.left - THUMB_SIZE / 2;
        const clamped = Math.max(0, Math.min(trackRect.width - THUMB_SIZE, localX));

        const motionX = activeDragThumb.current === 0 ? motionX0 : motionX1;
        const snappedValue = pixelToValue(clamped, min, max, step, trackRect.width);
        const snappedPx = valueToPixel(snappedValue, min, max, trackRect.width);
        const finalPx = clampForRange(snappedPx, activeDragThumb.current);
        motionX.set(finalPx);

        const finalValue = pixelToValue(finalPx, min, max, step, trackRect.width);
        emitChange(activeDragThumb.current, finalValue);

        setHoverPreview((prev) => ({
          left: prev?.left ?? 0,
          width: prev?.width ?? 0,
          onFilledSide: prev?.onFilledSide ?? false,
          snappedValue: finalValue,
          cursorX: finalPx + THUMB_SIZE / 2,
        }));
      },
      [min, max, step, motionX0, motionX1, clampForRange, emitChange]
    );

    const handlePointerUp = useCallback(() => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsPressed(false);
      const tw = trackWidthRef.current;
      const motionX = activeDragThumb.current === 0 ? motionX0 : motionX1;
      const snapped = pixelToValue(motionX.get(), min, max, step, tw);
      animate(motionX, valueToPixel(snapped, min, max, tw), springs.moderate);
    }, [min, max, step, motionX0, motionX1]);

    const handleRadixChange = useCallback(
      (newValues: number[]) => {
        if (dragging.current) return;
        if (isRange) onChange(newValues as [number, number]);
        else onChange(newValues[0]);
      },
      [isRange, onChange]
    );

    const stepDots = showSteps
      ? Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => {
          const v = min + i * step;
          return { value: v, percent: (v - min) / (max - min) };
        })
      : [];

    const isInteracting = isHovered || isPressed;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-1.5 w-full select-none touch-none overflow-visible px-0.5",
          (valuePosition === "left" || valuePosition === "right") ? "flex-row items-center" : "flex-col",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {(valuePosition === "top" || valuePosition === "left") && showValue && (
            <ValueDisplay
                values={values}
                editingIndex={editingIndex}
                onStartEdit={setEditingIndex}
                onCommitEdit={(idx, v) => { emitChange(idx, v); setEditingIndex(null); }}
                onCancelEdit={() => setEditingIndex(null)}
                min={min}
                max={max}
                step={step}
                formatValue={formatValue}
                label={label}
                isRange={isRange}
                isInteracting={isInteracting}
                valuePosition={valuePosition}
            />
        )}
        <div
          className="relative flex-1"
          style={{ height: THUMB_SIZE }}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => { setIsHovered(false); setHoverPreview(null); }}
          onMouseMove={(e) => {
            if (dragging.current) return;
            const trackRect = trackRef.current?.getBoundingClientRect();
            if (!trackRect) return;
            computeHoverPreview(e.clientX - trackRect.left, trackRect.width);
          }}
        >
          {showValue && valuePosition === "tooltip" && (
            <AnimatePresence>
              {isInteracting && <TooltipValue value={values[0]} formatValue={formatValue} motionX={motionX0} />}
              {isInteracting && isRange && values[1] !== undefined && <TooltipValue value={values[1]} formatValue={formatValue} motionX={motionX1} />}
            </AnimatePresence>
          )}

          <SliderPrimitive.Root
            value={values}
            onValueChange={handleRadixChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className="absolute inset-0 opacity-0 pointer-events-none"
            style={{ height: THUMB_SIZE }}
          >
            <SliderPrimitive.Track className="w-full h-full"><SliderPrimitive.Range /></SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="outline-none" style={{ width: THUMB_SIZE, height: THUMB_SIZE }} onFocus={() => setFocusedThumb(0)} onBlur={() => setFocusedThumb(null)} />
            {isRange && <SliderPrimitive.Thumb className="outline-none" style={{ width: THUMB_SIZE, height: THUMB_SIZE }} onFocus={() => setFocusedThumb(1)} onBlur={() => setFocusedThumb(null)} />}
          </SliderPrimitive.Root>

          <div
            ref={trackRef}
            className="relative w-full cursor-pointer h-full"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <div className="absolute inset-0" />
            <AnimatePresence>
              {hoverPreview && valuePosition !== "tooltip" && (
                <m.div
                  className="absolute -translate-x-1/2 pointer-events-none z-20"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0, left: hoverPreview.cursorX }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={springs.fast}
                  style={{ top: -20 }}
                >
                  <span className={cn("text-[12px] text-background bg-foreground px-2 py-1", shape.bg)}>{formatValue(hoverPreview.snappedValue)}</span>
                </m.div>
              )}
            </AnimatePresence>

            <m.div
              className={cn(
                "absolute bg-accent rounded-full overflow-hidden",
                shape.bg,
                trackClassName
              )}
              style={{
                height: TRACK_HEIGHT,
                top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
                left: 0,
                right: 0,
              }}
              transition={springs.fast}
            >
              <m.div
                className={cn("absolute h-full bg-foreground rounded-full", shape.bg, fillClassName)}
                style={{ left: fillLeft, width: fillWidth }}
              />
              
              <m.div
                className={cn("absolute h-full pointer-events-none bg-foreground/20 rounded-full", shape.bg)}
                animate={{
                  left: hoverPreview && !hoverPreview.onFilledSide ? hoverPreview.left : 0,
                  width: hoverPreview && !hoverPreview.onFilledSide ? hoverPreview.width : 0,
                  opacity: hoverPreview && !hoverPreview.onFilledSide && !isPressed ? 1 : 0,
                }}
                transition={springs.moderate}
              />

              <m.div
                className={cn("absolute h-full pointer-events-none z-[2] bg-background/25 rounded-full", shape.bg)}
                animate={{
                  left: hoverPreview?.onFilledSide ? hoverPreview.left : 0,
                  width: hoverPreview?.onFilledSide ? hoverPreview.width : 0,
                  opacity: hoverPreview?.onFilledSide && !isPressed ? 1 : 0,
                }}
                transition={springs.moderate}
              />
            </m.div>

            {stepDots.map(({ value: v, percent }) => (
              <div key={v} className="absolute inset-y-0" style={{ left: `${percent * 100}%`, width: 0 }}>
                <m.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full z-[6]"
                  animate={{ width: isHovered ? DOT_SIZE * 1.25 : DOT_SIZE, height: isHovered ? DOT_SIZE * 1.25 : DOT_SIZE }}
                  style={{ backgroundColor: (isRange ? v >= values[0] && v <= values[1] : v <= values[0]) ? "var(--background)" : "var(--muted-foreground)" }}
                />
              </div>
            ))}

            <VisualThumb key="visual-thumb-0" index={0} motionX={motionX0} focusedThumb={focusedThumb} />
            {isRange && <VisualThumb key="visual-thumb-1" index={1} motionX={motionX1} focusedThumb={focusedThumb} />}
          </div>
        </div>
        {(valuePosition === "bottom" || valuePosition === "right") && showValue && (
            <ValueDisplay
                values={values}
                editingIndex={editingIndex}
                onStartEdit={setEditingIndex}
                onCommitEdit={(idx, v) => { emitChange(idx, v); setEditingIndex(null); }}
                onCancelEdit={() => setEditingIndex(null)}
                min={min}
                max={max}
                step={step}
                formatValue={formatValue}
                label={label}
                isRange={isRange}
                isInteracting={isInteracting}
                valuePosition={valuePosition}
            />
        )}
      </div>
    );
  }
);

Slider.displayName = "FluidSlider";
