"use client";
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
import Mascot from "../svg/mascot";

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
      {" "}
      <img
        src="/landing/gradient/cta-gradient.png"
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
      />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 mask-[radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-[0.03] dark:opacity-[0.05]">
          <svg preserveAspectRatio="none" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
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
            className="text-white/75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
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
        
        <div className="h-20 w-20 mb-3">
            <Mascot/>
          </div>
        {/* Heading Style (Synced with HeroSection) */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 leading-[1.1] font-medium tracking-tight text-3xl sm:text-xl md:text-xl lg:text-5xl"
        >
          <span className="bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent">
            Ready to build <br /> something beautiful?
          </span>
        </motion.h2>


        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
          size={"lg"}
          variant={"default"}

          >
            Browse Icons
          </Button>
          <Button          size={"lg"}

          variant={"secondary"}
          >
            Star On GitHub
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
