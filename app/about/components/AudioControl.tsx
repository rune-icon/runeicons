import * as m from "motion/react-m";

interface AudioControlProps {
  isMuted: boolean;
  onToggle: () => void;
}

const AudioControl = ({ isMuted, onToggle }: AudioControlProps) => {
  return (
    <m.button
      data-detail-keep
      onClick={onToggle}
      aria-label={isMuted ? "Unmute" : "Mute"}
      className="group absolute top-8 left-20 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full text-[#595959] transition-colors hover:text-white"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15 }}
    >
      <span className="relative font-mono text-base font-semibold leading-none select-none">
        M
        {isMuted && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-[-2px] h-[1.5px] w-[calc(100%+4px)] origin-center bg-current"
            style={{ transform: "translateY(-50%) rotate(-18deg)" }}
          />
        )}
      </span>
    </m.button>
  );
};

export default AudioControl;
