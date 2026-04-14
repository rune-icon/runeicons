"use client";

import * as m from "motion/react-m";
import { useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { useShape } from "@/lib/shape-context";
import { springs } from "@/lib/springs";
import { THUMB_SIZE } from "./slider-utils";

interface TooltipValueProps {
  value: number;
  formatValue: (v: number) => string;
  motionX: MotionValue<number>;
}

export function TooltipValue({ value, formatValue, motionX }: TooltipValueProps) {
  const shape = useShape();
  const tooltipX = useTransform(motionX, (x) => x + THUMB_SIZE / 2);
  
  return (
    <m.div
      className="absolute -translate-x-1/2 pointer-events-none z-20"
      style={{
        x: tooltipX,
        top: -16,
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4, transition: { duration: 0.1 } }}
      transition={springs.fast}
    >
      <span
        className={cn("text-[12px] text-background tabular-nums whitespace-nowrap bg-foreground px-2 py-1", shape.bg)}
        style={{ fontVariationSettings: "var(--font-weight-medium)" }}
      >
        {formatValue(value)}
      </span>
    </m.div>
  );
}
