import React from "react";

import BentoSvg from "./bento-svg";
import IconCarousel from "./icon-carousel";
import BentoCenterSvg from "./svg/bento-center-svg";
import IconDrawSvg from "./svg/bento-draw-svg";
import RocketInteractive from "./svg/rocket-interactive";

interface BentoCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  graphicClassName?: string;
  fullBackgroundGraphic?: boolean;
}

const BentoCard = ({
  title,
  description,
  children,
  className,
  graphicClassName,
  fullBackgroundGraphic,
}: BentoCardProps) => {
  return (
    <div
      className={`border-border bg-card text-card-foreground relative flex min-h-0 flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg md:rounded-3xl ${className}`}
    >
      <div
        className={
          fullBackgroundGraphic
            ? `absolute inset-0 z-0 overflow-hidden ${graphicClassName ?? ""}`
            : `relative z-0 flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 md:p-6 ${graphicClassName ?? ""}`
        }
      >
        {children}
      </div>
      {(title || description) && (
        <div className="relative z-10 mt-auto shrink-0 p-4 pt-0 md:p-8">
          <h3 className="md:text-md mb-1 text-sm font-semibold">{title}</h3>
          <p className="md:text-md text-muted-foreground text-sm">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

const Bento = () => {
  return (
    <section className="w-full">
      <div className="mx-auto grid min-h-[50vh] w-full grid-cols-1 gap-2 md:gap-4 lg:h-[90vh] lg:grid-cols-12">
        <div className="grid min-h-0 grid-cols-1 gap-2 md:gap-4 lg:col-span-4 lg:grid-rows-[6fr_4fr]">
          <BentoCard
            title="Met the Mind Behind the Magic"
            description="Finally met the creator whose work inspired me. From screens to real life surreal"
            className="flex h-full items-center justify-center"
          >
            <IconDrawSvg />
          </BentoCard>
          <BentoCard
            title="Interactive SVG Editing"
            description="Drag points, reshape paths, and customize vectors directly in the browser."
            className="h-full"
          >
            <RocketInteractive />
          </BentoCard>
        </div>

        <BentoCard
          title=""
          description=""
          className="h-full min-h-0 lg:col-span-3"
        >
          <BentoCenterSvg />
        </BentoCard>

        <div className="grid min-h-0 grid-cols-1 gap-2 md:gap-4 lg:col-span-5 lg:grid-rows-[4fr_6fr]">
          <BentoCard title="" description="" className="h-full">
            <IconCarousel />
          </BentoCard>
          <BentoCard
            // title="Over 1000+ Icons Crafted For your website"
            // description="Designed a library of 1000+ scalable, performance-optimized SVG icons with a consistent visual system for seamless use in modern web apps."
            title=""
            description=""
            className="h-full"
            fullBackgroundGraphic
          >
            <BentoSvg />
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default Bento;
