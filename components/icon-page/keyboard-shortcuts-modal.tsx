"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Command, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTuning } from "./tuning";
import { KEYBOARD_SHORTCUTS } from "@/hooks/use-keyboard-shortcuts";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ShortcutKey({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 text-xs font-medium",
        "rounded border border-border bg-muted text-foreground",
        "shadow-[0_1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_rgba(255,255,255,0.1)]",
        "min-w-[24px] h-6",
        className
      )}
    >
      {children}
    </kbd>
  );
}

function ShortcutRow({ shortcut }: { shortcut: { key: string; desc: string } }) {
  const { getSpring } = useTuning();

  // Split key combination for display
  const keys = shortcut.key.split(/\s+/).flatMap((k: string, i: number, arr: string[]) => {
    const parts: React.ReactNode[] = [];
    parts.push(<ShortcutKey key={k}>{k}</ShortcutKey>);
    if (i < arr.length - 1) {
      parts.push(<span key={`sep-${i}`} className="text-muted-foreground mx-1">/</span>);
    }
    return parts;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <span className="text-sm text-foreground">{shortcut.desc}</span>
      <div className="flex items-center gap-1">{keys}</div>
    </motion.div>
  );
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const { getSpring } = useTuning();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={getSpring({ stiffness: 400, damping: 30 })}
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
              "w-full max-w-md max-h-[80vh] overflow-y-auto",
              "bg-background border border-border rounded-2xl shadow-2xl",
              "p-6"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Command className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Press <ShortcutKey className="inline">?</ShortcutKey> anytime to show this
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-lg hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Shortcuts List */}
            <div className="space-y-6">
              {KEYBOARD_SHORTCUTS.map((category, categoryIndex) => (
                <div key={category.category}>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-3">
                    {category.category}
                  </h3>
                  <div className="space-y-1">
                    <AnimatePresence>
                      {category.items.map((item: { key: string; desc: string }, itemIndex: number) => (
                        <motion.div
                          key={`${category.category}-${item.key}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{
                            delay: (categoryIndex * 0.05) + (itemIndex * 0.03),
                            duration: 0.2,
                          }}
                        >
                          <ShortcutRow shortcut={item} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>Press</span>
                <ShortcutKey className="inline">Esc</ShortcutKey>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
