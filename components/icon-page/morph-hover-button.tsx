"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface MorphHoverButtonProps {
  title: string;
  href?: string;
  className?: string;
  background?: string;
  pillColor?: string;
  onClick?: () => void;
}

export const MorphHoverButton = ({
  title,
  href,
  className,
  background,
  pillColor,
  onClick,
}: MorphHoverButtonProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const bg = background || "var(--muted)";
  const pill = pillColor || "var(--foreground)";

  const transition = {
    type: "spring",
    bounce: 0.1,
    duration: 0.4,
  } as const;

  const Container = href ? motion.a : motion.button;

  return (
    <Container
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex items-center justify-center gap-2 h-[30px] min-w-[70px] cursor-pointer no-underline outline-none border-none bg-transparent group",
        isHovered ? "pl-2 pr-5" : "pl-5 pr-2",
        className,
      )}
      style={{
        transition: "padding 0.4s",
      } as any}
    >
      {/* Title */}
      <span
        className={cn(
          "relative z-10 text-[14px] font-medium transition-colors duration-400 font-mono select-none",
        )}
        style={{
          color: isHovered ? bg : pill,
        }}
      >
        {title}
      </span>

      {/* Pill (Expands to BG) */}
      <motion.div
        layout
        transition={transition}
        className="absolute z-[3]"
        style={{
          backgroundColor: pill,
          borderRadius: isHovered ? 8 : 2,
          left: isHovered ? 0 : 8,
          right: isHovered ? 0 : "auto",
          top: isHovered ? 0 : 8,
          bottom: isHovered ? 0 : 8,
          width: isHovered ? "100%" : 4,
        } as any}
      />

      {/* BG (Shrinks to Pill) */}
      <motion.div
        layout
        transition={transition}
        className="absolute z-[1]"
        style={{
          backgroundColor: bg,
          borderRadius: 8,
          left: isHovered ? "auto" : 0,
          right: isHovered ? 8 : 0,
          top: isHovered ? 8 : 0,
          bottom: isHovered ? 8 : 0,
          width: isHovered ? 4 : "100%",
        } as any}
      />
    </Container>
  );
};
