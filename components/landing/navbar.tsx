"use client";

import LightLogo from "@/public/logo/light";
import { Button } from "@/components/ui/button";
import { LightDarkMode } from "@/components/ui/light-dark-mode";
import { StarsCount } from "@/components/landing/stars-count";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

const Navbar = () => {
  const Links = ["About Devs", "Sponsors"];
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      className="fixed top-0 py-3 sm:py-5 flex justify-between items-center bg-[#F5F5F5] dark:bg-background border-b-2 border-dashed inset-x-0 px-4 sm:px-8 md:px-24 z-50"
      animate={hidden ? "hidden" : "visible"}
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <LightLogo />
      <div className="flex items-center gap-3 sm:gap-6">
        <ul className="hidden md:flex gap-10">
          {Links.map((link) => (
            <li
              key={link}
              className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            >
              {link}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link href="https://github.com/AitijhyaModak/rune-icons" target="_blank" rel="noopener noreferrer">
            <Button
              className="relative overflow-hidden text-xs group"
              aria-label="GitHub"
            >
              <GithubIcon className="size-4" />
              {/* <StarsCount /> */}1000+
            </Button>
          </Link>
          <LightDarkMode />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;

