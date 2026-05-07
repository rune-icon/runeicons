"use client";

import { AnimatePresence, motion } from "motion/react";

import { useTuning } from "@/components/icon-page/tuning";
import { IconData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IconGridProps {
  icons: IconData[];
  selectedIconId: string | null;
  onIconClick: (icon: IconData) => void;
  isSearching?: boolean;
}

export function IconGrid({ icons, selectedIconId, onIconClick, isSearching }: IconGridProps) {
  const { values, getFastTransition } = useTuning();

  return (
    <motion.div
      layout
      className="grid grid-cols-3 border-b border-border sm:grid-cols-4 lg:grid-cols-5"
    >
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
                layout: {
                  duration: values.mediumDuration,
                  ease: [values.easeOutX1, values.easeOutY1, values.easeOutX2, values.easeOutY2],
                },
                delay: Math.min(index * values.iconGridStaggerDelay, values.staggerMaxDelay),
              }}
              className="w-full"
            >
              <motion.button
                onClick={() => onIconClick(icon)}
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "group relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden border-r border-b border-border transition-colors duration-200 ease-out outline-none",
                  isSelected
                    ? "bg-accent"
                    : "bg-transparent hover:bg-muted focus-visible:bg-muted",
                )}
                type="button"
                aria-label={`${icon.name} icon`}
                title={icon.name}
              >
                <AnimatePresence>
                  {isSearching && !isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
                      transition={{
                        type: "spring",
                        duration: 0.3,
                        bounce: 0,
                      }}
                      className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-brand/20 via-brand/5 to-transparent"
                    />
                  )}
                </AnimatePresence>

                <motion.div 
                  className="relative z-10 flex items-center justify-center p-3"
                  variants={{
                    initial: { y: 0, scale: 1 },
                    hover: { y: -12, scale: 0.92 },
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      isSelected
                        ? "text-primary"
                        : isSearching 
                          ? "text-foreground" 
                          : "text-muted-foreground group-hover:text-foreground",
                    )}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </motion.div>

                <motion.div
                  className="pointer-events-none absolute bottom-1 left-0 right-0 px-1.5 flex justify-center text-center z-10"
                  variants={{
                    initial: { opacity: 0, y: 4, filter: "blur(4px)" },
                    hover: { opacity: 1, y: 0, filter: "blur(0px)" },
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <span 
                    className="text-[8.5px] font-bold tracking-[0.04em] text-muted-foreground/80 uppercase leading-[1.1] whitespace-normal"
                    style={{ textWrap: 'balance' } as any}
                  >
                    {icon.name}
                  </span>
                </motion.div>
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
