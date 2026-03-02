import { Check, Github } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Mascot from "@/public/hersection.tsx/mascot";
import HeroSvg from "./svg/hero-svg";

const HeroSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] min-h-[60vh] lg:h-[calc(100vh-64px)]">
      <div className="flex flex-col justify-center h-full py-8 lg:py-0">
        <div
          className="border flex items-center gap-2 p-0.5 pl-2.5 rounded-md text-xs w-fit"
          style={{ boxShadow: "2px 4px 6.7px rgba(0, 0, 0, 0.13)" }}
        >
          <div className="h-2.5 w-2.5 mr-0.5 bg-blue-700 rounded-full relative">
            <div className=" bg-blue-700 inset-0 absolute blur-[3px] opacity-70"></div>
          </div>
          <span className="font-semibold">
            <span className=" text-blue-700">Added </span>1000 icons
          </span>
          <div className=" bg-gray-200 p-1 rounded-sm">
            <Check size={15} />
          </div>
        </div>
        <div className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium">
          <span className="flex items-start gap-2 sm:gap-3">
            Strong{" "}
            <span
              className="bg-blue-700 p-1 sm:p-1.5 md:p-2 rounded-md [&_svg]:size-6 sm:[&_svg]:size-8 md:[&_svg]:size-10"
              style={{
                boxShadow: "0px 7px 12.8px rgba(19, 70, 231, 0.6)",
                transform: "rotate(-14.5deg)",
              }}
            >
              <Mascot />
            </span>{" "}
            Icons <br />
          </span>
          Icons for SaaS & Ai teams
        </div>
        <div className="mt-4 leading-5 text-sm sm:text-base max-w-lg">
          Strong Icons delivers powerful, modern icon systems crafted for SaaS
          and AI products. Built for  clarity, scalability, and impact so
          your interface looks sharp at every size.
        </div>

        <div className="mt-8 lg:mt-14 gap-3 sm:gap-6 flex flex-wrap">
          <Button className="py-5">Browse Component</Button>
          <Button variant="outline" className="py-5">
          Star On Github <Github/>
          </Button>
        </div>
      </div>
      <div className="hidden lg:flex justify-center items-center"><HeroSvg/></div>
    </div>
  );
};

export default HeroSection;
