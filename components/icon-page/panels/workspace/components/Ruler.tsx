"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface RulerProps {
  side: "top" | "bottom" | "left" | "right";
  length: number;
  className?: string;
  cycle?: number;
}

export function Ruler({ side, length, className, cycle = 1000 }: RulerProps) {
  const isHorizontal = side === "top" || side === "bottom";
  const tickStep = 10;
  const majorTick = 100;
  const mirrorEvery = cycle;
  const fadeSize = 24;

  const labels = useMemo(() => {
    const items = [];
    const maxLength = Math.max(0, length);
    const halfCycle = mirrorEvery / 2;

    // Mirror numbers: 0→max→0 pattern
    for (let i = 0; i <= maxLength; i += tickStep) {
      // Only generate labels every 50px
      if (i % 50 === 0) {
        const displayValue =
          halfCycle - Math.abs((i % mirrorEvery) - halfCycle);
        const isMajor = i % majorTick === 0;

        items.push(
          <span
            key={i}
            className={cn(
              "absolute text-[10px] font-semibold tabular-nums select-none whitespace-nowrap leading-none tracking-tight",
              isMajor ? "text-muted-foreground" : "text-muted-foreground/60",
              isHorizontal ? "-translate-x-1/2" : "-translate-y-1/2",
              isHorizontal
                ? side === "top"
                  ? "top-1.5"
                  : "bottom-1.5"
                : side === "left"
                  ? "right-2.5 -rotate-90 origin-right"
                  : "left-2.5 rotate-90 origin-left",
            )}
            style={{
              [isHorizontal ? "left" : "top"]: `${i}px`,
            }}
          >
            {displayValue}
          </span>,
        );
      }
    }
    return items;
  }, [isHorizontal, length, side, tickStep, majorTick, mirrorEvery]);

  const maskStyle = useMemo(() => {
    const mask = isHorizontal
      ? `linear-gradient(to right, transparent, black ${fadeSize}px, black calc(100% - ${fadeSize}px), transparent)`
      : `linear-gradient(to bottom, transparent, black ${fadeSize}px, black calc(100% - ${fadeSize}px), transparent)`;

    return {
      WebkitMaskImage: mask,
      maskImage: mask,
    } as React.CSSProperties;
  }, [fadeSize, isHorizontal]);

  return (
    <div
      className={cn(
        "relative select-none overflow-hidden",
        isHorizontal ? "h-6 w-full" : "w-6 h-full",
        className,
      )}
      data-side={side}
      data-orientation={isHorizontal ? "horizontal" : "vertical"}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          isHorizontal ? "ruler-h-ticks" : "ruler-v-ticks",
          side === "top" && "ruler-top-ticks",
          side === "bottom" && "ruler-bottom-ticks",
          side === "left" && "ruler-left-ticks",
          side === "right" && "ruler-right-ticks",
        )}
        style={maskStyle}
      />
      <div className="absolute inset-0 pointer-events-none" style={maskStyle}>
        {labels}
      </div>
    </div>
  );
}
