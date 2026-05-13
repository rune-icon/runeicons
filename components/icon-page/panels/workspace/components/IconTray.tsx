"use client";

import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { useTuning } from "@/components/icon-page/tuning";
import { CustomizationState, IconData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IconTrayProps {
  trayIcons: IconData[];
  onSelectIcon: (icon: IconData) => void;
  onRemoveFromTray: (iconId: string) => void;
  state: CustomizationState;
}

export function IconTray({ trayIcons, onSelectIcon, onRemoveFromTray, state }: IconTrayProps) {
  const { values, getSpring } = useTuning();

  return (
    <div
      className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center"
      style={{
        top: "81.25%", 
        width: "100%",
        height: "64px",
      }}
    >
      
      <div 
        className="flex h-full items-center justify-center"
        style={{ gap: "40px" }}
      >
        {Array.from({ length: 8 }).map((_, slotIndex) => {
          const trayIcon = trayIcons[slotIndex];
          return (
            <div 
              key={slotIndex} 
              className="flex h-16 w-16 items-center justify-center p-0 relative"
              style={{
                transform: "translateY(2px)"
              }}
            >
              <div
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center overflow-visible rounded-lg",
                  !trayIcon && "opacity-0",
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {trayIcon ? (
                    <motion.div
                      key={trayIcon.id}
                      layout
                      initial={{
                        opacity: 0,
                        scale: values.iconTrayEntryScale,
                        y: values.iconTrayEntryY,
                      }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        scale: values.iconTrayEntryScale,
                        y: -values.iconTrayEntryY,
                      }}
                      transition={getSpring({
                        stiffness: values.iconTraySpringStiffness,
                        damping: values.iconTraySpringDamping,
                      })}
                      className="group absolute inset-0 flex cursor-pointer items-center justify-center p-2 transition-transform duration-200 active:scale-[0.96] border-none bg-transparent outline-none"
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectIcon(trayIcon)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectIcon(trayIcon);
                        }
                      }}
                    >
                      {trayIcon.icon ? (
                        <trayIcon.icon
                          className="h-full w-full drop-shadow-sm transition-transform duration-200 ease-out hover:scale-110"
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
                      ) : (
                        <div
                          className="h-full w-full drop-shadow-sm transition-transform duration-200 ease-out hover:scale-110"
                          style={{
                            padding: "4px",
                            WebkitMaskImage: `url(${(trayIcon as any).url})`,
                            maskImage: `url(${(trayIcon as any).url})`,
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            maskPosition: "center",
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            background: state.colors[0] || "currentColor",
                            filter: state.shadow.inner ? "url(#inner-shadow)" : "none",
                            transform: `rotate(${state.rotation}deg) ${state.flipH ? "scaleX(-1)" : ""} ${state.flipV ? "scaleY(-1)" : ""}`,
                          }}
                        />
                      )}
                      <button
                        type="button"
                        tabIndex={-1}
                        aria-hidden="true"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromTray(trayIcon.id);
                        }}
                        className="text-destructive-foreground absolute -top-1.5 -right-1.5 z-40 flex h-5 w-5 items-center justify-center rounded-full bg-destructive opacity-0 shadow-lg transition-all duration-200 ease-out group-hover:opacity-100 hover:scale-110 active:scale-[0.96]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground/10">
                      <Plus className="h-4 w-4" />
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
