import { forwardRef } from "react";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { IconData, CustomizationState } from "@/lib/types";

interface PreviewContentProps {
  state: CustomizationState;
  selectedIcon: IconData | null;
  boxShadow: string;
  supportsFilter: boolean;
  noiseFilter: string;
  blurFilter: string;
}

export const PreviewContent = forwardRef<HTMLDivElement, PreviewContentProps>(
  (
    {
      state,
      selectedIcon,
      boxShadow,
      supportsFilter,
      noiseFilter,
      blurFilter,
    },
    ref,
  ) => {
    const SelectedIconComponent = selectedIcon?.icon;

    return (
      <div
        ref={ref}
        className="flex-1 flex items-center justify-center relative p-12 overflow-hidden"
      >
        <m.div
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
            boxShadow:
              state.shadow.enabled && state.shadow.inner ? "none" : boxShadow,
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
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: state.texture.opacity / 100 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 pointer-events-none"
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
              <m.div
                key={`${selectedIcon?.id}-${state.iconType}`}
                initial={{ scale: 0.95, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.95, opacity: 0, rotate: 180 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                className={cn(
                  "w-full h-full flex items-center justify-center",
                  state.iconType === "isometric" &&
                    "transform [transform:rotateX(45deg)_rotateZ(-45deg)]",
                  state.iconType === "pixelated" &&
                    "[image-rendering:pixelated] [filter:url(#pixelate)]",
                  state.iconType === "glass" &&
                    "backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4",
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
                    filter: state.shadow.inner
                      ? "url(#inner-shadow)"
                      : undefined,
                  }}
                  aria-hidden="true"
                />
              </m.div>
            ) : (
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-muted-foreground font-medium text-sm"
              >
                <p>Select an icon</p>
                <p className="text-xs opacity-70 mt-1">from the left panel</p>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </div>
    );
  },
);

PreviewContent.displayName = "PreviewContent";
