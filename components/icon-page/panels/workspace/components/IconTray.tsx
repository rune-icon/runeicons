import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { IconData, CustomizationState } from "@/lib/types";

interface IconTrayProps {
  trayIcons: IconData[];
  onSelectIcon: (icon: IconData) => void;
  onRemoveFromTray: (iconName: string) => void;
  state: CustomizationState;
}

export function IconTray({
  trayIcons,
  onSelectIcon,
  onRemoveFromTray,
  state,
}: IconTrayProps) {
  return (
    <div className="h-20 border-t border-border/10 bg-muted/5 flex items-center justify-center">
      <div className="flex gap-4 p-2 overflow-x-auto no-scrollbar scroll-smooth items-center">
        <AnimatePresence mode="popLayout">
          {trayIcons.map((trayIcon, idx) => (
            <motion.div
              key={trayIcon.id}
              layout
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: idx * 0.05,
              }}
              className="relative group shrink-0"
            >
              <div
                className="w-12 h-12 rounded-lg border border-border/10 flex items-center justify-center p-2 relative shadow-md transition-all hover:scale-110 active:scale-95 overflow-hidden cursor-pointer bg-muted/20"
                onClick={() => onSelectIcon(trayIcon)}
                style={{
                  borderRadius: `${state.cornerRadius / 4}px`,
                }}
              >
                <trayIcon.icon
                  className="w-full h-full transition-all drop-shadow-sm"
                  strokeWidth={2}
                  style={{
                    padding: "4px",
                    stroke: state.iconGradient
                      ? `url(#icon-gradient)`
                      : state.colors[0] || "currentColor",
                    filter: state.shadow.inner ? "url(#inner-shadow)" : "none",
                    transform: `rotate(${state.rotation}deg) ${state.flipH ? "scaleX(-1)" : ""} ${state.flipV ? "scaleY(-1)" : ""}`,
                  }}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromTray(trayIcon.name);
                }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 z-40"
                aria-label={`Remove ${trayIcon.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {trayIcons.length < 5 && (
          <div className="w-12 h-12 rounded-lg border-2 border-dashed border-border/20 flex flex-col items-center justify-center text-muted-foreground/30 hover:text-muted-foreground/60 hover:border-border/40 transition-all cursor-pointer shrink-0 bg-background/20 group">
            <Plus className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              Add
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
