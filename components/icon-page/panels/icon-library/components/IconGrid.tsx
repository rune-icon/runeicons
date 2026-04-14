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
                  isSelected ? "bg-accent" : "bg-transparent hover:bg-muted",
                )}
                type="button"
                aria-label={`${icon.name} icon`}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-150 ease-out",
                    isSelected
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
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
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
