"use client";

import React from "react";
import * as m from "motion/react-m";
import { cn } from "@/lib/utils";
import { useTuning } from "./tuning";

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
  const { values } = useTuning();

  const bg = background || "var(--muted)";
  const pill = pillColor || "var(--foreground)";

  const springTransition = {
    type: "spring" as const,
    visualDuration: values.morphSpringVisualDuration,
    bounce: values.morphSpringBounce,
  };

  const Container = href ? m.a : m.button;

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
        transition: `padding ${values.morphPaddingDuration * 1000}ms ease-out`,
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
      <m.div
        layout
        transition={springTransition}
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
      <m.div
        layout
        transition={springTransition}
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
