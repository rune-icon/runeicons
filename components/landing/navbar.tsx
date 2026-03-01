import LightLogo from "@/public/logo/light";
import React from "react";

const Navbar = () => {
  const Links = ["Home", "About", "Contact"];
  return (
    <div className=" fixed top-5 flex justify-between items-center  inset-x-20 ">
      <LightLogo />
      <div>
        <ul className="flex gap-10">
          {Links.map((link) => (
            <li
              key={link}
              className="text-sm font-medium text-muted-foreground cursor-pointer"
            >
              {link}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
