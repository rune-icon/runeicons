"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, RotateCcw, FileDown, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTuning } from "@/components/icon-page/tuning";
import { toast } from "sonner";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PanelHeaderProps {
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
}

export function PanelHeader({ onExport, onImport, onReset }: PanelHeaderProps) {
  useTuning();
  const [isResetArmed, setIsResetArmed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const disarmReset = useCallback(() => {
    setIsResetArmed(false);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    resetTimeoutRef.current = null;
    countdownIntervalRef.current = null;
  }, []);

  const armReset = useCallback(() => {
    setIsResetArmed(true);
    setCountdown(5);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          disarmReset();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    resetTimeoutRef.current = setTimeout(() => {
      disarmReset();
    }, 5000);
  }, [disarmReset]);

  const handleResetClick = useCallback(() => {
    if (isResetArmed) {
      disarmReset();
      onReset();
      toast.success("Settings restored to default");
    } else {
      armReset();
    }
  }, [isResetArmed, disarmReset, armReset, onReset]);

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between h-10">
        <h2 className="text-lg font-bold text-foreground tracking-tight">Customize</h2>
        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="wait">
            {isResetArmed ? (
              <motion.div
                key="confirm-reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-muted p-1 pr-1.5 rounded-md border border-border shadow-sm"
              >
                <span className="text-[10px] font-bold tracking-tight text-muted-foreground ml-2">
                  RESET {countdown}S?
                </span>
                <div className="flex gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleResetClick}
                        className="h-7 w-7 rounded-sm bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={8}>Confirm Reset</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={disarmReset}
                        className="h-7 w-7 rounded-sm hover:bg-muted-foreground/10"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={8}>Cancel</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-1.5"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onImport}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-150 active:scale-95"
                    >
                      <FileUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>Import Settings</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onExport}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-150 active:scale-95"
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>Export Settings</TooltipContent>
                </Tooltip>

                <div className="w-[1px] h-4 bg-border mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleResetClick}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-150 active:scale-95"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8}>Reset Customizations</TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
}
