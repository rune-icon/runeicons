import { Ruler } from "./Ruler";
import { ReactNode } from "react";

interface CanvasFrameProps {
  children: ReactNode;
  trayNode: ReactNode;
}

export function CanvasFrame({ children, trayNode }: CanvasFrameProps) {
  return (
    <div className="flex-1 flex flex-col bg-muted/30 relative">
      {/* Top-Left Corner Box */}
      <div className="absolute top-0 left-0 w-8 h-8 z-20 border-b border-r border-border bg-background/50 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-muted-foreground/50 select-none">
        0
      </div>

      {/* Top-Right Corner Box */}
      <div className="absolute top-0 right-0 w-8 h-8 z-20 border-b border-l border-border bg-background/50 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-muted-foreground/50 select-none">
        0
      </div>

      {/* Top Ruler */}
      <div className="absolute top-0 left-8 right-8 h-8 z-10 border-b border-border bg-background/30 backdrop-blur-sm">
        <Ruler side="top" length={1200} cycle={700} />
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Ruler */}
        <div className="absolute top-8 left-0 bottom-8 w-8 z-10 border-r border-border bg-background/30 backdrop-blur-sm">
          <Ruler side="left" length={1000} cycle={600} />
        </div>

        {/* Right Ruler */}
        <div className="absolute top-8 right-0 bottom-8 w-8 z-10 border-l border-border bg-background/30 backdrop-blur-sm">
          <Ruler side="right" length={1000} cycle={600} />
        </div>

        <div className="flex-1 flex items-center justify-center p-12 cursor-default relative">
          <div className="w-full max-w-3xl aspect-[4/3] flex flex-col relative bg-background border border-border shadow-sm rounded-sm overflow-hidden">
            {children}
            {trayNode}
          </div>
        </div>

        {/* Bottom-Left Corner Box */}
        <div className="absolute bottom-0 left-0 w-8 h-8 z-20 border-t border-r border-border bg-background/50 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-muted-foreground/50 select-none">
          0
        </div>

        {/* Bottom-Right Corner Box */}
        <div className="absolute bottom-0 right-0 w-8 h-8 z-20 border-t border-l border-border bg-background/50 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-muted-foreground/50 select-none">
          0
        </div>

        {/* Bottom Ruler */}
        <div className="absolute bottom-0 left-8 right-8 h-8 z-10 border-t border-border bg-background/30 backdrop-blur-sm">
          <Ruler side="bottom" length={1200} cycle={700} />
        </div>
      </div>
    </div>
  );
}
