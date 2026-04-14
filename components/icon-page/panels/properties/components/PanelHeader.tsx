"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTuning } from "@/components/icon-page/tuning";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PanelHeaderProps {
  onExport: () => void;
  onReset: () => void;
}

export function PanelHeader({ onExport, onReset }: PanelHeaderProps) {
  const { getSpring } = useTuning();
  const [isResetArmed, setIsResetArmed] = useState(false);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const disarmReset = useCallback(() => {
    setIsResetArmed(false);
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
  }, []);

  const armReset = useCallback(() => {
    setIsResetArmed(true);
    resetTimeoutRef.current = setTimeout(() => {
      setIsResetArmed(false);
    }, 2000);
  }, []);

  const handleResetClick = useCallback(() => {
    if (isResetArmed) {
      disarmReset();
      onReset();
      toast.success("Customizations reset");
    } else {
      armReset();
    }
  }, [isResetArmed, disarmReset, armReset, onReset]);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">Customize</h2>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onExport}
          className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors duration-150 ease-out active:scale-[0.97]"
          aria-label="Export customization settings"
          title="Export settings"
        >
          <Download className="h-4 w-4" />
        </Button>
        <motion.div
          animate={isResetArmed ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={isResetArmed ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" } : { duration: 0.15 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetClick}
            className={cn(
              "h-8 w-8 transition-all duration-150 ease-out active:scale-[0.97] relative overflow-hidden",
              isResetArmed
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
            aria-label={isResetArmed ? "Click again to confirm reset" : "Reset all customizations"}
            title={isResetArmed ? "Click again to confirm" : "Reset all"}
          >
            <AnimatePresence mode="wait">
              {isResetArmed ? (
                <motion.div
                  key="alert"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={getSpring({ stiffness: 500, damping: 25 })}
                >
                  <AlertTriangle className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="rotate"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={getSpring({ stiffness: 400, damping: 25 })}
                >
                  <RotateCcw className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
