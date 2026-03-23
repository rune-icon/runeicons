"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SvgDefinitions } from "@/components/icon-page/panels/workspace/components/SvgDefinitions";
import type { CustomizationState } from "@/lib/types";
import type {
  EditorAssetSummary,
  EditorDocument,
} from "@/lib/editor/types";
import { createEditorSvgMarkup } from "@/lib/editor/svg";
import { EditorActionBar } from "@/components/editor/EditorActionBar";
import { EditorPathCanvas } from "@/components/editor/EditorPathCanvas";
import { EditorPreviewContent } from "@/components/editor/EditorPreviewContent";
import { EditorSaveDialog } from "@/components/editor/EditorSaveDialog";
import { cloneDocument } from "@/lib/editor/svg";

interface EditorWorkspacePanelProps {
  state: CustomizationState;
  document: EditorDocument | null;
  trayAssets: EditorAssetSummary[];
  selectedAssetId: string | null;
  onSelectAssetById: (assetId: string) => void;
  onRemoveAssetFromTray: (assetId: string) => void;
  selectedPathId: string | null;
  selectedPath: EditorDocument["paths"][number] | null;
  onSelectPath: (pathId: string) => void;
  onCommitPathDraft: (pathId: string, d: string) => void;
  onResetAsset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showPathEditor: boolean;
  onTogglePathEditor: () => void;
  saveDialogOpen: boolean;
  onSaveDialogOpenChange: (open: boolean) => void;
  onSaveSnapshot: (name: string) => void;
  onGlobalStateChange: (updates: Partial<CustomizationState>) => void;
}

export function EditorWorkspacePanel({
  state,
  document: editorDocument,
  trayAssets,
  selectedAssetId,
  onSelectAssetById,
  onRemoveAssetFromTray,
  selectedPathId,
  selectedPath,
  onSelectPath,
  onCommitPathDraft,
  onResetAsset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  showPathEditor,
  onTogglePathEditor,
  saveDialogOpen,
  onSaveDialogOpenChange,
  onSaveSnapshot,
  onGlobalStateChange,
}: EditorWorkspacePanelProps) {
  const [previewPathDraft, setPreviewPathDraft] = useState<{
    assetId: string;
    pathId: string;
    d: string;
  } | null>(null);

  const activePreviewPathDraft = useMemo(() => {
    if (
      !previewPathDraft ||
      !editorDocument ||
      !selectedPathId ||
      previewPathDraft.assetId !== editorDocument.assetId ||
      previewPathDraft.pathId !== selectedPathId
    ) {
      return null;
    }

    return editorDocument.paths.some((path) => path.id === previewPathDraft.pathId)
      ? previewPathDraft
      : null;
  }, [editorDocument, previewPathDraft, selectedPathId]);

  const previewDocument = useMemo(() => {
    if (!editorDocument || !activePreviewPathDraft) {
      return editorDocument;
    }

    const nextDocument = cloneDocument(editorDocument);
    nextDocument.paths = nextDocument.paths.map((path) =>
      path.id === activePreviewPathDraft.pathId
        ? { ...path, d: activePreviewPathDraft.d }
        : path,
    );
    return nextDocument;
  }, [activePreviewPathDraft, editorDocument]);

  const defaultSnapshotName = editorDocument
    ? `${editorDocument.name} Snapshot`
    : "Runeicons Snapshot";

  const downloadSvg = () => {
    if (!editorDocument) return;

    const markup = createEditorSvgMarkup(editorDocument, state);
    const blob = new Blob([markup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${editorDocument.name ?? "runeicons-editor"}.svg`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("SVG downloaded successfully");
  };

  const copySvg = async () => {
    if (!editorDocument) return;

    const markup = createEditorSvgMarkup(editorDocument, state);
    await navigator.clipboard.writeText(markup);
  };

  return (
    <>
      <SvgDefinitions state={state} />
      <main className="flex-1 flex flex-col relative overflow-hidden" aria-label="Editor workspace">
        <EditorPreviewContent
          state={state}
          document={previewDocument}
          trayAssets={trayAssets}
          selectedAssetId={selectedAssetId}
          onAssetSelect={onSelectAssetById}
          onAssetRemove={onRemoveAssetFromTray}
          onPathClick={onSelectPath}
          editorPane={
            showPathEditor ? (
              <EditorPathCanvas
                path={selectedPath}
                allPaths={editorDocument?.paths}
                viewBox={editorDocument?.viewBox ?? "0 0 24 24"}
                onSelectPath={onSelectPath}
                onPreviewChange={(nextPath) => {
                  if (selectedPathId && editorDocument) {
                    setPreviewPathDraft({
                      assetId: editorDocument.assetId,
                      pathId: selectedPathId,
                      d: nextPath,
                    });
                  }
                }}
                onCommitChange={(nextPath) => {
                  if (selectedPathId) {
                    setPreviewPathDraft(null);
                    onCommitPathDraft(selectedPathId, nextPath);
                  }
                }}
              />
            ) : null
          }
        />

        <div className="absolute bottom-9.5 left-1/2 -translate-x-1/2 z-30">
          <EditorActionBar
            state={state}
            onDimensionChange={(size) =>
              onGlobalStateChange({ width: size, height: size })
            }
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            onReset={onResetAsset}
            onCopySvg={copySvg}
            onDownloadSvg={downloadSvg}
            onOpenSaveDialog={() => onSaveDialogOpenChange(true)}
            showPathEditor={showPathEditor}
            onTogglePathEditor={onTogglePathEditor}
          />
        </div>
      </main>

      <EditorSaveDialog
        open={saveDialogOpen}
        onOpenChange={onSaveDialogOpenChange}
        defaultName={defaultSnapshotName}
        onSave={onSaveSnapshot}
      />
    </>
  );
}
