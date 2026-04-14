"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'motion/react';
import { cn } from "@/lib/utils";
import { useTuning } from "@/components/icon-page/tuning";

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
  showInput = true
}) => {
  const { values } = useTuning();
  const [internalValue, setInternalValue] = useState(controlledValue ?? initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState((controlledValue ?? initialValue).toString());
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const valueContainerRef = useRef<HTMLDivElement>(null);
  
  const [metrics, setMetrics] = useState({ trackWidth: 0, labelWidth: 0, valueWidth: 0 });
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    const measure = () => {
      if (containerRef.current && labelRef.current && valueContainerRef.current) {
        setMetrics({
          trackWidth: containerRef.current.offsetWidth,
          labelWidth: labelRef.current.offsetWidth,
          valueWidth: valueContainerRef.current.offsetWidth
        });
      }
    };
    
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [label, value]);

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
    damping: values.scrubberSpringDamping 
  });
  const thumbPos = useTransform(springX, (v) => `${v}%`);

  const progressScaleX = useTransform(springX, (v) => Math.max(0, v / 100));
  const progressTransform = useMotionTemplate`scaleX(${progressScaleX})`;

  const maskImage = useTransform(
    springX,
    (v) => `linear-gradient(to right, black 0%, black calc(${v}% - 10px), transparent calc(${v}% + 10px), transparent 100%)`
  );

  const thumbBlur = useTransform(springX, (v) => {
    if (metrics.trackWidth === 0) return 0;
    
    // Calculate boundaries in percentage (adding 5px for a tight padding around text)
    const leftLimit = ((metrics.labelWidth + 5) / metrics.trackWidth) * 100;
    const rightLimit = 100 - ((metrics.valueWidth + 5) / metrics.trackWidth) * 100;
    
    if (v <= leftLimit) {
      // Smooth fade-out of blur as we leave the label area
      const t = v / leftLimit;
      return (1 - t) * 4;
    }
    
    if (v >= rightLimit) {
      // Smooth fade-in of blur as we enter the value area
      const t = (v - rightLimit) / (100 - rightLimit);
      return t * 4;
    }
    
    return 0;
  });
  
  const thumbFilter = useMotionTemplate`blur(${thumbBlur}px)`;

  useEffect(() => {
    if ((isEditing || showInput) && inputRef.current && document.activeElement === inputRef.current) {
      // already focused or we don't want to auto-focus if it's always showInput
    }
    if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
    }
  }, [isEditing]);

  const snapToStep = useCallback((val: number): number => {
    const stepped = Math.round((val - min) / step) * step + min;
    return Math.max(min, Math.min(max, stepped));
  }, [min, max, step]);

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
    if (e.key === 'Enter') {
        handleEditCommit();
        (e.target as HTMLInputElement).blur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value.toString());
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleSliderKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || isEditing || (showInput && document.activeElement === inputRef.current)) return;
    
    let delta = 0;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
    else if (e.key === 'PageDown') delta = -step * 10;
    else if (e.key === 'PageUp') delta = step * 10;
    else if (e.key === 'Home') {
      onChange?.(min);
      return;
    } else if (e.key === 'End') {
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
      if (isDragging && typeof navigator !== 'undefined' && navigator.vibrate) {
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
      animate={{ transform: isDragging ? "scale(0.985)" : "scale(1)" }}
      transition={{ type: "spring", stiffness: values.springStiffness, damping: values.springDamping }}
      className={cn(
        "relative h-11 w-full touch-none rounded-[12px] border border-border/60 overflow-hidden bg-muted/30 group",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-grab active:cursor-grabbing",
        (isEditing || (showInput && document.activeElement === inputRef.current)) && "ring-2 ring-brand/30 border-brand/50"
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
        className={cn("absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]", trackClassName)}
      >
        <motion.div 
          style={{ transform: progressTransform, transformOrigin: "left" }}
          animate={{ 
            backgroundColor: fillClassName ? undefined : "var(--brand)",
            opacity: isDragging ? 0.9 : 0.8
          }}
          transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.2 }}
          className={cn("absolute left-0 top-0 bottom-0 right-0 z-0 rounded-[12px]", fillClassName)}
        />
      </motion.div>

      <div className="absolute inset-0 flex items-center px-4 z-10 pointer-events-none select-none text-sm font-semibold text-foreground">
        <div className="flex justify-between items-center w-full">
          <span ref={labelRef} className="opacity-90">{label}</span>
          <div 
            ref={valueContainerRef}
            className="flex items-center gap-1 pointer-events-auto"
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
                  "w-9 text-right bg-transparent outline-none tabular-nums font-bold text-base transition-all",
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                  "cursor-ew-resize px-1 py-0.5 rounded-md border border-transparent",
                  "hover:bg-muted/40 hover:border-border/10",
                  "focus:bg-background/40 focus:border-brand/30 focus:shadow-[0_0_0_2px_rgba(var(--brand-rgb),0.1)] focus:cursor-text"
              )}
            />
          </div>
        </div>
      </div>

      {!showInput && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <motion.div 
            style={{ maskImage: maskImage, WebkitMaskImage: maskImage }}
            className="absolute inset-0 flex items-center"
            >
            <div className="flex justify-between w-full px-4 text-sm font-semibold">
                <span className="text-white/95">{label}</span>
                {!isEditing && (
                <span className="tabular-nums font-bold text-base px-1.5 py-0.5">
                    {value}
                </span>
                )}
            </div>
            </motion.div>
        </div>
      )}

      <motion.div 
        style={{ left: thumbPos, filter: thumbFilter }}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 h-8 w-[6px] z-30 -translate-x-1/2 rounded-full pointer-events-none transition-colors",
          "bg-slate-900/80 dark:bg-white/80",
          "border border-black/5 dark:border-white/10",
          "shadow-[0_0_12px_rgba(0,0,0,0.15)] dark:shadow-[0_0_12px_rgba(255,255,255,0.25)]"
        )}
      />
    </motion.div>
  );
};
