"use client";

import { useState, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import {
  ChevronDown,
  AlertCircle,
  Loader2,
  Upload,
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CustomizationState } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";
import { useTuning } from "@/components/icon-page/tuning";

interface UploadSectionProps {
  state: CustomizationState;
  isCollapsed?: boolean;
  onToggle?: () => void;
  isDragging: boolean;
  uploadError: string | null;
  setUploadError: (error: string | null) => void;
  isUploading: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => Promise<void>;
  deleteIcon: (id: string) => void;
  maxIcons: number;
}

export function UploadSection({
  state,
  isDragging,
  uploadError,
  setUploadError,
  isUploading,
  handleFileUpload,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  deleteIcon,
  maxIcons,
}: UploadSectionProps) {
  useTuning();
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const disarmDelete = useCallback(() => {
    setArmedDeleteId(null);
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
    }
  }, []);

  const armDelete = useCallback((id: string) => {
    setArmedDeleteId(id);
    deleteTimeoutRef.current = setTimeout(() => {
      setArmedDeleteId(null);
    }, 2000);
  }, []);

  const handleDeleteClick = useCallback((id: string, name: string) => {
    if (armedDeleteId === id) {
      disarmDelete();
      deleteIcon(id);
    } else {
      armDelete(id);
    }
  }, [armedDeleteId, disarmDelete, armDelete, deleteIcon]);

  return (
    <div className="pt-2 px-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider opacity-70">
          Upload & Custom Icons
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
          {state.customIcons.length}/{maxIcons}
        </span>
      </div>

      <div id="section-upload-content" className="space-y-4">
        {uploadError && (
          <div
            className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive leading-relaxed">{uploadError}</p>
            <button
              onClick={() => setUploadError(null)}
              className="ml-auto text-destructive hover:text-destructive/80"
              aria-label="Dismiss error"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200",
            isDragging ? "border-primary bg-primary/5 scale-[0.99] shadow-inner" : "border-border hover:border-border/80",
            isUploading && "opacity-50 pointer-events-none",
          )}
          role="region"
          aria-label="File upload area"
        >
          {isUploading ? (
            <div className="py-2">
              <Loader2
                className="h-8 w-8 mx-auto mb-3 text-primary animate-spin"
                aria-hidden="true"
              />
              <p className="text-xs font-bold text-primary tracking-tight">UPLOADING...</p>
            </div>
          ) : (
            <>
              <Upload
                className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-foreground mb-1">
                Drag & drop files here
              </p>
              <p className="text-[10px] font-bold text-muted-foreground/60 mb-4 px-6">
                SVG or PNG (MAX 5MB)
              </p>
              <label>
                <input
                  type="file"
                  accept="image/svg+xml,image/png"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload custom icon files"
                  disabled={state.customIcons.length >= maxIcons}
                />
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 px-4 font-bold border-border hover:bg-muted/50 transition-colors"
                  disabled={state.customIcons.length >= maxIcons}
                >
                  <span>Upload Icon</span>
                </Button>
              </label>
            </>
          )}
        </div>

        {state.customIcons.length > 0 && (
          <div className="pt-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block opacity-70">
              Custom Icons
            </label>
            <div
              className="space-y-2"
              role="list"
              aria-label="Uploaded custom icons"
            >
              {state.customIcons.map((icon) => (
                <div
                  key={icon.id}
                  className="flex items-center gap-3 p-2 rounded-xl border border-border bg-muted/10 hover:bg-muted/30 transition-all duration-200 group"
                  role="listitem"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-background border border-border shadow-sm p-1.5 overflow-hidden">
                    <img
                      src={icon.url || "/placeholder.svg"}
                      alt={icon.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span
                    className="text-xs font-medium text-foreground flex-1 truncate pr-2"
                    title={icon.name}
                  >
                    {icon.name}
                  </span>
                  <motion.div
                    animate={armedDeleteId === icon.id ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={armedDeleteId === icon.id ? { repeat: Infinity, duration: 0.6, ease: "easeInOut" } : { duration: 0.15 }}
                    className="flex-shrink-0"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(icon.id, icon.name)}
                      className={cn(
                        "h-8 w-8 transition-all duration-200 rounded-lg",
                        armedDeleteId === icon.id
                          ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                          : "text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                      )}
                      aria-label="Delete"
                    >
                      <AnimatePresence mode="wait">
                        {armedDeleteId === icon.id ? (
                          <motion.div
                            key="alert"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="trash"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
