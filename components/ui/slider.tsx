"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SliderProps extends React.ComponentProps<
  typeof SliderPrimitive.Root
> {}

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

interface DualRangeSliderProps extends React.ComponentProps<
  typeof SliderPrimitive.Root
> {
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
    const initialValue = Array.isArray(props.value)
      ? props.value
      : [props.value ?? props.min ?? 0];

    const min = props.min ?? 0;
    const max = props.max ?? 100;

    const getPercentage = (value: number) =>
      ((value - min) / (max - min)) * 100;

    const percentages = initialValue.map(getPercentage);
    const isDual = percentages.length > 1;

    const rangeStart = isDual ? Math.min(...percentages) : 0;
    const rangeEnd = isDual ? Math.max(...percentages) : percentages[0];

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center rounded-md",
          className,
        )}
        {...props}
        onValueChange={(vals) => {
          const changed =
            vals.length !== initialValue.length ||
            vals.some((v, i) => v !== initialValue[i]);
          if (changed && props.onValueChange) {
            props.onValueChange(vals);
          }
        }}
      >
        <SliderPrimitive.Track className="relative h-6 w-full grow overflow-hidden bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[4px_4px] bg-muted rounded-md">
          <SliderPrimitive.Range className="absolute h-full bg-foreground transition-none" />
        </SliderPrimitive.Track>
        <>
          {initialValue.map((value, index) => (
            <React.Fragment key={index}>
              <SliderPrimitive.Thumb className="relative grid h-6 w-3 cursor-grab place-content-center bg-foreground shadow-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring outline-none rounded-md">
                <motion.div
                  className="flex h-full w-full items-center justify-center"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {label && labelPosition !== "static" && (
                    <div
                      className={cn(
                        "absolute flex w-full justify-center items-start gap-0.5 pointer-events-none",
                        labelPosition === "top" && "-top-7",
                        labelPosition === "bottom" && "top-4",
                      )}
                    >
                      {labelContentPos === "left" && (
                        <>
                          {typeof label === "function" ? (
                            <span className="inline-block  -translate-y-0.5">
                              {label(value)}
                            </span>
                          ) : (
                            label && (
                              <span className="inline-block ">{label}</span>
                            )
                          )}
                        </>
                      )}
                      <NumberFlow
                        willChange
                        value={value as number}
                        isolate
                        opacityTiming={{
                          duration: 250,
                          easing: "ease-out",
                        }}
                        transformTiming={{
                          easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
                          duration: 500,
                        }}
                      />
                      {labelContentPos === "right" && (
                        <>
                          {typeof label === "function" ? (
                            <span className="inline-block  -translate-y-1">
                              {label(value)}
                            </span>
                          ) : (
                            label && (
                              <span className="inline-block ">{label}</span>
                            )
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <GripVertical
                    size={16}
                    className="px-0.5 text-primary-foreground opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </motion.div>
              </SliderPrimitive.Thumb>
            </React.Fragment>
          ))}
        </>

        {label && labelPosition === "static" && (
          <div className="absolute -top-7 w-full right-0 flex justify-end items-start gap-0.5 pointer-events-none pr-0.5">
            {initialValue.map((value, index) => (
              <div
                key={index}
                className="flex justify-center items-start gap-0.5"
              >
                {labelContentPos === "left" && (
                  <>
                    {typeof label === "function" ? (
                      <span className="inline-block  -translate-y-0.5">
                        {label(value)}
                      </span>
                    ) : (
                      label && <span className="inline-block ">{label}</span>
                    )}
                  </>
                )}
                <NumberFlow
                  willChange
                  value={value}
                  isolate
                  opacityTiming={{
                    duration: 250,
                    easing: "ease-out",
                  }}
                  transformTiming={{
                    easing: `linear(0, 0.0033 0.8%, 0.0263 2.39%, 0.0896 4.77%, 0.4676 15.12%, 0.5688, 0.6553, 0.7274, 0.7862, 0.8336 31.04%, 0.8793, 0.9132 38.99%, 0.9421 43.77%, 0.9642 49.34%, 0.9796 55.71%, 0.9893 62.87%, 0.9952 71.62%, 0.9983 82.76%, 0.9996 99.47%)`,
                    duration: 500,
                  }}
                />
                {labelContentPos === "right" && (
                  <>
                    {typeof label === "function" ? (
                      <span className="inline-block  -translate-y-1">
                        {label(value)}
                      </span>
                    ) : (
                      label && <span className="inline-block ">{label}</span>
                    )}
                  </>
                )}
                {index < initialValue.length - 1 && (
                  <span className="mx-1 text-muted-foreground">-</span>
                )}
              </div>
            ))}
          </div>
        )}
      </SliderPrimitive.Root>
    );
  },
);
DualRangeSlider.displayName = "DualRangeSlider";

export { Slider, DualRangeSlider };
