"use client";

import { useState } from "react";

import Link from "next/link";

import { GithubIcon, Twitter } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import LightLogo from "@/components/landing/svg/light";
import { Button } from "@/components/ui/button";
import { LightDarkMode } from "@/components/ui/light-dark-mode";

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
    <div className="bg-background fixed inset-x-0 z-50 ">
      <motion.div
        className="overflow-hidden"
        initial={false}
        animate={hidden ? "hidden" : "visible"}
        variants={{
          visible: { height: "auto" },
          hidden: { height: 0 },
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <motion.div
          initial={false}
          animate={hidden ? "hidden" : "visible"}
          variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" },
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Link
            href="https://github.com/rune-icon/runeicons"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block overflow-hidden border-b border-black/15 px-4 py-2 text-center text-xs font-medium text-white sm:px-8 md:px-24"
          >
            <img
              src="/landing/gradient/cta-gradient.png"
              className="absolute inset-0 h-full w-full object-cover"
              alt=""
            />
            <span className="relative z-10 text-[10px] leading-tight sm:text-xs sm:leading-snug">
              Rune Icons now includes 1000+ modern icons for your products.
            </span>
          </Link>
        </motion.div>
      </motion.div>

<div className=" w-full bg-[#F5F5F5]  dark:bg-background   border-b-2 border-dashed flex justify-center">


      <div className=" bg-[#F5F5F5] dark:bg-background  w-[90vw] 2xl:w-[85vw] flex items-center justify-between   px-4 py-3 ">
        <LightLogo />
        <div className="flex items-center gap-2">
          <ul className="hidden gap-2 md:flex">
            {Links.map((link) => (
              <Button
                variant={"ghost"}
                key={link}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-xs font-medium transition-colors"
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
                variant="outline"
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
              <Button
                variant="outline"
                size={"icon"}
                className="text-xs"
                aria-label="Rune on X"
              >
                <Twitter />
              </Button>
            </Link>
            <LightDarkMode />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
