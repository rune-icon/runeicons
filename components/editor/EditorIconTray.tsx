"use client";

import { memo } from "react";
import { Plus, X } from "lucide-react";
import type { EditorAssetSummary } from "@/lib/editor/types";
import { cn } from "@/lib/utils";
import { EditorSvgPreview } from "@/components/editor/EditorSvgPreview";

interface EditorIconTrayProps {
  assets: EditorAssetSummary[];
  selectedAssetId: string | null;
  onAssetSelect: (asset: EditorAssetSummary) => void;
  onRemoveAsset: (assetId: string) => void;
}

export const EditorIconTray = memo(function EditorIconTray({
  assets,
  selectedAssetId,
  onAssetSelect,
  onRemoveAsset,
}: EditorIconTrayProps) {
  return (
    <div className="h-20 border-t border-border/10 bg-muted/5 flex items-center justify-center">
      <div className="flex gap-4 p-2 overflow-x-auto no-scrollbar scroll-smooth items-center">
        {assets.map((asset) => {
          const isSelected = asset.id === selectedAssetId;
          return (
            <div key={asset.id} className="relative group shrink-0">
              <button
                type="button"
                className={cn(
                  "w-12 h-12 rounded-lg border border-border/10 flex items-center justify-center p-2 relative shadow-md transition-all hover:scale-110 active:scale-95 overflow-hidden cursor-pointer bg-muted/20",
                  isSelected && "ring-2 ring-primary/70",
                )}
                onClick={() => onAssetSelect(asset)}
                aria-label={`Select ${asset.name}`}
              >
                <EditorSvgPreview document={asset} className="h-full w-full" />
              </button>
              <button
                type="button"
                onClick={() => onRemoveAsset(asset.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 z-40"
                aria-label={`Remove ${asset.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
        {assets.length < 5 ? (
          <div className="w-12 h-12 rounded-lg border-2 border-dashed border-border/20 flex flex-col items-center justify-center text-muted-foreground/30 shrink-0 bg-background/20">
            <Plus className="w-5 h-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
});
