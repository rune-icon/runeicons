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
    <div className="flex flex-col justify-between h-full  w-full self-stretch">
      <div className="  flex mask-r-from-90% mask-l-from-90% items-center gap-2 px-4  bg-muted/5 overflow-x-auto no-scrollbar">
        {/* Animation Group */}
        <div className="flex items-center h-8 bg-background border rounded-md shadow-sm shrink-0 overflow-hidden">
          <Select value={animation} onValueChange={setAnimation}>
            <SelectTrigger className="w-24 h-full text-[10px] sm:text-xs gap-1 border-none shadow-none focus:ring-0 rounded-none hover:bg-accent transition-colors justify-between shrink-0 px-3">
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
        <div className="flex items-center border bg-background rounded-md shadow-sm h-8 overflow-hidden shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-full w-7 rounded-none hover:bg-accent transition-colors border-none"
            onClick={() => setStrokeWidth(Math.max(0.5, strokeWidth - 0.5))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <div className="w-8 h-full flex items-center justify-center border-x bg-muted/10">
            <span className="text-[10px] font-mono font-medium text-muted-foreground">{strokeWidth}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-full w-7 rounded-none hover:bg-accent transition-colors border-none"
            onClick={() => setStrokeWidth(Math.min(4, strokeWidth + 0.5))}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Color Group */}
        <div className="flex items-center gap-2 px-3 h-8 bg-background border rounded-md shadow-sm shrink-0">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setStrokeColor(c.value)}
              className={`w-3.5 h-3.5 rounded-full ${c.bg} transition-all duration-200 border border-black/5 ${
                strokeColor === c.value
                  ? "ring-2 ring-offset-1 ring-foreground/20 scale-110 shadow-sm"
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              }`}
              title={c.label}
            />
          ))}
        </div>

        {/* Size Group */}
        <div className="flex items-center gap-3 ml-auto min-w-[110px] h-8 px-3 bg-background border rounded-md shadow-sm shrink-0">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight whitespace-nowrap">Size</span>
          <Slider
            value={[iconSize]}
            onValueChange={([v]) => setIconSize(v)}
            min={10}
            max={24}
            step={1}
            className="w-14 cursor-pointer"
          />
          <span className="text-[10px] font-mono font-medium text-muted-foreground w-4 text-right">{iconSize}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <motion.div
          className="flex items-center justify-center absolute"
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
                className="shrink-0 flex items-center justify-center cursor-pointer"
                style={{ width: ICON_GAP }}
                animate={isActive ? {
                  opacity: 1,
                  rotate: animation === "spin" ? 360 : 0,
                  scale: animation === "pulse" ? 1.2 : 1,
                  y: animation === "bounce" ? -15 : 0,
                } : {
                  opacity: dist === 1 ? 0.3 : 0.12,
                  rotate: 0,
                  scale: 1,
                  y: 0,
                }}
                transition={isActive && animation !== "none" ? {
                  opacity: { duration: 0.4 },
                  rotate: animation === "spin" 
                    ? { duration: 3, repeat: Infinity, ease: "linear" } 
                    : { duration: 0.4 },
                  scale: animation === "pulse" 
                    ? { duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } 
                    : { duration: 0.4 },
                  y: animation === "bounce" 
                    ? { duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } 
                    : { duration: 0.4 }
                } : { 
                  duration: 0.4, 
                  ease: "easeOut" 
                }}
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
            className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
              i === activeIndex ? "bg-foreground/70 scale-125" : "bg-foreground/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default IconCarousel;

