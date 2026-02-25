"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  NavbarHeartIcon as HeartIcon,
  LogoSvg,
  X,
} from "@/components/icons/svg";

import ThemeToggle from "./ThemeToggle";

const Logo = () => {
  return (
    <div className="h-10.4 relative w-10.25">
      <div className="absolute inset-0 opacity-70 blur-[0.125rem]">
        <LogoSvg />
      </div>

      <div className="relative h-full w-full">
        <LogoSvg />
      </div>
    </div>
  );
};

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY.current || currentY < 20);
      setScrolled(currentY > 20);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed right-0 left-0 z-50 transition-all duration-300",
        visible ? "top-7.5 opacity-100" : "-top-24 opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "transition-all duration-300",
          scrolled
            ? "bg-background/80 mx-20.5 rounded-xl px-9.75 py-2 backdrop-blur-md max-md:mx-6 max-md:px-6"
            : "mx-20 px-9.75 max-md:mx-6 max-md:px-6",
        ].join(" ")}
      >
        <div className="h-10.4 flex w-full flex-row items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Logo />
            </Link>
          </div>

          <div className="flex flex-row items-center gap-10 max-sm:gap-5">
            <ThemeToggle />
            <Link
              href="/about"
              className="text-3.5 font-inter text-center leading-3 font-normal text-black transition-opacity hover:opacity-70"
            >
              About Devs
            </Link>
            <Link
              href="/sponsor"
              className="text-3.5 font-inter flex items-center gap-1.5 text-center leading-3 font-normal text-black transition-opacity hover:opacity-70"
            >
              Sponsor Us
              <HeartIcon
                className="block h-5.75 w-5.75 shrink-0"
                aria-hidden="true"
                focusable="false"
              />
            </Link>

            <Link
              href="https://x.com/RuneIcon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-5.75 w-5.75 items-center justify-center transition-opacity hover:opacity-70"
            >
              <X className="h-full w-full" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
