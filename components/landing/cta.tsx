"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, Paintbrush, Diamond, Hammer, Zap, Check } from "lucide-react";
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
    <section className="relative w-full py-24 px-6 overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Mesh Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/2 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/2 blur-[120px] rounded-full" />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mask-[radial-gradient(ellipse_at_center,white,transparent_80%)]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
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
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 6 + i, 
              repeat: Infinity, 
              delay: item.delay,
              ease: "easeInOut"
            }}
            style={{ 
              position: "absolute", 
              left: item.x, 
              top: item.y, 
              color: "rgba(59, 130, 246, 0.5)"
            }}
          >
            <item.icon size={item.size} strokeWidth={1.5} />
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Pill Component (Synced with HeroSection) */}
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="flex w-fit items-center gap-2 rounded-md border p-0.5 pl-2.5 text-xs bg-background/50 backdrop-blur-sm mb-10"
           style={{ boxShadow: "2px 4px 6.7px rgba(0, 0, 0, 0.13)" }}
        >
          <div className="relative mr-0.5 h-2.5 w-2.5 rounded-full bg-blue-700">
            <div className="absolute inset-0 bg-blue-700 opacity-70 blur-[3px]"></div>
          </div>
          <span className="font-semibold">
            <span className="text-blue-700">Elevate </span>Your Workflow
          </span>
          <div className="bg-background rounded-sm border p-1">
            <Check size={12} />
          </div>
        </motion.div>

        {/* Heading Style (Synced with HeroSection) */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl font-medium sm:text-4xl md:text-5xl lg:text-7xl tracking-tight mb-5 leading-[1.1]"
        >
          <span className="bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
            Ready to build <br />
            something beautiful?
          </span>
        </motion.h2>

        {/* Paragraph Style (Synced with HeroSection) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground max-w-lg text-sm leading-5 sm:text-lg mb-12 mx-auto"
        >
          Join a community of forward-thinking creators using Rune to define 
          the next generation of web interfaces.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button>
            Get Started Free <ArrowRight size={18} />
          </Button>
          
          <Button variant="ghost">
            Documentation
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
