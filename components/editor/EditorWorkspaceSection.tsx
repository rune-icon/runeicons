"use client";

import { useCallback, useEffect, type MutableRefObject } from "react";
import type { EditorAssetSummary } from "@/lib/editor/types";
import type { CustomizationState } from "@/lib/types";
import { useEditorDocument } from "@/components/editor/hooks/useEditorDocument";
import { EditorWorkspacePanel } from "@/components/editor/EditorWorkspacePanel";
import { selectAssetInStore } from "@/stores/use-editor-selection-store";

interface EditorWorkspaceSectionProps {
  assets: EditorAssetSummary[];
  state: CustomizationState;
  onGlobalStateChange: (updates: Partial<CustomizationState>) => void;
  resetDocumentRef: MutableRefObject<() => void>;
}

export function EditorWorkspaceSection({
  assets,
  state,
  onGlobalStateChange,
  resetDocumentRef,
}: EditorWorkspaceSectionProps) {
  const doc = useEditorDocument(assets);

  useEffect(() => {
    resetDocumentRef.current = doc.resetCurrentAsset;
  });

  const handleSelectAssetById = useCallback(
    (assetId: string) => {
      const asset = assets.find((c) => c.id === assetId);
      if (asset) selectAssetInStore(asset.id);
    },
    [assets],
  );

  const handleTogglePathEditor = useCallback(() => {
    doc.setShowPathEditor((prev: boolean) => !prev);
  }, [doc.setShowPathEditor]);

  return (
    <EditorWorkspacePanel
      state={state}
      document={doc.document}
      trayAssets={doc.trayAssets}
      selectedAssetId={doc.selectedAssetId}
      onSelectAssetById={handleSelectAssetById}
      onRemoveAssetFromTray={doc.removeAssetFromTray}
      selectedPathId={doc.selectedPathId}
      selectedPath={doc.selectedPath}
      onSelectPath={doc.setSelectedPathId}
      onCommitPathDraft={doc.commitPathDraft}
      onResetAsset={doc.resetCurrentAsset}
      onUndo={doc.handleUndo}
      onRedo={doc.handleRedo}
      canUndo={doc.canUndo}
      canRedo={doc.canRedo}
      showPathEditor={doc.showPathEditor}
      onTogglePathEditor={handleTogglePathEditor}
      saveDialogOpen={doc.saveDialogOpen}
      onSaveDialogOpenChange={doc.setSaveDialogOpen}
      onSaveSnapshot={doc.saveCurrentAsset}
      onGlobalStateChange={onGlobalStateChange}
    />
  );
}
