"use client";

import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconData, CustomizationState } from "@/lib/types";
import { useTuning } from "@/components/icon-page/tuning";

interface IconTrayProps {
  trayIcons: IconData[];
  onSelectIcon: (icon: IconData) => void;
  onRemoveFromTray: (iconName: string) => void;
  state: CustomizationState;
}

export function IconTray({
  trayIcons,
  onSelectIcon,
  onRemoveFromTray,
  state,
}: IconTrayProps) {
  const { values, getSpring } = useTuning();

  return (
    <div 
      className="absolute top-[81.25%] left-[4.54%] right-[4.54%] -translate-y-1/2"
      style={{ height: '10%' }}
    >
      <div className="grid grid-cols-10 h-full w-full">
        <div className="col-start-1" />
        
        {Array.from({ length: 8 }).map((_, slotIndex) => {
          const trayIcon = trayIcons[slotIndex];
          return (
            <div 
              key={slotIndex} 
              className="flex items-center justify-center p-1"
            >
              <div 
                className={cn(
                  "w-12 h-12 rounded-lg border border-border/10 relative flex items-center justify-center overflow-visible shadow-sm",
                  !trayIcon && "border-dashed opacity-20"
                )}
                style={{
                  borderRadius: `${state.cornerRadius / 4}px`,
                }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {trayIcon ? (
                    <motion.div
                      key={trayIcon.id}
                      layout
                      initial={{ opacity: 0, scale: values.iconTrayEntryScale, y: values.iconTrayEntryY }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: values.iconTrayEntryScale, y: -values.iconTrayEntryY }}
                      transition={getSpring({
                        stiffness: values.iconTraySpringStiffness,
                        damping: values.iconTraySpringDamping,
                      })}
                      className="absolute inset-0 flex items-center justify-center p-2 cursor-pointer group"
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectIcon(trayIcon)}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectIcon(trayIcon);
                        }
                      }}
                    >
                      <trayIcon.icon
                        className="w-full h-full transition-transform duration-200 ease-out drop-shadow-sm hover:scale-110 active:scale-[0.97]"
                        strokeWidth={2}
                        style={{
                          padding: "4px",
                          stroke: state.iconGradient
                            ? `url(#icon-gradient)`
                            : state.colors[0] || "currentColor",
                          filter: state.shadow.inner ? "url(#inner-shadow)" : "none",
                          transform: `rotate(${state.rotation}deg) ${state.flipH ? "scaleX(-1)" : ""} ${state.flipV ? "scaleY(-1)" : ""}`,
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromTray(trayIcon.name);
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out flex items-center justify-center shadow-lg hover:scale-110 active:scale-[0.97] z-40"
                        aria-label={`Remove ${trayIcon.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/10">
                      <Plus className="w-4 h-4" />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
