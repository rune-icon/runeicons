"use client";

import { memo, useRef, type ReactNode } from "react";
import type { CustomizationState } from "@/lib/types";
import type { EditorAssetSummary, EditorDocument } from "@/lib/editor/types";
import { useCanvasStyles } from "@/hooks/use-canvas-styles";
import { cn } from "@/lib/utils";
import { EditorSvgPreview } from "@/components/editor/EditorSvgPreview";
import { CanvasFrame } from "@/components/icon-page/panels/workspace/components/CanvasFrame";
import { EditorIconTray } from "@/components/editor/EditorIconTray";

interface EditorPreviewContentProps {
  state: CustomizationState;
  document: EditorDocument | null;
  trayAssets: EditorAssetSummary[];
  selectedAssetId: string | null;
  onAssetSelect: (assetId: string) => void;
  onAssetRemove: (assetId: string) => void;
  editorPane?: ReactNode;
  onPathClick?: (pathId: string) => void;
}

export const EditorPreviewContent = memo(function EditorPreviewContent({
  state,
  document,
  trayAssets,
  selectedAssetId,
  onAssetSelect,
  onAssetRemove,
  editorPane,
  onPathClick,
}: EditorPreviewContentProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { boxShadow, supportsFilter, noiseFilter } = useCanvasStyles(state);

  const previewBlock = (
    <div
      ref={canvasRef}
      className={cn(
        "relative flex items-center justify-center",
        state.iconType === "isometric" &&
          "transform [transform:rotateX(45deg)_rotateZ(-45deg)]",
        state.iconType === "pixelated" &&
          "[image-rendering:pixelated] [filter:url(#pixelate)]",
        state.iconType === "glass" &&
          "backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4",
        state.iconType === "dither" && "[filter:url(#dither-filter)]",
      )}
      style={{
        width: editorPane ? 120 : state.width,
        height: editorPane ? 120 : state.height,
        padding: editorPane ? 12 : state.padding,
        borderRadius: state.cornerRadius,
        transform: editorPane
          ? undefined
          : [
              `translate(${state.translateX}px, ${state.translateY}px)`,
              `scale(${state.flipH ? -state.scale : state.scale}, ${state.flipV ? -state.scale : state.scale})`,
              `rotate(${state.rotation}deg)`,
            ].join(" "),
        boxShadow: editorPane
          ? undefined
          : state.shadow.inner
            ? "none"
            : boxShadow,
        filter: editorPane
          ? undefined
          : [`blur(${state.blur}px)`, noiseFilter].filter(Boolean).join(" "),
        background: "transparent",
        opacity: !editorPane && !supportsFilter && state.blur > 0 ? 0.9 : 1,
      }}
    >
      {!editorPane && state.texture.selected !== "none" ? (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: state.texture.opacity / 100,
            background: `url(/placeholder.svg?height=200&width=200&query=${state.texture.selected}-texture) repeat`,
            backgroundSize: "200px 200px",
            borderRadius: state.cornerRadius,
          }}
          aria-hidden="true"
        />
      ) : null}

      {document ? (
        <div className="w-full h-full flex items-center justify-center">
          <EditorSvgPreview
            document={document}
            state={state}
            className="w-full h-full"
            onPathClick={onPathClick}
          />
        </div>
      ) : (
        <div className="text-center text-muted-foreground font-medium text-sm">
          <p>Select a Runeicons asset</p>
          <p className="text-xs opacity-70 mt-1">from the left panel</p>
        </div>
      )}
    </div>
  );

  return (
    <CanvasFrame
      trayNode={
        <EditorIconTray
          assets={trayAssets}
          selectedAssetId={selectedAssetId}
          onAssetSelect={(asset) => onAssetSelect(asset.id)}
          onRemoveAsset={onAssetRemove}
        />
      }
    >
      {editorPane ? (
        <div className="relative h-full min-h-0">
          <div className="absolute inset-0">{editorPane}</div>
          <div className="absolute top-3 left-3 z-20 w-[160px] h-[160px] bg-background border border-border rounded-lg shadow-md flex items-center justify-center p-4 pointer-events-auto">
            {previewBlock}
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-0 items-center justify-center p-8">
          {previewBlock}
        </div>
      )}
    </CanvasFrame>
  );
});
