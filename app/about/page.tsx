"use client";
import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import AudioControl from "./components/AudioControl";
import Card from "./components/Card";
import DetailView from "./components/DetailView";
import UserDetails from "./constants";

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isMuted, setIsMuted] = useState(false); // Not muted as default!

  // Audio Playback Utility
  const playAudio = (soundName: string) => {
    if (!isMuted) {
      const audio = new Audio(`/about/${soundName}.wav`);
      audio.volume = 1;
      audio.play().catch((e) => console.error("Audio playback failed:", e));
    }
  };

  const selectedUser = UserDetails.find((user) => user.id === selectedId);
  const currentIndex = selectedId
    ? UserDetails.findIndex((user) => user.id === selectedId)
    : -1;
  const prevUser =
    currentIndex >= 0
      ? UserDetails[
          (currentIndex - 1 + UserDetails.length) % UserDetails.length
        ]
      : undefined;
  const nextUser =
    currentIndex >= 0
      ? UserDetails[(currentIndex + 1) % UserDetails.length]
      : undefined;

  return (
    <motion.section className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050505] text-[#EEEEEE]">
      <AudioControl isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />
      <div className="perspective-1000 grid h-[50%] w-[80%] max-w-4xl grid-cols-2 items-center justify-center gap-x-3 gap-y-8 md:h-[80%] md:grid-cols-3 md:gap-0 md:gap-y-0 lg:grid-cols-5">
        {UserDetails.map((user) => (
          <Card
            key={user.id}
            user={user}
            onClick={() => {
              setSelectedId(user.id);
              playAudio("open");
            }}
            onPlayAudio={playAudio}
          />
        ))}
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2">
        <h1 className="font-sans text-2xl font-bold tracking-wider text-white md:text-4xl">
          RUNE ICON
        </h1>
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <a
            href="https://x.com/RuneIcon"
            target="_blank"
            className="text-sm font-semibold text-[#595959]"
          >
            X
          </a>
        </div>
      </div>

      <AnimatePresence>
        {selectedId && selectedUser && (
          <DetailView
            user={selectedUser}
            prevUser={prevUser}
            nextUser={nextUser}
            direction={direction}
            onClose={() => {
              setSelectedId(null);
              playAudio("close");
            }}
            onNext={() => {
              const currentIndex = UserDetails.findIndex(
                (u) => u.id === selectedId
              );
              const nextIndex = (currentIndex + 1) % UserDetails.length;
              setDirection(1);
              setSelectedId(UserDetails[nextIndex].id);
              playAudio("forward");
            }}
            onPrev={() => {
              const currentIndex = UserDetails.findIndex(
                (u) => u.id === selectedId
              );
              const prevIndex =
                (currentIndex - 1 + UserDetails.length) % UserDetails.length;
              setDirection(-1);
              setSelectedId(UserDetails[prevIndex].id);
              playAudio("back");
            }}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default App;
