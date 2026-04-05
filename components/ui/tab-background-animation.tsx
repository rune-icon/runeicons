"use client";
import { useState } from "react";

import { motion } from "motion/react";
import { ArrowRight, Layers, Layout, Users } from "lucide-react";

const TabBackgroundAnimation = () => {
  const arr = [Layers, ArrowRight, Layout, Users];
  const [active, setActive] = useState(0);

  return (
    <div className="rounded-xl bg-white dark:bg-zinc-900">
      <div className="flex w-full gap-1 rounded-xl bg-black/10 p-1 shadow-[0px_1px_0px_rgba(255,255,255,0.25),inset_0px_1px_2px_rgba(0,0,0,0.15)] dark:bg-white/10 dark:shadow-[0px_1px_0px_rgba(0,0,0,0.25),inset_0px_1px_2px_rgba(255,255,255,0.08)]">
        {arr.map((Icon, i) => (
          <button
            key={i}
            onMouseEnter={() => setActive(i)}
            className="relative flex flex-1 cursor-pointer items-center justify-center py-3"
          >
            {active === i && (
              <motion.div
                layoutId="highlight"
                className="absolute inset-0 rounded-xl bg-zinc-100 shadow-[0.222px_0.222px_0.314px_-0.5px_rgba(0,0,0,0.2),0.605px_0.605px_0.856px_-1px_rgba(0,0,0,0.18),1.329px_1.329px_1.88px_-1.5px_rgba(0,0,0,0.25),2.95px_2.95px_4.172px_-2px_rgba(0,0,0,0.1),2.5px_2.5px_3px_-2.5px_rgba(0,0,0,0.15),-0.5px_-0.5px_0px_rgba(0,0,0,0.1),inset_0.5px_0.5px_1px_#FFFFFF,inset_-0.5px_-0.5px_1px_rgba(0,0,0,0.15)] dark:bg-zinc-800 dark:shadow-[0.222px_0.222px_0.314px_-0.5px_rgba(0,0,0,0.35),0.605px_0.605px_0.856px_-1px_rgba(0,0,0,0.3),1.329px_1.329px_1.88px_-1.5px_rgba(0,0,0,0.35),2.95px_2.95px_4.172px_-2px_rgba(0,0,0,0.28),2.5px_2.5px_3px_-2.5px_rgba(0,0,0,0.35),inset_0.5px_0.5px_1px_rgba(255,255,255,0.08),inset_-0.5px_-0.5px_1px_rgba(0,0,0,0.4)]"
                initial={{ scale: 1 }}
                animate={{ scale: 1.3 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 40,
                }}
              />
            )}

            <span className="relative z-10 font-extralight text-black dark:text-white">
              <Icon className="h-5 w-5" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabBackgroundAnimation;
