import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

export function calculateAngle(index: number, totalInRing: number): number {
  return (index / totalInRing) * Math.PI * 2;
}

export function calculateBasePosition(angle: number, radius: number) {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export function calculateHue(angle: number): number {
  const hueDegrees = (angle * 180) / Math.PI - 90 - 180;
  return ((hueDegrees % 360) + 360) % 360;
}

export function usePointerPosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []); 

  return { x, y };
}
