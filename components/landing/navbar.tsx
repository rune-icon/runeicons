import LightLogo from "@/public/logo/light";
import { Button } from "@/components/ui/button";
import { LightDarkMode } from "@/components/ui/light-dark-mode";
import { StarsCount } from "@/components/landing/stars-count";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const Links = ["About Devs", "Sponsors"];
  return (
    <div className=" fixed top-5 flex justify-between items-center  inset-x-20 z-50">
      <LightLogo />
      <div className="flex items-center gap-6">
        <ul className="flex gap-10">
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
    </div>
  );
};

export default Navbar;
