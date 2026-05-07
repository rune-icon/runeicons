import { forwardRef, memo } from "react";

import { AnimatePresence, motion } from "motion/react";

import { CustomizationState, IconData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PreviewContentProps {
  state: CustomizationState;
  selectedIcon: IconData | null;
  boxShadow: string;
  supportsFilter: boolean;
  noiseFilter: string;
  blurFilter: string;
}

export const PreviewContent = memo(
  forwardRef<HTMLDivElement, PreviewContentProps>(
    ({ state, selectedIcon, boxShadow, supportsFilter, noiseFilter, blurFilter }, ref) => {
      const SelectedIconComponent = selectedIcon?.icon;

      return (
        <div
          ref={ref}
          className="relative flex flex-1 items-center justify-center overflow-hidden p-12"
        >
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            animate={{
              width: state.width,
              height: state.height,
              padding: state.padding,
              borderRadius: state.cornerRadius,
              scale: state.scale,
              x: state.translateX,
              y: state.translateY,
              rotateZ: state.rotation,
              scaleX: state.flipH ? -1 : 1,
              scaleY: state.flipV ? -1 : 1,
              boxShadow: state.shadow.enabled && state.shadow.inner ? "none" : boxShadow,
              filter: [blurFilter, noiseFilter].filter(Boolean).join(" "),
            }}
            style={{
              background: "transparent",
              ...(!supportsFilter &&
                state.blur > 0 && {
                  opacity: 0.9,
                }),
            }}
            className="relative flex items-center justify-center p-0"
            role="img"
            aria-label={
              selectedIcon
                ? `${selectedIcon.name} icon with customizations`
                : "Customizable preview element"
            }
          >
            <AnimatePresence>
              {state.texture.enabled && state.texture.selected !== "none" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: state.texture.opacity / 100 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `url(/placeholder.svg?height=200&width=200&query=${state.texture.selected}-texture) repeat`,
                    backgroundSize: "200px 200px",
                    borderRadius: state.cornerRadius,
                  }}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {SelectedIconComponent ? (
                <motion.div
                  key={`${selectedIcon?.id}-${state.iconType}`}
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className={cn(
                    "flex h-full w-full items-center justify-center",
                    state.iconType === "isometric" &&
                      "[transform:rotateX(45deg)_rotateZ(-45deg)] transform",
                    state.iconType === "pixelated" &&
                      "[filter:url(#pixelate)] [image-rendering:pixelated]",
                    state.iconType === "glass" &&
                      "rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md",
                    state.iconType === "dither" && "[filter:url(#dither-filter)]",
                  )}
                >
                  <SelectedIconComponent
                    strokeWidth={2}
                    style={{
                      width: "100%",
                      height: "100%",
                      stroke: state.iconGradient
                        ? "url(#icon-gradient)"
                        : state.colors[0] || "currentColor",
                      fill:
                        state.iconType === "fill"
                          ? state.colors[0] || "currentColor"
                          : state.iconType === "duotone"
                            ? `${state.colors[0] || "currentColor"}33`
                            : "none",
                      filter:
                        [
                          state.shadow.inner ? "url(#inner-shadow)" : null,
                          state.blur > 0 ? "url(#inner-blur)" : null,
                          state.noise.enabled ? "url(#noise-filter)" : null,
                        ]
                          .filter(Boolean)
                          .join(" ") || undefined,
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center text-sm font-medium text-muted-foreground"
                >
                  <p>Select an icon</p>
                  <p className="mt-1 text-xs opacity-70">from the left panel</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      );
    },
  ),
);

PreviewContent.displayName = "PreviewContent";
