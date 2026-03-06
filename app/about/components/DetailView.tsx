"use client";
import {
  ChevronLeft,
  ChevronRight,
  Disc as Discord,
  Globe,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import XIcon from "./icons/XIcon";

interface DetailViewProps {
  user: {
    id: number;
    name: string;
    img: string;
    description?: string;
    industry?: string;
    status?: string;
    socials?: { type: string; url: string }[];
  };
  prevUser?: {
    id: number;
    name: string;
    img: string;
  };
  nextUser?: {
    id: number;
    name: string;
    img: string;
  };
  direction: 1 | -1;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const DetailView = ({
  user,
  prevUser,
  nextUser,

  onClose,
  onNext,
  onPrev,
}: DetailViewProps) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Container - Full viewport */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
        <div className="pointer-events-auto relative flex h-full w-full gap-0">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 z-50 cursor-pointer rounded-full border border-white/5 bg-white/5 p-3 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={24} />
          </button>

          {/* Left Panel - Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="group relative z-20 flex h-full w-[70%] items-center justify-center overflow-hidden bg-[#0A0A0A]/90 backdrop-blur-xl"
            onClick={onClose}
            style={{ borderRadius: 0 } as any}
            transition={{
              duration: 0.4,
            }}
          >
            {/* Noise Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-white opacity-[0.02]" />

            {/* Carousel Container */}
            <div className="perspective-1000 relative flex h-[500px] w-full items-center justify-center">
              {/* Prev User (Left) */}
              {prevUser && (
                <motion.div
                  key={prevUser.id}
                  layoutId={`avatar-${prevUser.id}`}
                  className="absolute z-10 cursor-pointer opacity-40 blur-[1px] grayscale transition-all hover:opacity-80 hover:grayscale-0"
                  initial={false}
                  animate={{ x: -350, scale: 0.7, opacity: 0.4 }}
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    scale: { duration: 0.4, delay: 0.1 }, // Staggered scale
                    opacity: { duration: 0.4 },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                >
                  <div className="flex size-56 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {prevUser.img ? (
                      <img
                        src={prevUser.img}
                        alt={prevUser.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl select-none">👻</span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Next User (Right) */}
              {nextUser && (
                <motion.div
                  key={nextUser.id}
                  layoutId={`avatar-${nextUser.id}`}
                  className="absolute z-10 cursor-pointer opacity-40 blur-[1px] grayscale transition-all hover:opacity-80 hover:grayscale-0"
                  initial={false}
                  animate={{ x: 350, scale: 0.7, opacity: 0.4 }}
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    scale: { duration: 0.4, delay: 0.1 }, // Staggered scale
                    opacity: { duration: 0.4 },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                >
                  <div className="flex size-56 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {nextUser.img ? (
                      <img
                        src={nextUser.img}
                        alt={nextUser.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl select-none">👻</span>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.div
                key={user.id}
                layoutId={`card-${user.id}`}
                className="absolute z-20"
                layout
                initial={false}
                animate={{ x: 0, scale: 1.2, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  layout: { duration: 0.4 },
                }}
              >
                {/* Glow */}
                <div className="bg-primary/20 absolute inset-0 rounded-full blur-3xl" />
                <div className="relative flex size-64 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-linear-to-tr from-cyan-400/20 to-blue-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                  {user.img ? (
                    <img
                      src={user.img}
                      alt={user.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-7xl select-none">👻</span>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Navigation Buttons - Centered Bottom of Left Panel */}
            <motion.div
              className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#0A0A0A]/80 px-2 py-2 backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onPrev}
                className="group cursor-pointer rounded-full p-3 text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              >
                <ChevronLeft
                  size={20}
                  // className="group-hover:text-white text-white/70"
                />
              </button>
              <div className="h-6 w-px bg-white/10" />
              <button
                onClick={onNext}
                className="cursor-pointer rounded-full p-3 text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Panel - Details */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{
              type: "tween",
              ease: "easeInOut",
              duration: 0.5,
              delay: 0.2, // increased delay slightly to let card expand first
            }}
            className="relative flex h-full w-[30%] flex-col justify-center border-l border-white/10 bg-[#0A0A0A]/95 p-12 backdrop-blur-xl"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`info-${user.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="mb-6 font-['Syne'] text-4xl font-bold text-white">
                  {user.name}
                </h2>

                <p className="mb-8 font-['Outfit'] text-base leading-relaxed text-[#888888]">
                  {user.description}
                </p>

                {/* Metadata Grid */}
                <div className="mb-10 grid grid-cols-1 gap-y-6 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium tracking-wider text-[#444444] uppercase">
                      Industry
                    </span>
                    <span className="text-[#EEEEEE]">{user.industry}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium tracking-wider text-[#444444] uppercase">
                      Status
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${user.status === "Active" ? "bg-[#D4FF00]" : "bg-gray-500"}`}
                      ></span>
                      <span className="text-[#EEEEEE]">{user.status}</span>
                    </div>
                  </div>
                </div>

                {/* Socials */}
                <div className="mb-20 flex items-center gap-4">
                  {user.socials?.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/5 bg-white/5 p-3 text-[#888888] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      {social.type === "globe" && <Globe size={20} />}
                      {/* {social.type === "twitter" && <XIcon size={20} />} */}
                      {social.type === "twitter" && <XIcon size={20} />}
                      {social.type === "discord" && <Discord size={20} />}
                    </a>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DetailView;
