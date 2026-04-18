"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";

import { useTuning } from "@/components/icon-page/tuning";
import { cn } from "@/lib/utils";

interface ScrubberProps {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  initialValue?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  trackClassName?: string;
  fillClassName?: string;
  showInput?: boolean;
}

export const Scrubber: React.FC<ScrubberProps> = ({
  label,
  min = -20,
  max = 50,
  step = 1,
  value: controlledValue,
  initialValue = 50,
  onChange,
  disabled = false,
  trackClassName,
  fillClassName,
  showInput = true,
}) => {
  const { values } = useTuning();
  const [internalValue, setInternalValue] = useState(controlledValue ?? initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState((controlledValue ?? initialValue).toString());
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const [isOverlapping, setIsOverlapping] = useState(false);
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // Sync inputValue when value changes from outside (e.g. scrubbing)
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const initialPercentage = ((value - min) / (max - min)) * 100;
  const xPercent = useMotionValue(initialPercentage);

  useEffect(() => {
    if (controlledValue !== undefined) {
      const percentage = ((controlledValue - min) / (max - min)) * 100;
      xPercent.set(percentage);
    }
  }, [controlledValue, min, max, xPercent]);

  const springX = useSpring(xPercent, {
    stiffness: values.scrubberSpringStiffness,
    damping: values.scrubberSpringDamping,
  });
  const thumbPos = useTransform(springX, [0, 100], ["calc(0% + 8px)", "calc(100% - 8px)"]);

  const progressScaleX = useTransform(springX, (v) => Math.max(0, v / 100));
  const progressTransform = useMotionTemplate`scaleX(${progressScaleX})`;

  const maskImage = useTransform(
    springX,
    (v) =>
      `linear-gradient(to right, black 0%, black calc(${v}% - 10px), transparent calc(${v}% + 10px), transparent 100%)`,
  );

  useEffect(() => {
    const checkOverlap = () => {
      if (containerRef.current && labelRef.current && valueRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const labelRect = labelRef.current.getBoundingClientRect();
        const valueRect = valueRef.current.getBoundingClientRect();

        const currentX = springX.get();
        const thumbX = containerRect.left + (currentX / 100) * containerRect.width;
        const notchLeft = thumbX - 8;
        const notchRight = thumbX + 8;

        const overlapsLabel = notchLeft < labelRect.right && notchRight > labelRect.left;
        const overlapsValue = notchLeft < valueRect.right && notchRight > valueRect.left;

        setIsOverlapping(overlapsLabel || overlapsValue);
      }
    };

    const unsubscribe = springX.on("change", checkOverlap);
    window.addEventListener("resize", checkOverlap);
    checkOverlap();

    return () => {
      unsubscribe();
      window.removeEventListener("resize", checkOverlap);
    };
  }, [label, springX]);

  useEffect(() => {
    if (
      (isEditing || showInput) &&
      inputRef.current &&
      document.activeElement === inputRef.current
    ) {
      // already focused or we don't want to auto-focus if it's always showInput
    }
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const snapToStep = useCallback(
    (val: number): number => {
      const stepped = Math.round((val - min) / step) * step + min;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step],
  );

  const handleEditCommit = () => {
    let parsed = parseFloat(inputValue);
    if (isNaN(parsed)) parsed = value;
    const clamped = snapToStep(Math.max(min, Math.min(max, parsed)));

    if (controlledValue === undefined) {
      setInternalValue(clamped);
      xPercent.set(((clamped - min) / (max - min)) * 100);
    }
    onChange?.(clamped);
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditCommit();
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setInputValue(value.toString());
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleSliderKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || isEditing || (showInput && document.activeElement === inputRef.current)) return;

    let delta = 0;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
    else if (e.key === "PageDown") delta = -step * 10;
    else if (e.key === "PageUp") delta = step * 10;
    else if (e.key === "Home") {
      onChange?.(min);
      return;
    } else if (e.key === "End") {
      onChange?.(max);
      return;
    }

    if (delta !== 0) {
      e.preventDefault();
      const newValue = snapToStep(value + delta);
      onChange?.(newValue);
    }
  };

  const updateValue = (clientX: number, isDragging: boolean = false) => {
    if (!containerRef.current || disabled) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = pos * (max - min) + min;
    const newValue = snapToStep(rawValue);

    xPercent.set(pos * 100);
    if (value !== newValue) {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      if (isDragging && typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(5);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current || isEditing || disabled) return;
    // Don't start dragging if we clicked the input in showInput mode
    if (showInput && e.target === inputRef.current) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateValue(e.clientX, true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current || !isDragging) return;

    if (e.buttons === 1) {
      updateValue(e.clientX, true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  return (
    <motion.div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={handleSliderKeyDown}
      animate={{ transform: "scale(1)" }}
      transition={{
        type: "spring",
        stiffness: values.springStiffness,
        damping: values.springDamping,
      }}
      className={cn(
        "group relative h-11 w-full touch-none overflow-hidden rounded-md border border-border/60 bg-muted/30",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-grab active:cursor-grabbing",
        (isEditing || (showInput && typeof document !== "undefined" && document.activeElement === inputRef.current)) &&
          "border-brand/50 ring-2 ring-brand/30",
      )}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <motion.div
        animate={{ backgroundColor: trackClassName ? undefined : "hsl(var(--muted) / 0.4)" }}
        transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.2 }}
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden rounded-md",
          trackClassName,
        )}
      >
        <motion.div
          style={{ transform: progressTransform, transformOrigin: "left" }}
          animate={{
            backgroundColor: fillClassName ? undefined : "var(--brand)",
            opacity: isDragging ? 0.35 : 0.25,
          }}
          transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.2 }}
          className={cn("absolute top-0 right-0 bottom-0 left-0 z-0 rounded-md", fillClassName)}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-4 text-sm font-semibold text-foreground select-none">
        <div className="flex w-full items-center justify-between">
          <span ref={labelRef} className="opacity-90">{label}</span>
          <div
            ref={valueRef}
            className="pointer-events-auto flex items-center gap-1"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              onChange={(e) => {
                const val = e.target.value;
                setInputValue(val);

                const parsed = parseFloat(val);
                if (!isNaN(parsed)) {
                  const clamped = Math.max(min, Math.min(max, parsed));
                  const percentage = ((clamped - min) / (max - min)) * 100;
                  xPercent.set(percentage);

                  if (parsed >= min && parsed <= max) {
                    onChange?.(parsed);
                  }
                }
              }}
              onBlur={(e) => {
                handleEditCommit();
                setIsEditing(false);
              }}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setIsEditing(true)}
              className={cn(
                "w-9 bg-transparent text-right text-base font-bold tabular-nums transition-all outline-none",
                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                "cursor-ew-resize rounded-md border border-transparent px-1 py-0.5",
                "hover:border-border/10 hover:bg-muted/40",
                "focus:cursor-text focus:border-brand/30 focus:bg-background/40 focus:shadow-[0_0_0_2px_rgba(var(--brand-rgb),0.1)]",
              )}
            />
          </div>
        </div>
      </div>

      {!showInput && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <motion.div
            style={{ maskImage: maskImage, WebkitMaskImage: maskImage }}
            className="absolute inset-0 flex items-center"
          >
            <div className="flex w-full justify-between px-4 text-sm font-semibold">
              <span ref={labelRef} className="text-white/95">{label}</span>
              {!isEditing && (
                <span ref={valueRef} className="px-1.5 py-0.5 text-base font-bold tabular-nums">{value}</span>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        className="absolute top-0 h-full w-10 z-20 pointer-events-none"
        style={{ left: thumbPos, x: "-50%" }}
      >
        <div className="flex h-full items-center justify-center absolute inset-0">
          <motion.div
            animate={{
              backgroundColor: isDragging ? "var(--brand)" : "var(--foreground)",
              opacity: isOverlapping ? 0.15 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="h-5 w-1 rounded-full shadow-sm"
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-0 z-30 pointer-events-none flex items-center justify-center"
        initial={false}
        animate={{
          y: isDragging ? -42 : -20,
          opacity: isDragging ? 1 : 0,
          scale: isDragging ? 1 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{ left: thumbPos, x: "-50%" }}
      >
        <div className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl relative backdrop-blur-md">
          {value}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
        </div>
      </motion.div>
    </motion.div>
  );
};
