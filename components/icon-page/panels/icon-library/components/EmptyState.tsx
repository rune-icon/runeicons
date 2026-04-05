import { motion, AnimatePresence } from "motion/react";

interface EmptyStateProps {
  isVisible: boolean;
  onClearSearch?: () => void;
}

export function EmptyState({ isVisible, onClearSearch }: EmptyStateProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="col-span-4 text-center py-12"
          role="status"
          aria-live="polite"
        >
          <p className="text-foreground font-medium text-sm">No icons found</p>
          <p className="text-muted-foreground text-xs mt-1">
            Try adjusting your search
          </p>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="mt-3 text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              Clear search
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
