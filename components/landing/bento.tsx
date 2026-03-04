import React from "react";
import IconCarousel from "./icon-carousel";
import BentoSvg from "./bento-svg";
import IconDrawSvg from "./svg/bento-draw-svg";
import BentoCenterSvg from "./svg/bento-center-svg";
import RocketInteractive from "./svg/rocket-interactive";


interface BentoCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  graphicClassName?: string;
}

const BentoCard = ({
  title,
  description,
  children,
  className,
  graphicClassName,
}: BentoCardProps) => {
  return (
    <div className={`rounded-2xl md:rounded-3xl border border-border bg-card text-card-foreground flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg min-h-0 ${className}`}>
      <div className={`flex-1 min-h-0 flex justify-center items-center p-3 md:p-6 overflow-hidden ${graphicClassName}`}>
        {children}
      </div>
      {(title || description) && (
        <div className="p-4 md:p-8 pt-0 mt-auto shrink-0">
          <h3 className="text-sm md:text-md font-semibold mb-1">
            {title}
          </h3>
          <p className="text-sm md:text-md text-muted-foreground">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

const Bento = () => {
  return (
    <section className="w-full my-12">
      <div className="mx-auto grid w-full min-h-[50vh] lg:h-[90vh] grid-cols-1 gap-2 md:gap-4 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-2 md:gap-4 lg:col-span-4 lg:grid-rows-[6fr_4fr] min-h-0">
          <BentoCard
            title="Met the Mind Behind the Magic"
            description="Finally met the creator whose work inspired me. From screens to real life surreal"
            className="h-full flex justify-center items-center"
          >
            <IconDrawSvg/>
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
          className="lg:col-span-3 h-full min-h-0"
        >
          <BentoCenterSvg/></BentoCard>

        <div className="grid grid-cols-1 gap-2 md:gap-4 lg:col-span-5 lg:grid-rows-[4fr_6fr] min-h-0">
          <BentoCard
            title=""
            description=""
            className="h-full"
          >
            <IconCarousel /> 
          </BentoCard>
          <BentoCard
            title="Over 1000+ Icons Crafted For your website"
            description="Designed a library of 1000+ scalable, performance-optimized SVG icons with a consistent visual system for seamless use in modern web apps."
            className="h-full"
          >
            <BentoSvg className="w-full h-auto max-w-[300px]" />
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default Bento;

