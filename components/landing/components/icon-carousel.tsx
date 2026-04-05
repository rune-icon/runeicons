"use client";

import { useEffect, useState } from "react";

import { motion } from "motion/react";
import {
  Atom,
  AudioLines,
  Bug,
  Cat,
  Flower2,
  Hop,
  Minus,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

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
  { value: "#1346E7", label: "Blue", bg: "bg-blue-600" },
  { value: "#dc2626", label: "Red", bg: "bg-red-600" },
  { value: "#16a34a", label: "Green", bg: "bg-green-600" },
  { value: "#9333ea", label: "Purple", bg: "bg-purple-600" },
  { value: "#ea580c", label: "Orange", bg: "bg-orange-600" },
];

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
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => {
    setActiveIndex(i);
  };

  return (
    <div className="flex h-full w-full flex-col justify-between self-stretch min-h-48">
      <div className="no-scrollbar flex h-12 items-center gap-2 overflow-x-auto mask-r-from-90% mask-l-from-90% px-4">
        {/* Animation Group */}
        <div className="flex h-8 shrink-0 items-center rounded-md border shadow-sm">
          <Select value={animation} onValueChange={setAnimation}>
            <SelectTrigger className="hover:bg-accent h-full w-24 shrink-0 justify-between gap-1 rounded-none border-none px-3 text-[10px] shadow-none transition-colors focus:ring-0 sm:text-xs">
              <SelectValue placeholder="Anim" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Normal</SelectItem>
              <SelectItem value="spin">Spin</SelectItem>
              <SelectItem value="pulse">Pulse</SelectItem>
              <SelectItem value="bounce">Bounce</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stroke Group */}
        <div className="bg-background flex h-8 shrink-0 items-center rounded-md border shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent h-full w-7 rounded-none border-none transition-colors"
            onClick={() => setStrokeWidth(Math.max(0.5, strokeWidth - 0.5))}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="bg-muted/10 flex h-full w-8 items-center justify-center border-x">
            <span className="text-muted-foreground font-mono text-[10px] font-medium">
              {strokeWidth}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent h-full w-7 rounded-none border-none transition-colors"
            onClick={() => setStrokeWidth(Math.min(4, strokeWidth + 0.5))}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Color Group */}
        <div className="bg-background flex h-8 shrink-0 items-center gap-2 rounded-md border px-3 shadow-sm">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setStrokeColor(c.value)}
              className={`h-3.5 w-3.5 rounded-full ${c.bg} border border-black/5 transition-all duration-200 ${
                strokeColor === c.value
                  ? "ring-foreground/20 scale-110 shadow-sm ring-2 ring-offset-1"
                  : "opacity-70 hover:scale-105 hover:opacity-100"
              }`}
              title={c.label}
            />
          ))}
        </div>

        {/* Size Group */}
        <div className="bg-background ml-auto flex h-8 min-w-[110px] shrink-0 items-center gap-3 rounded-md border px-3 shadow-sm">
          <span className="text-muted-foreground text-[10px] font-semibold tracking-tight whitespace-nowrap uppercase">
            Size
          </span>
          <Slider
            value={[iconSize]}
            onValueChange={([v]: any) => setIconSize(v)}
            min={10}
            max={24}
            step={1}
            className="w-14 cursor-pointer"
          />
          <span className="text-muted-foreground w-4 text-right font-mono text-[10px] font-medium">
            {iconSize}
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <motion.div
          className="absolute flex items-center justify-center"
          animate={{ x: -activeIndex * ICON_GAP }}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
          style={{ left: "50%", marginLeft: -ICON_GAP / 2 }}
        >
          {ICONS.map((item, i) => {
            const isActive = i === activeIndex;
            const dist = Math.abs(i - activeIndex);

            return (
              <motion.div
                key={item.name}
                className="flex shrink-0 cursor-pointer items-center justify-center"
                style={{ width: ICON_GAP }}
                animate={
                  isActive
                    ? {
                        opacity: 1,
                        rotate: animation === "spin" ? 360 : 0,
                        scale: animation === "pulse" ? 1.2 : 1,
                        y: animation === "bounce" ? -15 : 0,
                      }
                    : {
                        opacity: dist === 1 ? 0.3 : 0.12,
                        rotate: 0,
                        scale: 1,
                        y: 0,
                      }
                }
                transition={
                  isActive && animation !== "none"
                    ? {
                        opacity: { duration: 0.4 },
                        rotate:
                          animation === "spin"
                            ? { duration: 3, repeat: Infinity, ease: "linear" }
                            : { duration: 0.4 },
                        scale:
                          animation === "pulse"
                            ? {
                                duration: 0.8,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                              }
                            : { duration: 0.4 },
                        y:
                          animation === "bounce"
                            ? {
                                duration: 0.8,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                              }
                            : { duration: 0.4 },
                      }
                    : {
                        duration: 0.4,
                        ease: "easeOut",
                      }
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

      <div className="flex items-center justify-center gap-1.5">
        {ICONS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 w-1.5 cursor-pointer rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "bg-foreground/70 scale-125"
                : "bg-foreground/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default IconCarousel;
