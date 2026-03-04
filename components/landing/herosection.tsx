import React from "react";

import { Check, Github } from "lucide-react";

import Mascot from "@/public/hersection.tsx/mascot";

import { Button } from "../ui/button";
import HeroSvg from "./svg/hero-svg";

const HeroSection = () => {
  return (
    <div className="grid min-h-[60vh] grid-cols-1 lg:h-[calc(100vh-64px)] lg:grid-cols-[7fr_3fr]">
      <div className="flex h-full flex-col justify-center py-8 lg:py-0">
        <div
          className="flex w-fit items-center gap-2 rounded-md border p-0.5 pl-2.5 text-xs"
          style={{ boxShadow: "2px 4px 6.7px rgba(0, 0, 0, 0.13)" }}
        >
          <div className="relative mr-0.5 h-2.5 w-2.5 rounded-full bg-blue-700">
            <div className="absolute inset-0 bg-blue-700 opacity-70 blur-[3px]"></div>
          </div>
          <span className="font-semibold">
            <span className="text-blue-700">Added </span>1000 icons
          </span>
          <div className="bg-background rounded-sm border p-1">
            <Check size={15} />
          </div>
        </div>
        <div className="mt-4 text-3xl font-medium sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="flex items-start gap-2 sm:gap-3">
            Strong{" "}
            <span
              className="rounded-md bg-blue-700 p-1 sm:p-1.5 md:p-2 [&_svg]:size-6 sm:[&_svg]:size-8 md:[&_svg]:size-10"
              style={{
                boxShadow: "0px 7px 12.8px rgba(19, 70, 231, 0.6)",
                transform: "rotate(-14.5deg)",
              }}
            >
              <Mascot />
            </span>{" "}
            Icons <br />
          </span>
          Icons for SaaS & AI teams
        </div>
        <div className="text-muted-foreground mt-4 max-w-lg text-sm leading-5 sm:text-base">
          Strong Icons delivers powerful, modern icon systems crafted for SaaS
          and AI products. Built for clarity, scalability, and impact so your
          interface looks sharp at every size.
        </div>

        <div className="mt-8 flex flex-wrap gap-3 sm:gap-6 lg:mt-14">
          <Button className="py-5">Browse Icons</Button>
          <Button variant="ghost" className="py-5">
            Star On Github <Github />
          </Button>
        </div>
      </div>
      <div className="hidden items-center justify-center lg:flex">
        <HeroSvg />
      </div>
    </div>
  );
};

export default HeroSection;
