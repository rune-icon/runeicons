"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import NumberFlow from "@number-flow/react";
import { GripVertical } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center rounded-md",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
      <SliderPrimitive.Range className="absolute h-full bg-foreground" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-md border border-border bg-background shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";

interface DualRangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom" | "static";
  labelContentPos?: "left" | "right";
  label?: React.ReactNode | ((value: number | undefined) => React.ReactNode);
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(
  (
    {
      className,
      label,
      labelPosition = "top",
      labelContentPos = "right",
      ...props
    },
    ref,
  ) => {
    const values = Array.isArray(props.value)
      ? props.value
      : [props.value ?? props.min ?? 0];

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center rounded-md",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-6 w-full grow overflow-hidden rounded-md bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[length:4px_4px] bg-muted">
          <SliderPrimitive.Range className="absolute h-full bg-foreground transition-none" />
        </SliderPrimitive.Track>

        {values.map((value, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="relative grid h-6 w-3 cursor-grab place-content-center rounded-md bg-foreground shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <motion.div
              className="flex h-full w-full items-center justify-center"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {label && labelPosition !== "static" ? (
                <div
                  className={cn(
                    "pointer-events-none absolute flex w-full items-start justify-center gap-0.5",
                    labelPosition === "top" && "-top-7",
                    labelPosition === "bottom" && "top-4",
                  )}
                >
                  {labelContentPos === "left"
                    ? renderLabel(label, value)
                    : null}
                  <NumberFlow
                    willChange
                    isolate
                    value={value}
                    opacityTiming={{ duration: 250, easing: "ease-out" }}
                    transformTiming={{
                      duration: 500,
                      easing:
                        "linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)",
                    }}
                  />
                  {labelContentPos === "right"
                    ? renderLabel(label, value, "-translate-y-1")
                    : null}
                </div>
              ) : null}
              <GripVertical
                size={16}
                className="px-0.5 text-primary-foreground opacity-70 transition-opacity group-hover:opacity-100"
              />
            </motion.div>
          </SliderPrimitive.Thumb>
        ))}

        {label && labelPosition === "static" ? (
          <div className="pointer-events-none absolute -top-7 right-0 flex w-full items-start justify-end gap-0.5 pr-0.5">
            {values.map((value, index) => (
              <div key={index} className="flex items-start justify-center gap-0.5">
                {labelContentPos === "left" ? renderLabel(label, value) : null}
                <NumberFlow
                  willChange
                  isolate
                  value={value}
                  opacityTiming={{ duration: 250, easing: "ease-out" }}
                  transformTiming={{
                    duration: 500,
                    easing:
                      "linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)",
                  }}
                />
                {labelContentPos === "right"
                  ? renderLabel(label, value, "-translate-y-1")
                  : null}
                {index < values.length - 1 ? (
                  <span className="mx-1 text-muted-foreground">-</span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </SliderPrimitive.Root>
    );
  },
);
DualRangeSlider.displayName = "DualRangeSlider";

function renderLabel(
  label: DualRangeSliderProps["label"],
  value: number | undefined,
  className?: string,
) {
  const content = typeof label === "function" ? label(value) : label;

  return content ? <span className={cn("inline-block", className)}>{content}</span> : null;
}

export { Slider, DualRangeSlider };
