"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimationPopBarProps {
  className?: string;
}

export function AnimationPopBar({ className }: AnimationPopBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-[55px] h-[48px] bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-all duration-200 group relative z-50",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Play className="w-4 h-4 text-primary fill-primary/10 transition-all duration-200 group-hover:scale-110 group-hover:fill-primary/20" />
      </div>
      
      <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-primary/40 animate-pulse" />
    </motion.div>
  );
}
