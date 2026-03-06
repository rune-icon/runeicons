"use client";

import { useState } from "react";

import Link from "next/link";

import { GithubIcon, Twitter } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { Button } from "@/components/ui/button";
import { LightDarkMode } from "@/components/ui/light-dark-mode";
import LightLogo from "@/public/logo/light";

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
      className="dark:bg-background fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b-2 border-dashed bg-[#F5F5F5] px-4 py-3 sm:px-8 sm:py-5 md:px-24"
      animate={hidden ? "hidden" : "visible"}
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <LightLogo />
      <div className="flex items-center gap-2">
        <ul className="hidden gap-2 md:flex">
          {Links.map((link) => (
            <Button
              variant={"ghost"}
              key={link}
              className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium transition-colors"
            >
              {link}
            </Button>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/AitijhyaModak/rune-icons"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="group relative overflow-hidden text-xs"
              aria-label="GitHub"
            >
              <GithubIcon className="size-4" />
              {/* <StarsCount /> */}1000+
            </Button>
          </Link>
          <Link
            href="https://x.com/RuneIcon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="text-xs" aria-label="Rune on X">
              <Twitter />
            </Button>
          </Link>
          <LightDarkMode />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
