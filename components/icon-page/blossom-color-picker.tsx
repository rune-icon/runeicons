"use client";

import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useMemo,
} from "react";
import {
  animate,
  motion,
  motionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue, SpringOptions } from "motion/react";

import { Popover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";
import {
  calculateAngle,
  calculateBasePosition,
  calculateHue,
  usePointerPosition,
} from "@/components/icon-page/blossom-color-picker.utils";

interface ColorDotProps {
  ring: number;
  index: number;
  totalInRing: number;
  centerX: number;
  centerY: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  pushMagnitude: number;
  pushSpring: SpringOptions;
  radius: number;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
}

function ColorDot({
  ring,
  index,
  totalInRing,
  centerX,
  centerY,
  pointerX,
  pointerY,
  pushMagnitude,
  pushSpring,
  radius,
  selectedColor,
  setSelectedColor,
}: ColorDotProps) {
  const baseRadius = ring * 20;
  const angle = calculateAngle(index, totalInRing);
  const { x: baseX, y: baseY } = calculateBasePosition(angle, baseRadius);

  let color = "hsl(0, 0%, 100%)";
  let normalizedHue = 0;
  if (ring !== 0) {
    normalizedHue = calculateHue(angle);
    color =
      ring === 1
        ? `hsl(${normalizedHue}, 60%, 85%)`
        : `hsl(${normalizedHue}, 90%, 60%)`;
  }

  const pushDistance = useTransform(() => {
    if (centerX === 0 || centerY === 0) return 0;

    const px = pointerX.get();
    const py = pointerY.get();

    const dx = px - centerX;
    const dy = py - centerY;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

    if (distanceFromCenter > radius) return 0;

    const dotX = centerX + baseX;
    const dotY = centerY + baseY;

    const cursorToDotX = dotX - px;
    const cursorToDotY = dotY - py;
    const cursorToDotDistance = Math.sqrt(
      cursorToDotX * cursorToDotX + cursorToDotY * cursorToDotY,
    );

    const minDistance = 80;
    if (cursorToDotDistance < minDistance) {
      const pushStrength = 1 - cursorToDotDistance / minDistance;
      return pushStrength * pushMagnitude;
    }

    return 0;
  });

  const pushAngle = useTransform(() => {
    if (centerX === 0 || centerY === 0) return angle;

    const px = pointerX.get();
    const py = pointerY.get();

    const dotX = centerX + baseX;
    const dotY = centerY + baseY;

    const cursorToDotX = dotX - px;
    const cursorToDotY = dotY - py;

    return Math.atan2(cursorToDotY, cursorToDotX);
  });

  const pushX = useTransform(() => {
    const distance = pushDistance.get();
    const angle = pushAngle.get();
    return Math.cos(angle) * distance;
  });

  const pushY = useTransform(() => {
    const distance = pushDistance.get();
    const angle = pushAngle.get();
    return Math.sin(angle) * distance;
  });

  const springPushX = useSpring(pushX, pushSpring);
  const springPushY = useSpring(pushY, pushSpring);

  const x = useTransform(() => baseX + springPushX.get());
  const y = useTransform(() => baseY + springPushY.get());

  const dotVariants = {
    default: {
      scale: 1,
    },
    hover: {
      scale: 1.5,
      transition: { duration: 0.13 },
    },
  };

  const ringVariants = {
    default: {
      opacity: 0,
    },
    hover: {
      opacity: 0.4,
      transition: { duration: 0.13 },
    },
  };

  return (
    <motion.div
      className="color-dot"
      style={{
        x,
        y,
        backgroundColor: color,
        willChange: "transform, background-color",
      } as any}
      variants={dotVariants}
      initial="default"
      whileHover="hover"
      whileTap={{ scale: 1.2 }}
      onTap={() => {
        if (selectedColor === color) {
          setSelectedColor(null);
        } else {
          setSelectedColor(color);
        }
      }}
      transition={{
        scale: { type: "spring", damping: 30, stiffness: 200 },
      }}
    >
      <motion.div className="color-dot-ring" variants={ringVariants} />
    </motion.div>
  );
}

interface GradientCircleProps {
  index: number;
  totalInRing: number;
  centerX: number;
  centerY: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  containerRadius: number;
}

function GradientCircle({
  index,
  totalInRing,
  centerX,
  centerY,
  pointerX,
  pointerY,
  containerRadius,
}: GradientCircleProps) {
  const angle = calculateAngle(index, totalInRing);
  const baseRadius = containerRadius - 40;
  const { x: baseX, y: baseY } = calculateBasePosition(angle, baseRadius);
  const normalizedHue = calculateHue(angle);

  const gradient = `radial-gradient(circle, hsla(${normalizedHue}, 90%, 60%, 1) 0%, hsla(${normalizedHue}, 90%, 60%, 0) 66%)`;

  const proximity = useTransform(() => {
    if (centerX === 0 || centerY === 0) return 0;

    const px = pointerX.get();
    const py = pointerY.get();

    const gradientX = centerX + baseX;
    const gradientY = centerY + baseY;

    const dx = px - gradientX;
    const dy = py - gradientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 100;
    const proximityValue = Math.max(0, 1 - distance / maxDistance);

    return proximityValue;
  });

  const { opacity, scale } = useTransform(proximity, [0, 1], {
    opacity: [0.15, 0.35],
    scale: [1, 1.2],
  });

  const springOpacity = useSpring(opacity, {
    damping: 30,
    stiffness: 100,
  });
  const springScale = useSpring(scale, {
    damping: 30,
    stiffness: 100,
  });

  return (
    <motion.div
      className="gradient-circle"
      style={{
        x: baseX,
        y: baseY,
        opacity: springOpacity,
        scale: springScale,
        background: gradient,
        willChange: "transform, opacity",
      } as any}
    />
  );
}

interface BlossomColorPickerProps {
  onColorSelect: (color: string) => void;
  color?: string;
  pushMagnitude?: number;
  pushSpring?: SpringOptions;
  inline?: boolean;
  trigger?: React.ReactNode;
  className?: string;
}

export function BlossomColorPicker({
  onColorSelect,
  color = "#ffffff",
  pushMagnitude = 5,
  pushSpring = {
    damping: 30,
    stiffness: 100,
  },
  inline = false,
  triggerClassName,
  className,
}: BlossomColorPickerProps & { triggerClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ centerX, centerY, radius }, setContainerDimensions] = useState({
    centerX: 0,
    centerY: 0,
    radius: 70, // Matches 140px width
  });

  const pointer = usePointerPosition();
  const [selectedColor, setSelectedColor] = useState<string | null>(color);

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (!inline && !isOpen) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerDimensions({
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        radius: rect.width / 2,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [inline, isOpen]);

  const rings = [{ count: 1 }, { count: 6 }, { count: 12 }];

  const dots: Array<{
    ring: number;
    index: number;
    totalInRing: number;
  }> = [];

  rings.forEach((ring, ringIndex) => {
    for (let i = 0; i < ring.count; i++) {
      dots.push({
        ring: ringIndex,
        index: i,
        totalInRing: ring.count,
      });
    }
  });

  const originalStopValues = useMemo(() => {
    const values: string[] = [];
    for (let i = 0; i <= 360; i += 30) {
      values.push(`hsl(${i}, 90%, 60%)`);
    }
    return values;
  }, []);

  const stopMotionValues = useMemo(
    () => originalStopValues.map((value) => motionValue(value)),
    [originalStopValues],
  );

  useEffect(() => {
    if (selectedColor !== null) {
      for (const stopValue of stopMotionValues) {
        animate(stopValue, selectedColor, {
          duration: 0.2,
        });
      }
    } else {
      for (let i = 0; i < stopMotionValues.length; i++) {
        animate(stopMotionValues[i], originalStopValues[i], {
          duration: 0.2,
        });
      }
    }
  }, [selectedColor, stopMotionValues, originalStopValues]);

  const gradientBackground = useTransform(() => {
    let stops = "";
    for (let i = 0; i < stopMotionValues.length; i++) {
      stops += stopMotionValues[i].get();
      if (i < stopMotionValues.length - 1) {
        stops += ", ";
      }
    }
    return `conic-gradient(from 0deg, ${stops})`;
  });

  const gradientScale = useMotionValue(1);

  useEffect(() => {
    if (selectedColor !== null) {
      animate(gradientScale, 1.1, {
        type: "spring",
        visualDuration: 0.2,
        bounce: 0.8,
        velocity: 2,
      });
    } else {
      animate(gradientScale, 1, {
        type: "spring",
        visualDuration: 0.2,
        bounce: 0,
      });
    }
  }, [selectedColor, gradientScale]);

  const handleColorClick = (c: string | null) => {
    setSelectedColor(c);
    if (c) {
      onColorSelect(c);
    }
  };

  const pickerContent = (
    <div
      className={cn("gradient-wrapper", !inline && "scale-[1.2]", className)}
    >
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          className="absolute inset-0 w-full h-full rounded-full z-0"
          style={{
            background: gradientBackground,
            scale: gradientScale,
          } as any}
        />
        <motion.div
          className="absolute inset-0 w-full h-full bg-popover rounded-full z-[1]"
          animate={{
            scale: selectedColor !== null ? 0.9 : 0.98,
          }}
          transition={{
            type: "spring",
            visualDuration: 0.2,
            bounce: 0.2,
          }}
        />
      </div>
      <div ref={containerRef} className="picker-background">
        {Array.from({ length: 6 }).map((_, index) => (
          <GradientCircle
            key={`gradient-${index}`}
            index={index}
            totalInRing={6}
            centerX={centerX}
            centerY={centerY}
            pointerX={pointer.x}
            pointerY={pointer.y}
            containerRadius={radius}
          />
        ))}
        {dots
          .slice()
          .reverse()
          .map((dot) => (
            <ColorDot
              key={`${dot.ring}-${dot.index}`}
              ring={dot.ring}
              index={dot.index}
              totalInRing={dot.totalInRing}
              centerX={centerX}
              centerY={centerY}
              pointerX={pointer.x}
              pointerY={pointer.y}
              radius={radius}
              pushMagnitude={pushMagnitude}
              pushSpring={pushSpring}
              selectedColor={selectedColor}
              setSelectedColor={handleColorClick}
            />
          ))}
      </div>
    </div>
  );

  if (inline) {
    return pickerContent;
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger
        className={cn(
          "h-4 w-4 shrink-0 rounded-full ring-1 ring-border transition-transform ring-inset hover:scale-125 focus:outline-none cursor-pointer",
          isOpen ? "scale-125" : "scale-100",
          triggerClassName,
        )}
        style={{ backgroundColor: color }}
      />
      <Popover.Portal>
        <Popover.Positioner
          side="left"
          sideOffset={16}
          align="center"
          collisionPadding={10}
          className="isolate z-[100]"
        >
          <Popover.Popup
            className={cn(
              "group relative flex items-center justify-center outline-none bg-popover border border-border rounded-full shadow-2xl overflow-hidden p-6 hover:bg-accent transition-colors duration-300",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            )}
          >
            {pickerContent}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
