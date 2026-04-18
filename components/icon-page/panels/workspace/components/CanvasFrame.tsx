import React, { ReactNode } from "react";
import { WorkspaceGround } from "./WorkspaceGround";
import { motion, AnimatePresence } from "motion/react";

interface CanvasFrameProps {
  children: ReactNode;
  trayNode: ReactNode;
  showGrid: boolean;
}

export function CanvasFrame({ children, trayNode, showGrid }: CanvasFrameProps) {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
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

      <div className="flex-1 flex items-center justify-center cursor-default relative z-10">
        <div className="w-full aspect-[11/8] flex flex-col relative bg-transparent shadow-none">
          {children}
          {trayNode}
        </div>
      </div>
    </div>
  );
}
