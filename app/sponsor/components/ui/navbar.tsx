import { Heart, Moon, Star } from "lucide-react";

export function Navbar() {
  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-start justify-between px-4 py-4 sm:items-center sm:px-6">
      <div className="mt-1 flex items-center gap-3 sm:mt-0">
        <div className="h-6 w-6 shrink-0">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 20 120 L 100 40 L 180 120 L 180 190 L 20 190 Z"
              fill="#F0562E"
            />
            <circle cx="75" cy="135" r="14" fill="white" />
            <circle cx="75" cy="135" r="5" fill="black" />
            <circle cx="125" cy="135" r="14" fill="white" />
            <circle cx="125" cy="135" r="5" fill="black" />
            <rect x="60" y="190" width="15" height="10" fill="#F0562E" />
            <rect x="125" y="190" width="15" height="10" fill="#F0562E" />
          </svg>
        </div>
        <span className="font-mono text-[15px] tracking-tight">rune-icons</span>
      </div>

      <div className="flex flex-col items-end gap-3 sm:flex-row-reverse sm:items-center sm:gap-6">
        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-[#F0562E] bg-transparent text-zinc-300 transition-colors hover:text-white">
            <Moon className="h-4 w-4" />
          </button>

          <a
            href="https://github.com/rune-icon/runeicons"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 items-center gap-2 rounded-md bg-[#27272a] px-3 font-mono text-[13px] text-zinc-200 transition-colors hover:bg-[#3f3f46]"
          >
            <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
            7,075
            <Star className="h-4 w-4 fill-zinc-400 text-zinc-400" />
          </a>
        </div>

        <button className="flex items-center gap-2 text-[13px] text-zinc-400 transition-colors hover:text-white sm:text-zinc-200">
          <Heart className="h-4 w-4 fill-[#F0562E] text-[#F0562E]" />
          Sponsor Project
        </button>
      </div>
    </header>
  );
}
