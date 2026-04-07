"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence, useMotionTemplate } from 'motion/react';
import { cn } from "@/lib/utils";

interface ScrubberProps {
  label: string;
  min?: number;
  max?: number;
  value?: number;
  initialValue?: number;
  onChange?: (value: number) => void;
  trackClassName?: string;
  fillClassName?: string;
}

export const Scrubber: React.FC<ScrubberProps> = ({ 
  label, 
  min = -20, 
  max = 50, 
  value: controlledValue,
  initialValue = 50, 
  onChange,
  trackClassName,
  fillClassName
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue ?? initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(internalValue.toString());
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  const initialPercentage = ((value - min) / (max - min)) * 100;
  const xPercent = useMotionValue(initialPercentage);

  useEffect(() => {
    if (controlledValue !== undefined) {
      const percentage = ((controlledValue - min) / (max - min)) * 100;
      xPercent.set(percentage);
    }
  }, [controlledValue, min, max, xPercent]);

  const springX = useSpring(xPercent, { stiffness: 800, damping: 50, mass: 0.5 });
  const thumbPos = useTransform(springX, (v) => `${v}%`);

  const progressScaleX = useTransform(springX, (v) => Math.max(0, v / 100));
  const progressTransform = useMotionTemplate`scaleX(${progressScaleX})`;

  const maskImage = useTransform(
    springX,
    (v) => `linear-gradient(to right, black 0%, black calc(${v}% - 10px), transparent calc(${v}% + 10px), transparent 100%)`
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditCommit = () => {
    let parsed = parseInt(inputValue, 10);
    if (isNaN(parsed)) parsed = value;
    const clamped = Math.max(min, Math.min(max, parsed));
    
    if (controlledValue === undefined) {
      setInternalValue(clamped);
      xPercent.set(((clamped - min) / (max - min)) * 100);
    }
    onChange?.(clamped);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleEditCommit();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(value.toString());
    }
  };

  const updateValue = (clientX: number, isDragging: boolean = false) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = Math.round(pos * (max - min) + min);
    
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
    if (!containerRef.current || isEditing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateValue(e.clientX, true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    
    if (e.buttons === 1) {
      updateValue(e.clientX, true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
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
      animate={{ transform: isDragging ? "scale(0.98)" : "scale(1)" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="relative h-[44px] w-full cursor-grab active:cursor-grabbing touch-none"
    >
      <motion.div 
        animate={{ backgroundColor: trackClassName ? undefined : (isDragging ? "#D4D4D4" : "#E5E5E5") }}
        transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.2 }}
        className={cn("absolute inset-0 rounded-[10px] overflow-hidden pointer-events-none", trackClassName)}
      >
        <motion.div 
          style={{ transform: progressTransform, transformOrigin: "left" }}
          animate={{ backgroundColor: fillClassName ? undefined : (isDragging ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.1)") }}
          transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.2 }}
          className={cn("absolute left-0 top-0 bottom-0 right-0 z-0", fillClassName)}
        />
      </motion.div>

      <div className="absolute inset-0 flex items-center px-4 z-10 pointer-events-none select-none text-[14px] font-medium text-[#1A1A1A]">
        <div className="flex justify-between w-full">
          <span>{label}</span>
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleEditCommit}
              onKeyDown={handleKeyDown}
              className="w-[48px] text-right bg-transparent outline-none pointer-events-auto tabular-nums font-bold text-[16px]"
            />
          ) : (
            <span 
              className="tabular-nums font-bold text-[16px] pointer-events-auto cursor-text"
              onPointerDown={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setInputValue(value.toString());
              }}
            >
              {value}
            </span>
          )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-[10px] overflow-hidden pointer-events-none z-20">
        <motion.div 
          style={{ maskImage: maskImage, WebkitMaskImage: maskImage }}
          className="absolute inset-0 flex items-center"
        >
          <div className="flex justify-between w-full px-4 text-[14px] font-medium text-white">
            <span>{label}</span>
            {!isEditing && (
              <span className="tabular-nums font-bold text-[16px]">
                {value}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div 
        style={{ left: thumbPos }}
        className="absolute top-1/2 -translate-y-1/2 h-[16px] w-[2px] bg-white mix-blend-difference z-30 -translate-x-1/2 rounded-full pointer-events-none"
      />
    </motion.div>
  );
};
