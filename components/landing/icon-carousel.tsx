"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cat,
  Flower2,
  Bug,
  Atom,
  AudioLines,
  Hop,
  Minus,
  Plus,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ICONS = [
  { icon: Cat, name: "Cat" },
  { icon: Flower2, name: "Flower" },
  { icon: Bug, name: "Bug" },
  { icon: Atom, name: "Atom" },
  { icon: AudioLines, name: "Audio" },
  { icon: Hop, name: "Hop" },
];

const COLORS = [
  { value: "currentColor", label: "Default", bg: "bg-foreground" },
  { value: "#2563eb", label: "Blue", bg: "bg-blue-600" },
  { value: "#dc2626", label: "Red", bg: "bg-red-600" },
  { value: "#16a34a", label: "Green", bg: "bg-green-600" },
  { value: "#9333ea", label: "Purple", bg: "bg-purple-600" },
  { value: "#ea580c", label: "Orange", bg: "bg-orange-600" },
];

const ANIMATIONS: Record<string, object> = {
  none: {},
  spin: { rotate: 360 },
  pulse: { scale: [1, 1.15, 1] },
  bounce: { y: [0, -12, 0] },
};

const ICON_GAP = 120;

const IconCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [strokeWidth, setStrokeWidth] = useState(1.5);
  const [iconSize, setIconSize] = useState(16);
  const [strokeColor, setStrokeColor] = useState("currentColor");
  const [animation, setAnimation] = useState("none");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ICONS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => {
    setActiveIndex(i);
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-2.5 flex-wrap">
        {/* Style Select */}
        <Select defaultValue="outline">
          <SelectTrigger className="w-auto h-8 text-xs gap-1.5 rounded-lg">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="duotone">Duotone</SelectItem>
          </SelectContent>
        </Select>

        {/* Stroke +/- */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => setStrokeWidth(Math.max(0.5, strokeWidth - 0.5))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border-l"
            onClick={() => setStrokeWidth(Math.min(4, strokeWidth + 0.5))}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Animation Select */}
        <Select value={animation} onValueChange={setAnimation}>
          <SelectTrigger className="w-auto h-8 text-xs gap-1.5 rounded-lg">
            <SelectValue placeholder="Animation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No animation</SelectItem>
            <SelectItem value="spin">Spin</SelectItem>
            <SelectItem value="pulse">Pulse</SelectItem>
            <SelectItem value="bounce">Bounce</SelectItem>
          </SelectContent>
        </Select>

        {/* Size Slider */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Size</span>
          <Slider
            value={[iconSize]}
            onValueChange={([v]) => setIconSize(v)}
            min={10}
            max={24}
            step={1}
            className="w-20"
          />
          <span className="text-xs font-mono text-muted-foreground w-5 text-right">{iconSize}</span>
        </div>

        {/* Stroke Slider */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Stroke</span>
          <Slider
            value={[strokeWidth * 10]}
            onValueChange={([v]) => setStrokeWidth(v / 10)}
            min={5}
            max={40}
            step={5}
            className="w-20"
          />
          <span className="text-xs font-mono text-muted-foreground w-5 text-right">{strokeWidth}</span>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setStrokeColor(c.value)}
              className={`w-4 h-4 rounded-full ${c.bg} transition-all duration-200 ${
                strokeColor === c.value
                  ? "ring-2 ring-offset-1 ring-foreground/30 scale-110"
                  : "opacity-60 hover:opacity-100"
              }`}
              title={c.label}
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="flex-1 flex items-center relative overflow-hidden">
        <motion.div
          className="flex items-center absolute"
          animate={{ x: `calc(50% - ${activeIndex * ICON_GAP}px)` }}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
          style={{ gap: ICON_GAP, left: 0 }}
        >
          {ICONS.map((item, i) => {
            const isActive = i === activeIndex;
            const dist = Math.abs(i - activeIndex);

            return (
              <motion.div
                key={item.name}
                className="shrink-0 flex items-center justify-center cursor-pointer"
                animate={{
                  opacity: isActive ? 1 : dist === 1 ? 0.3 : 0.12,
                  ...(isActive ? ANIMATIONS[animation] : {}),
                }}
                transition={
                  isActive && animation !== "none"
                    ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.4, ease: "easeOut" }
                }
                onClick={() => goTo(i)}
              >
                <item.icon
                  size={isActive ? iconSize * 5 : 48}
                  strokeWidth={isActive ? strokeWidth : 1.5}
                  style={{ color: isActive ? strokeColor : undefined }}
                  className={`${isActive ? "" : "text-foreground"} transition-all duration-500`}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 pb-4">
        {ICONS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-foreground/70 scale-125" : "bg-foreground/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default IconCarousel;

