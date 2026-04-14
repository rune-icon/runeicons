import Link from "next/link";

import { Check, Github } from "lucide-react";

import Mascot from "@/components/landing/svg/mascot";

import { Button } from "../../ui/button";
import HeroSvg from "../svg/hero-svg";

const HeroSection = () => {
  return (
    <div className="grid min-h-[60vh] grid-cols-1 lg:h-[calc(100vh-64px)] lg:grid-cols-2">
      <div className="flex h-full flex-col justify-center py-8 lg:py-0">
        <div
          className="flex w-fit items-center gap-2 rounded-md border p-0.5 pl-2.5 text-xs"
        >
          {/* <div className="relative mr-0.5 h-2.5 w-2.5 rounded-full bg-blue-700">
            <div className="absolute inset-0 bg-blue-700 opacity-70 blur-[3px]"></div>
          </div> */}
          <span className="font-semibold">
            <span className="text-blue-700">Added </span>1000 icons
          </span>
          <div className="bg-background rounded-sm border p-1">
            <Check size={15} />
          </div>
        </div>
        <div className="mt-4 text-2xl leading-tight sm:leading-none xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium">
        Modern <span className="text-blue-700">icon</span> <br /> <span className="text-blue-700">system</span> for products      {/* <span
            className="inline-block align-middle rounded-md bg-cover bg-center bg-no-repeat p-1 sm:p-1.5 md:p-2 [&_svg]:size-6 sm:[&_svg]:size-8 md:[&_svg]:size-10"
            style={{
              backgroundImage: "url('/landing/gradient/search-gradient2.png')",
              boxShadow: "0px 7px 12.8px rgba(19, 70, 231, 0.6)",
              transform: "rotate(-14.5deg)",
            }}
          >
            <Mascot />
          </span>{" "} */}
        </div>
        <div className="text-muted-foreground mt-4 max-w-lg text-xs leading-tight sm:text-sm sm:leading-5 md:text-base">
          Consistent, lightweight, and production-ready icons designed to fit
          seamlessly into SaaS and AI interfaces.
        </div>

        <div className="mt-8 flex flex-wrap gap-2 sm:gap-4 lg:mt-14">
          <Link href="/icons">
            <Button className="py-5">Browse Icons</Button>
          </Link>
          <Link
            href="https://github.com/rune-icon/runeicons"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="py-5">
              Star On Github <Github />
            </Button>
          </Link>
        </div>
      </div>
      <div className=" flex items-center justify-center">
        <HeroSvg />
      </div>
    </div>
  );
};

export default HeroSection;
