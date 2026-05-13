import React, { ReactNode } from "react";

import { AnimatePresence, motion } from "motion/react";

import { WorkspaceGround } from "./WorkspaceGround";

interface CanvasFrameProps {
  children: ReactNode;
  trayNode: ReactNode;
  showGrid: boolean;
}

export function CanvasFrame({ children, trayNode, showGrid }: CanvasFrameProps) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <AnimatePresence>
        {showGrid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-0"
          >
            <WorkspaceGround />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative z-10 flex flex-1 -translate-y-10 cursor-default items-center justify-center">
        <div className="relative flex aspect-[11/8] w-full flex-col bg-transparent shadow-none">
          {children}
          {trayNode}
        </div>
      </div>
    </div>
  );
}
