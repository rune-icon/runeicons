import { motion, AnimatePresence } from "framer-motion";
import { IconData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IconGridProps {
  icons: IconData[];
  selectedIconId: string | null;
  onIconClick: (icon: IconData) => void;
}

export function IconGrid({
  icons,
  selectedIconId,
  onIconClick,
}: IconGridProps) {
  return (
    <motion.div layout className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 border-b border-border">
      <AnimatePresence mode="popLayout">
        {icons.map((icon, index) => {
          const Icon = icon.icon;
          const isSelected = selectedIconId === icon.id;

          return (
            <motion.div
              key={icon.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.2 },
                delay: index * 0.005,
              }}
              className="w-full"
            >
              <button
                onClick={() => onIconClick(icon)}
                className={cn(
                  "group relative aspect-square cursor-pointer overflow-hidden transition-all duration-200 w-full border-r border-b border-border flex items-center justify-center",
                  isSelected ? "bg-accent" : "bg-transparent hover:bg-muted",
                )}
                type="button"
                aria-label={`${icon.name} icon`}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                    isSelected
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
