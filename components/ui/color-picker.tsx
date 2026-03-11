"use client";

import type React from "react";

import { useEffect, useRef, useState, useId } from "react";

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  s /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
  return (
    "#" +
    [f(0), f(8), f(4)]
      .map((x) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

interface ColorPickerProps {
  size?: number;
  padding?: number;
  bulletRadius?: number;
  spreadFactor?: number;
  minSpread?: number;
  maxSpread?: number;
  minLight?: number;
  maxLight?: number;
  showColorWheel?: boolean;
  numPoints?: number;
  onColorChange?: (colors: string[]) => void;
}

const ColorPicker = ({
  size = 280,
  padding = 20,
  bulletRadius = 24,
  spreadFactor = 0.4,
  minSpread = Math.PI / 1.5,
  maxSpread = Math.PI / 3,
  minLight = 15,
  maxLight = 90,
  showColorWheel = false,
  numPoints = 1,
  onColorChange,
}: ColorPickerProps) => {
  const RADIUS = size / 2 - padding;
  const pickerId = useId();

  const [angle, setAngle] = useState(-Math.PI / 2);
  const [radius, setRadius] = useState(RADIUS * 0.7);
  const [drag, setDrag] = useState(false);
  const initialCallbackFired = useRef(false);

  const ref = useRef<HTMLCanvasElement>(null);

  const hue = (angle * 180) / Math.PI;
  const light = maxLight * (radius / RADIUS);
  const color = hslToHex(hue, 100, light);

  const normalizedRadius = radius / RADIUS;
  const spread =
    (minSpread + (maxSpread - minSpread) * Math.pow(normalizedRadius, 3)) *
    spreadFactor;

  const bx1 = size / 2 + Math.cos(angle - spread) * radius;
  const by1 = size / 2 + Math.sin(angle - spread) * radius;
  const bx2 = size / 2 + Math.cos(angle + spread) * radius;
  const by2 = size / 2 + Math.sin(angle + spread) * radius;

  const angle1 = angle - spread;
  const angle2 = angle + spread;
  const hue1 = (angle1 * 180) / Math.PI;
  const hue2 = (angle2 * 180) / Math.PI;
  const light1 = maxLight * (radius / RADIUS);
  const light2 = maxLight * (radius / RADIUS);
  const color1 = hslToHex(hue1, 100, light1);
  const color2 = hslToHex(hue2, 100, light2);

  useEffect(() => {
    if (!initialCallbackFired.current && onColorChange) {
      const colors =
        numPoints === 1
          ? [color]
          : numPoints === 2
            ? [color2, color]
            : [color2, color, color1];
      onColorChange(colors);
      initialCallbackFired.current = true;
    }
  }, []); // Empty deps - only on mount

  useEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, RADIUS, 0, Math.PI * 2);
    ctx.clip();

    for (let r = 0; r <= RADIUS; r++) {
      for (let a = 0; a < 360; a += 1) {
        const rad = (a * Math.PI) / 180;
        const x = size / 2 + Math.cos(rad) * r;
        const y = size / 2 + Math.sin(rad) * r;
        const lightness = minLight + (maxLight - minLight) * (r / RADIUS);
        ctx.beginPath();
        ctx.strokeStyle = hslToHex(a, 100, lightness);
        ctx.moveTo(x, y);
        ctx.lineTo(x + 1, y + 1);
        ctx.stroke();
      }
    }
  }, [size, RADIUS, minLight, maxLight]);

  function setFromPointer(e: React.PointerEvent) {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    let r = Math.sqrt(x * x + y * y);
    let a = Math.atan2(y, x);
    if (a < 0) a += 2 * Math.PI;
    r = Math.max(0, Math.min(RADIUS, r));
    setAngle(a);
    setRadius(r);
  }

  function onPointerDown(e: React.PointerEvent) {
    setDrag(true);
    setFromPointer(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    setFromPointer(e);
  }

  function onPointerUp() {
    setDrag(false);
    // Calculate final colors and call the callback
    const colors =
      numPoints === 1
        ? [color]
        : numPoints === 2
          ? [color2, color]
          : [color2, color, color1];
    onColorChange?.(colors);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 0.1 : 0.02;
    let newAngle = angle;
    let newRadius = radius;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newAngle = angle - step;
        break;
      case "ArrowRight":
        e.preventDefault();
        newAngle = angle + step;
        break;
      case "ArrowUp":
        e.preventDefault();
        newRadius = Math.min(RADIUS, radius + RADIUS * step);
        break;
      case "ArrowDown":
        e.preventDefault();
        newRadius = Math.max(0, radius - RADIUS * step);
        break;
      default:
        return;
    }

    setAngle(newAngle);
    setRadius(newRadius);

    // Recalculate colors with new values
    const newHue = (newAngle * 180) / Math.PI;
    const newLight = maxLight * (newRadius / RADIUS);
    const newColor = hslToHex(newHue, 100, newLight);
    const newNormalizedRadius = newRadius / RADIUS;
    const newSpread =
      (minSpread + (maxSpread - minSpread) * Math.pow(newNormalizedRadius, 3)) *
      spreadFactor;
    const newAngle1 = newAngle - newSpread;
    const newAngle2 = newAngle + newSpread;
    const newColor1 = hslToHex((newAngle1 * 180) / Math.PI, 100, newLight);
    const newColor2 = hslToHex((newAngle2 * 180) / Math.PI, 100, newLight);

    const colors =
      numPoints === 1
        ? [newColor]
        : numPoints === 2
          ? [newColor2, newColor]
          : [newColor2, newColor, newColor1];
    onColorChange?.(colors);
  }

  const bx = size / 2 + Math.cos(angle) * radius;
  const by = size / 2 + Math.sin(angle) * radius;

  return (
    <div>
      <div
        style={{
          width: size,
          height: size,
        }}
        className="select-none relative"
        role="application"
        aria-label="Color picker wheel"
      >
        <canvas
          ref={ref}
          width={size}
          height={size}
          className={`rounded-full ${!showColorWheel && "opacity-0"}`}
          aria-hidden="true"
        />

        {numPoints >= 2 && (
          <div
            className="absolute rounded-full border-2 border-white/80 shadow pointer-events-none opacity-90 z-20"
            style={{
              left: bx2 - bulletRadius / 1.7,
              top: by2 - bulletRadius / 1.7,
              width: bulletRadius * 1.2,
              height: bulletRadius * 1.2,
              background: color2,
            }}
            aria-hidden="true"
          />
        )}

        <div
          className="absolute rounded-full border-3 border-white/90 shadow cursor-grab touch-none z-30 active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{
            left: bx - bulletRadius,
            top: by - bulletRadius,
            width: bulletRadius * 2,
            height: bulletRadius * 2,
            background: color,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-label="Primary color selector. Use arrow keys to adjust."
          aria-valuetext={color}
          aria-describedby={`${pickerId}-instructions`}
          tabIndex={0}
        />
        <span id={`${pickerId}-instructions`} className="sr-only">
          Use left and right arrows to change hue, up and down to change
          lightness. Hold Shift for larger steps.
        </span>

        {numPoints >= 3 && (
          <div
            className="absolute rounded-full border-2 border-white/80 shadow pointer-events-none opacity-90 z-20"
            style={{
              left: bx1 - bulletRadius / 1.7,
              top: by1 - bulletRadius / 1.7,
              width: bulletRadius * 1.2,
              height: bulletRadius * 1.2,
              background: color1,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
};

export { ColorPicker };
