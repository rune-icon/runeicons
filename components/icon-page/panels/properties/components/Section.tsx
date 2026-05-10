"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export function Section({ title, children, headerAction, className }: SectionProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <div className="group flex w-full items-center gap-3 py-1 px-1">
          <span className="text-[10px] font-medium tracking-widest whitespace-nowrap text-foreground/70 uppercase transition-colors">
            {title}
          </span>
          {headerAction && <div className="ml-auto flex-shrink-0">{headerAction}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}
