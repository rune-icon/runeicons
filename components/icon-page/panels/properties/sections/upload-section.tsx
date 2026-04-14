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
  isCollapsed: boolean;
  onToggle: () => void;
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
  isCollapsed,
  onToggle,
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
  const { getSpring } = useTuning();
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
    <div className="border-t border-border mt-2 pt-2">
      <div className="flex items-center justify-between p-3">
        <button onClick={onToggle} className="flex items-center gap-2 flex-1" aria-expanded={!isCollapsed} aria-controls="section-upload-content">
          <h3 className="text-sm font-medium text-foreground">
            Upload & Custom Icons
          </h3>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out",
              isCollapsed && "rotate-180",
            )}
          />
        </button>
        <span className="text-xs text-muted-foreground mr-1">
          {state.customIcons.length}/{maxIcons}
        </span>
      </div>

      {!isCollapsed && (
        <div id="section-upload-content" className="px-4 pb-4">
          {uploadError && (
            <div
              className="mb-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{uploadError}</p>
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
              "border-2 border-dashed rounded-lg p-4 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-border",
              isUploading && "opacity-50 pointer-events-none",
            )}
            role="region"
            aria-label="File upload area"
          >
            {isUploading ? (
              <>
                <Loader2
                  className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-spin"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload
                  className="h-8 w-8 mx-auto mb-2 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop files here
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  SVG, PNG, JPG (max 5MB)
                </p>
                <label>
                  <input
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg"
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
                    disabled={state.customIcons.length >= maxIcons}
                  >
                    <span>Upload Icon</span>
                  </Button>
                </label>
              </>
            )}
          </div>

          {state.customIcons.length === 0 && !isUploading && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              No custom icons uploaded yet. Upload your first icon to get
              started.
            </p>
          )}

          {state.customIcons.length > 0 && (
            <div className="mt-2">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
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
                    className="flex items-center gap-3 p-2 rounded-md border border-border bg-background hover:bg-muted transition-colors duration-150 ease-out"
                    role="listitem"
                  >
                    <img
                      src={icon.url || "/placeholder.svg"}
                      alt={icon.name}
                      className="w-8 h-8 object-contain flex-shrink-0"
                    />
                    <span
                      className="text-xs text-foreground flex-1 truncate"
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
                          "h-7 w-7 transition-all duration-150 ease-out active:scale-[0.97]",
                          armedDeleteId === icon.id
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                        aria-label={armedDeleteId === icon.id ? `Click again to delete ${icon.name}` : `Delete ${icon.name}`}
                        title={armedDeleteId === icon.id ? "Click again to confirm" : `Delete ${icon.name}`}
                      >
                        <AnimatePresence mode="wait">
                          {armedDeleteId === icon.id ? (
                            <motion.div
                              key="alert"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={getSpring({ stiffness: 500, damping: 25 })}
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="trash"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={getSpring({ stiffness: 400, damping: 25 })}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
      )}
    </div>
  );
}
