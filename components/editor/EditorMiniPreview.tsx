"use client";

import { memo } from "react";
import type { CustomizationState } from "@/lib/types";
import type { EditorDocument } from "@/lib/editor/types";
import { EditorSvgPreview } from "@/components/editor/EditorSvgPreview";

interface EditorMiniPreviewProps {
  document: EditorDocument | null;
  state: CustomizationState;
  onPathClick?: (pathId: string) => void;
}

export const EditorMiniPreview = memo(function EditorMiniPreview({
  document,
  state,
  onPathClick,
}: EditorMiniPreviewProps) {
  if (!document) return null;

  return (
    <div className="absolute top-2 left-2 z-20 w-[96px] h-[96px] bg-background border border-border rounded-xl shadow-md flex items-center justify-center p-2.5 pointer-events-auto">
      <EditorSvgPreview
        document={document}
        state={state}
        className="w-full h-full"
        onPathClick={onPathClick}
      />
    </div>
  );
});
