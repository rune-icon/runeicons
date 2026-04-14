import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

interface AudioControlProps {
  isMuted: boolean;
  onToggle: () => void;
}

const AudioControl = ({ isMuted, onToggle }: AudioControlProps) => {
  const pathVariants = {
    initial: { stroke: "#595959" },
    hover: { stroke: "#FFFFFF", transition: { duration: 0.3 } },
  };

  return (
    <m.button
      onClick={onToggle}
      className="absolute top-8 left-8 z-50 p-2 rounded-full cursor-pointer group"
      whileHover="hover"
      initial="initial"
    >
      <div className="relative size-7 flex items-center justify-center">
        {/* Base Speaker Path (Common) */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <m.path
            d="M13 7L8 11H4V17H8L13 21V7Z"
            variants={pathVariants}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <AnimatePresence mode="wait">
          {!isMuted ? (
            <m.svg
              key="speaker-on"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <g>
                <m.path
                  d="M21.07 7C22.9447 8.87528 23.9979 11.4184 23.9979 14.07C23.9979 16.7216 22.9447 19.2647 21.07 21.14"
                  variants={pathVariants}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <m.path
                  d="M17.54 10.53C18.4773 11.4676 19.0039 12.7392 19.0039 14.065C19.0039 15.3908 18.4773 16.6624 17.54 17.6"
                  variants={pathVariants}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </m.svg>
          ) : (
            <m.svg
              key="speaker-off"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <g>
                <m.path
                  d="M25 11L19 17"
                  variants={pathVariants}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <m.path
                  d="M19 11L25 17"
                  variants={pathVariants}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </m.svg>
          )}
        </AnimatePresence>
      </div>
    </m.button>
  );
};

export default AudioControl;
