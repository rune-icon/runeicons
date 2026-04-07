import { ReactNode } from "react";
import { WorkspaceGround } from "./WorkspaceGround";

interface CanvasFrameProps {
  children: ReactNode;
  trayNode: ReactNode;
}

export function CanvasFrame({ children, trayNode }: CanvasFrameProps) {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <WorkspaceGround />

      <div className="flex-1 flex items-center justify-center cursor-default relative z-0">
        <div className="w-full aspect-[11/8] flex flex-col relative bg-transparent shadow-none">
          {children}
          {trayNode}
        </div>
      </div>
    </div>
  );
}
