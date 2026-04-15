"use client";

import { motion, AnimatePresence } from "motion/react";
import { IconData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTuning } from "@/components/icon-page/tuning";

interface IconGridProps {
  icons: IconData[];
  selectedIconId: string | null;
  onIconClick: (icon: IconData) => void;
}

export function IconGrid({
  icons,
  selectedIconId,
  onIconClick,
}: IconGridProps) {
  const { values, getFastTransition } = useTuning();

  return (
    <motion.div layout className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 border-b border-border">
      <AnimatePresence mode="popLayout">
        {icons.map((icon, index) => {
          const Icon = icon.icon;
          const isSelected = selectedIconId === icon.id;

          return (
            <motion.div
              key={icon.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: getFastTransition(),
                layout: { duration: values.mediumDuration, ease: [values.easeOutX1, values.easeOutY1, values.easeOutX2, values.easeOutY2] },
                delay: Math.min(index * values.iconGridStaggerDelay, values.staggerMaxDelay),
              }}
              className="w-full"
            >
              <button
                onClick={() => onIconClick(icon)}
                className={cn(
                  "group relative aspect-square cursor-pointer overflow-hidden transition-colors duration-150 ease-out w-full border-r border-b border-border flex items-center justify-center",
                  isSelected ? "bg-accent" : "bg-transparent hover:bg-muted focus-visible:bg-muted outline-none",
                )}
                type="button"
                aria-label={`${icon.name} icon`}
                title={icon.name}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-150 ease-out",
                    isSelected
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground",
                  )}
                  style={{
                    transform: `scale(1)`,
                    transition: `transform ${values.fastDuration * 1000}ms ease-out`,
                  }}
                  onMouseEnter={(e) => {
                    (e.target as SVGElement).style.transform = `scale(${values.iconGridHoverScale})`;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as SVGElement).style.transform = `scale(1)`;
                  }}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <div className="absolute bottom-1 left-0 right-0 px-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 pointer-events-none">
                  <span className="text-[8px] text-muted-foreground/60 truncate block font-medium uppercase tracking-[0.05em]">
                    {icon.name}
                  </span>
                </div>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
