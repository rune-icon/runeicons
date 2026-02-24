"use client";
import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, useAnimation } from "motion/react";

interface CardProps {
  user: {
    id: number;
    name: string;
    description?: string;
    industry?: string;
    status?: string;
    socials?: { type: string; url: string }[];
    img: string;
  };
  onClick: () => void;
  onPlayAudio: (sound: string) => void;
}

const Card = ({ user, onClick, onPlayAudio }: CardProps) => {
  const isDragging = useRef(false);
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  // Levitating Effect
  const startLevitating = async () => {
    const randomDuration = Math.random() * 2 + 3; // 3 to 5 seconds
    const randomDelay = Math.random() * 2; // 0 to 2s using delay
    const randomY = Math.random() * 5 + 10; // 10 to 15px move

    await controls.start({
      y: [0, -randomY, 0],
      rotate: 0, // Enforce no rotation
      transition: {
        y: {
          repeat: Infinity,
          duration: randomDuration,
          ease: "easeInOut",
          delay: randomDelay,
        },
        rotate: { duration: 0 }, // Instant reset if any
      },
    });
  };

  useEffect(() => {
    startLevitating();
  }, []);

  return (
    <motion.div
      layoutId={`card-${user.id}`}
      className="relative flex size-32 cursor-pointer items-center justify-center rounded-md border bg-[#0A0A0A] md:size-32 lg:size-48"
      drag
      dragMomentum={false}
      dragElastic={0.35}
      animate={controls}
      initial={{ y: 0, rotate: 0 }}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        if (!isDragging.current) {
          onClick();
        }
      }}
      variants={{
        initial: {
          scale: 1,
          zIndex: 0,
          borderColor: "rgba(255, 255, 255, 0.1)",
          backgroundColor: "rgba(10, 10, 10, 1)",
          rotate: 0, // Ensure no rotation in variants
        },
        hover: {
          scale: 1.2,
          zIndex: 50,
          borderColor: "#1346E7",
          backgroundColor: "rgba(10, 10, 10, 1)",
          transition: { duration: 0.2, ease: "easeOut" },
          cursor: "pointer",
          rotate: 0, // Ensure no rotation on hover
          // opacity: 1,
        },
      }}
      onDragStart={() => {
        setIsHovered(false); // Hide tooltip on drag
        isDragging.current = true;
        controls.stop(); // Stop levitation when dragging starts
        controls.start({
          cursor: "grabbing",
          rotate: 0,
        });
        onPlayAudio("tap");
      }}
      onDragEnd={async () => {
        onPlayAudio("release");
        setTimeout(() => {
          isDragging.current = false;
        }, 150);

        // Reset to center first
        await controls.start({
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          zIndex: 0,
          transition: { type: "spring", stiffness: 600, damping: 20 },
          cursor: "pointer",
        });

        // Resume levitation
        startLevitating();
      }}
    >
      <img
        src={user.img}
        alt={user.name}
        className="opacity-100` pointer-events-none absolute inset-0 size-full rounded-md object-cover transition-all duration-300"
      />

      {/* Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-white opacity-[0.03]" />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="tooltip"
            className="pointer-events-none absolute -top-12 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-black/90 px-3 py-1.5 whitespace-nowrap"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h1 className="font-sans text-sm font-medium text-white/90 select-none">
              {user.name}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Card;
