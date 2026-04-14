"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SvgDefinitions } from "@/components/icon-page/panels/workspace/components/SvgDefinitions";
import { WorkspaceGround } from "@/components/icon-page/panels/workspace/components/WorkspaceGround";
import type { CustomizationState } from "@/lib/types";
import type {
  EditorAssetSummary,
  EditorDocument,
} from "@/lib/editor/types";
import { createEditorSvgMarkup, cloneDocument } from "@/lib/editor/svg";
import { EditorActionBar } from "@/components/editor/EditorActionBar";
import { EditorPathCanvas } from "@/components/editor/EditorPathCanvas";
import { EditorDrawCanvas } from "@/components/editor/EditorDrawCanvas";
import { EditorMiniPreview } from "@/components/editor/EditorMiniPreview";
import { EditorModeToggle } from "@/components/editor/EditorModeToggle";
import { EditorIconTray } from "@/components/editor/EditorIconTray";
import { EditorSaveDialog } from "@/components/editor/EditorSaveDialog";

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
  isModified: boolean;
  onResetAsset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveDialogOpen: boolean;
  onSaveDialogOpenChange: (open: boolean) => void;
  onSaveSnapshot: (name: string) => void;
  onAddPath: (d: string) => void;
  onGlobalStateChange: (updates: Partial<CustomizationState>) => void;
}

type EditorMode = "edit" | "draw";

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
  isModified,
  onResetAsset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  saveDialogOpen,
  onSaveDialogOpenChange,
  onSaveSnapshot,
  onAddPath,
  onGlobalStateChange,
}: EditorWorkspacePanelProps) {
  const [editorMode, setEditorMode] = useState<EditorMode>("edit");
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

  const exportDocument = previewDocument ?? editorDocument;

  const downloadSvg = () => {
    if (!exportDocument) return;

    const markup = createEditorSvgMarkup(exportDocument, state);
    const blob = new Blob([markup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${exportDocument.name ?? "runeicons-editor"}.svg`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("SVG downloaded successfully");
  };

  const copySvg = async () => {
    if (!exportDocument) return;

    const markup = createEditorSvgMarkup(exportDocument, state);
    await navigator.clipboard.writeText(markup);
  };

  const editorCanvas =
    editorMode === "draw" ? (
      <EditorDrawCanvas
        document={editorDocument}
        state={state}
        viewBox={editorDocument?.viewBox ?? "0 0 24 24"}
        onAddPath={onAddPath}
      />
    ) : (
      <EditorPathCanvas
        state={state}
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
    );

  return (
    <>
      <SvgDefinitions state={state} />
      <main className="flex-1 flex flex-col relative overflow-hidden" aria-label="Editor workspace">
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 px-4">
          {/* Toggle: centered above the canvas */}
          <div className="flex justify-center mb-2">
            <EditorModeToggle
              mode={editorMode}
              onModeChange={setEditorMode}
            />
          </div>

          {/* Canvas container: holds grid background + editor + preview overlay */}
          <div className="relative w-full max-w-[600px] aspect-square overflow-hidden rounded-xl">
            <WorkspaceGround />
            <div className="absolute inset-0 z-10">
              {editorCanvas}
            </div>
            <EditorMiniPreview
              document={previewDocument}
              state={state}
              onPathClick={onSelectPath}
            />
          </div>

          {/* Icon tray: below the canvas */}
          <div className="mt-2 mb-16">
            <EditorIconTray
              assets={trayAssets}
              selectedAssetId={selectedAssetId}
              onAssetSelect={(asset) => onSelectAssetById(asset.id)}
              onRemoveAsset={onRemoveAssetFromTray}
            />
          </div>
        </div>

        {/* Floating action bar — bottom center */}
        <div className="absolute bottom-9.5 left-1/2 -translate-x-1/2 z-10">
          <EditorActionBar
            state={state}
            onDimensionChange={(size) =>
              onGlobalStateChange({ width: size, height: size })
            }
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            isModified={isModified}
            onReset={onResetAsset}
            onCopySvg={copySvg}
            onDownloadSvg={downloadSvg}
            onOpenSaveDialog={() => onSaveDialogOpenChange(true)}
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
