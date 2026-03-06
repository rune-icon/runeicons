"use client";

import React from "react";

import { motion } from "framer-motion";
import {
  Diamond,
  Hammer,
  Paintbrush,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const CTA = () => {
  const icons = [
    { icon: Rocket, x: "10%", y: "20%", size: 32, delay: 0 },
    { icon: Sparkles, x: "85%", y: "15%", size: 24, delay: 1 },
    { icon: Paintbrush, x: "15%", y: "75%", size: 28, delay: 2 },
    { icon: Diamond, x: "80%", y: "70%", size: 26, delay: 0.5 },
    { icon: Hammer, x: "50%", y: "10%", size: 22, delay: 1.5 },
    { icon: Zap, x: "25%", y: "40%", size: 20, delay: 3 },
  ];

  return (
    <section className="relative h-full w-full overflow-hidden rounded-3xl py-24">
      {/* Background Layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          aria-hidden
          className="absolute inset-0 z-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-600),var(--color-white)_100%)]"
        />

        {/* Soft Mesh Gradients */}
        <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/2 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-purple-500/2 blur-[120px]" />

        {/* Subtle Grid */}
        <div className="absolute inset-0 mask-[radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-[0.03] dark:opacity-[0.05]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="cta-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>

        {/* Floating Icons */}
        {icons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              y: [0, -15, 0],
              x: [0, 10, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
            }}
          >
            <item.icon size={item.size} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Heading Style (Synced with HeroSection) */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-5 text-base leading-[1.1] font-medium tracking-tight sm:text-lg md:text-xl lg:text-3xl"
        >
          <span className="from-foreground to-foreground/50 bg-linear-to-b bg-clip-text text-transparent">
            Ready to build something beautiful?
          </span>
        </motion.h2>

        {/* Paragraph Style (Synced with HeroSection) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground mb-8 max-w-lg text-[10px] leading-5 sm:text-xs"
        >
          Join a community of forward-thinking creators using Rune <br /> to
          define the next generation of web interfaces.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button>Get Started</Button> <Button>Get Started</Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
