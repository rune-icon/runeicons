import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  ChevronDown,
  AlertCircle,
  Loader2,
  Upload,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CustomizationState } from "@/lib/types";

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
  return (
    <Card className="bg-card border-border py-0 gap-0">
      <div className="flex items-center justify-between p-3">
        <button onClick={onToggle} className="flex items-center gap-2 flex-1" aria-expanded={!isCollapsed} aria-controls="section-upload-content">
          <h3 className="text-sm font-medium text-foreground">
            Upload & Custom Icons
          </h3>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isCollapsed && "rotate-180",
            )}
          />
        </button>
        <span className="text-xs text-muted-foreground mr-1">
          {state.customIcons.length}/{maxIcons}
        </span>
      </div>

      {!isCollapsed && (
        <div id="section-upload-content" className="px-4 pb-3">
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
              <span className="text-xs font-medium text-muted-foreground mb-2 block">
                Custom Icons
              </span>
              <div
                className="space-y-2"
                role="list"
                aria-label="Uploaded custom icons"
              >
                {state.customIcons.map((icon) => (
                  <div
                    key={icon.id}
                    className="flex items-center gap-3 p-2 rounded-md border border-border bg-background hover:bg-muted transition-colors"
                    role="listitem"
                  >
                    <Image
                      src={icon.url || "/placeholder.svg"}
                      alt={icon.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain flex-shrink-0"
                      unoptimized
                    />
                    <span
                      className="text-xs text-foreground flex-1 truncate"
                      title={icon.name}
                    >
                      {icon.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (window.confirm(`Delete "${icon.name}"? This cannot be undone.`)) {
                          deleteIcon(icon.id);
                        }
                      }}
                      className="h-7 w-7 flex-shrink-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                      aria-label={`Delete ${icon.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
