"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const WorkspaceGround: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-background dark:bg-[#121214] overflow-hidden select-none pointer-events-none flex items-center justify-center",
        className
      )}
    >
      <div className="w-full h-full flex items-center justify-center">
        <svg
          width="1100"
          height="800"
          viewBox="0 0 1100 800"
          className="max-w-full max-h-full w-auto h-auto opacity-100 dark:opacity-60"
          preserveAspectRatio="xMidYMid meet"
          style={{
            "--mat-bg": "transparent",
            "--guide-color": "color-mix(in srgb, var(--foreground) 20%, transparent)",
            "--grid-color-light": "color-mix(in srgb, var(--foreground) 8%, transparent)",
            "--grid-color-medium": "color-mix(in srgb, var(--foreground) 12%, transparent)",
            backgroundColor: "transparent",
          } as React.CSSProperties}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="0" width="1100" height="800" fill="var(--mat-bg)" stroke="none" />
          <defs>
            <clipPath id="gridClip">
              <rect x="50" y="50" width="1000" height="700" />
            </clipPath>
          </defs>

          <line x1="50" y1="50" x2="50" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="150" y1="50" x2="150" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="250" y1="50" x2="250" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="350" y1="50" x2="350" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="450" y1="50" x2="450" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="550" y1="50" x2="550" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="650" y1="50" x2="650" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="750" y1="50" x2="750" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="850" y1="50" x2="850" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="950" y1="50" x2="950" y2="750" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="1050" y1="50" x2="1050" y2="750" stroke="var(--guide-color)" strokeWidth="1" />

          <line x1="50" y1="50" x2="1050" y2="50" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="50" y1="150" x2="1050" y2="150" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="50" y1="250" x2="1050" y2="250" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="50" y1="350" x2="1050" y2="350" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="50" y1="450" x2="1050" y2="450" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="50" y1="550" x2="1050" y2="550" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="50" y1="650" x2="1050" y2="650" stroke="var(--guide-color)" strokeWidth="1" />
          <line x1="50" y1="750" x2="1050" y2="750" stroke="var(--guide-color)" strokeWidth="1" />

          {Array.from({ length: 51 }).map((_, i) => {
            const x = 50 + i * 20;
            if (i % 5 === 0) return null;
            return (
              <line
                key={`v-${i}`}
                x1={x}
                y1="50"
                x2={x}
                y2="750"
                stroke="var(--grid-color-light)"
                strokeWidth="0.5"
              />
            );
          })}
          {Array.from({ length: 36 }).map((_, i) => {
            const y = 50 + i * 20;
            if (i % 5 === 0) return null;
            return (
              <line
                key={`h-${i}`}
                x1="50"
                y1={y}
                x2="1050"
                y2={y}
                stroke="var(--grid-color-light)"
                strokeWidth="0.5"
              />
            );
          })}

          <g className="font-mono text-[10px]" fill="var(--guide-color)">
             {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((val, i) => {
                const x = 50 + i * 100;
                return (
                  <g key={`x-lab-${val}`}>
                    <line x1={x} y1="30" x2={x} y2="50" stroke="var(--guide-color)" strokeWidth="0.5" />
                    <text x={x} y="25" textAnchor="middle">{val}</text>
                    <line x1={x} y1="750" x2={x} y2="770" stroke="var(--guide-color)" strokeWidth="0.5" />
                    <text x={x} y="783" textAnchor="middle">{val}</text>
                  </g>
                );
             })}
             
             {[35, 30, 25, 20, 15, 10, 5, 0].map((val, i) => {
                const y = 50 + i * 100;
                return (
                  <g key={`y-lab-${val}`}>
                    <line x1="30" y1={y} x2="50" y2={y} stroke="var(--guide-color)" strokeWidth="0.5" />
                    <text x={23} y={y + 3} textAnchor="middle">{val}</text>
                    <line x1="1050" y1={y} x2="1070" y2={y} stroke="var(--guide-color)" strokeWidth="0.5" />
                    <text x={1077} y={y + 3} textAnchor="middle">{val}</text>
                  </g>
                );
             })}

             {Array.from({ length: 51 }).map((_, i) => {
                if (i % 5 === 0) return null;
                const x = 50 + i * 20;
                return (
                  <g key={`x-tick-${i}`}>
                    <line x1={x} y1="30" x2={x} y2="40" stroke="var(--guide-color)" strokeWidth="0.5" />
                    <line x1={x} y1="760" x2={x} y2="770" stroke="var(--guide-color)" strokeWidth="0.5" />
                  </g>
                );
             })}
             {Array.from({ length: 36 }).map((_, i) => {
                if (i % 5 === 0) return null;
                const y = 50 + i * 20;
                return (
                  <g key={`y-tick-${i}`}>
                    <line x1="30" y1={y} x2="40" y2={y} stroke="var(--guide-color)" strokeWidth="0.5" />
                    <line x1="1060" y1={y} x2="1070" y2={y} stroke="var(--guide-color)" strokeWidth="0.5" />
                  </g>
                );
             })}
          </g>
        </svg>
      </div>
    </div>
  );
};
