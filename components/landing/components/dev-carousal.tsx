"use client";

import { useEffect, useState } from "react";

import Autoplay from "embla-carousel-autoplay";
import {
  ChevronLeft,
  ChevronRight,
  Github,
  Instagram,
} from "lucide-react";
import { AnimatePresence, m } from "motion/react";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const DevCarousal = () => {
  const images = [
    {
      src: "https://avatars.githubusercontent.com/u/189650812?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Vansh",
    },
    {
      src: "https://avatars.githubusercontent.com/u/100619913?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Nexvyn",
    },
    {
      src: "https://avatars.githubusercontent.com/u/72981345?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Mohit",
    },
    {
      src: "https://avatars.githubusercontent.com/u/106543236?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Pranav",
    },
    {
      src: "https://avatars.githubusercontent.com/u/133649888?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Abhinav",
    },
    {
      src: "https://avatars.githubusercontent.com/u/189650812?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Vansh",
    },
    {
      src: "https://avatars.githubusercontent.com/u/100619913?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Nexvyn",
    },
    {
      src: "https://avatars.githubusercontent.com/u/72981345?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Mohit",
    },
    {
      src: "https://avatars.githubusercontent.com/u/106543236?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Pranav",
    },
    {
      src: "https://avatars.githubusercontent.com/u/133649888?v=4",
      alt: "Illustrations by ©AarzooAly",
      title: "Abhinav",
    },
  ];
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Carousel_006
        images={images}
        className=""
        loop={true}
        showNavigation={true}
        showPagination={true}
        autoplay={true}
      />
    </div>
  );
};

interface Carousel_006Props {
  images: { src: string; alt: string; title: string }[];
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
}

const Carousel_006 = ({
  images,
  className,
  autoplay = false,
  loop = true,
  showNavigation = true,
  showPagination = true,
}: Carousel_006Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      className={cn("w-full", className)}
      opts={{
        loop,
        slidesToScroll: 1,
      }}
      plugins={
        autoplay
          ? [
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]
          : []
      }
    >
      <CarouselContent className="flex w-full">
        {images.map((img, index) => (
          <CarouselItem
            key={index}
            className="relative flex h-full w-full basis-[73%] items-center justify-center sm:basis-[50%] md:basis-[30%] lg:basis-[25%] xl:basis-[21%]"
          >
            <AnimatePresence>
              <m.div
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  clipPath:
                    current !== index
                      ? "inset(15% 0 15% 0 round 1rem)"
                      : "inset( 0 0 0 0 round 1rem)",
                }}
                className="ml-5 h-40 w-40 rounded-xl"
              >
                <div className="relative h-full w-full">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full scale-110 object-cover"
                  />
                </div>
              </m.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {current === index && (
                <m.div
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-0 left-2 flex w-full translate-y-full items-center justify-center p-2 text-center font-medium tracking-tight"
                >
                  {img.title}
                </m.div>
              )}
            </AnimatePresence>
          </CarouselItem>
        ))}
      </CarouselContent>

      {showNavigation && (
        <div className="absolute right-0 -bottom-4 flex w-full items-center justify-between gap-2 px-4">
          <button
            aria-label="Previous slide"
            onClick={() => api?.scrollPrev()}
            className="rounded-full bg-black/10 p-2"
          >
            <ChevronLeft className="text-white" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => api?.scrollNext()}
            className="rounded-full bg-black/10 p-2"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      )}

      {showPagination && (
        <div className="mt-5 flex w-full flex-col items-center justify-center">
          <div className="flex min-h-7 items-center justify-center gap-2">
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={images[current]?.title ?? current}
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="px-2 text-sm font-medium"
              >
                {images[current]?.title}
              </m.span>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={images[current]?.title ?? current}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-2 flex gap-2"
            >
              <Button variant={"outline"} size={"icon"}>
                <Github size={2} />
              </Button>
              <Button variant={"outline"} size={"icon"}>
                <Instagram size={2} />
              </Button>
              <Button variant={"outline"} size={"icon"}>
                <svg
                  className="invert dark:invert-0"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  color="currentColor"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516" />
                </svg>{" "}
              </Button>
            </m.div>
          </AnimatePresence>
        </div>
      )}
      {/* 
      {showPagination && (
        <div className="mt-4 flex w-full items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: images.length }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2 w-2 cursor-pointer rounded-full transition-all",
                  current === index ? "bg-black" : "bg-[#D9D9D9]",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )} */}
    </Carousel>
  );
};

export { DevCarousal };
