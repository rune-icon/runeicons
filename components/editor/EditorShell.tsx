"use client";

import { useCallback, useRef } from "react";
import { HeaderPanel } from "@/components/icon-page/panels/header";
import { ToolRail } from "@/components/icon-page/panels/outline";
import { PropertiesPanel } from "@/components/icon-page/panels/properties";
import type { EditorAssetSummary } from "@/lib/editor/types";
import { useWorkspaceState } from "@/hooks/use-workspace-state";
import { useLocalStorageSyncEffect } from "@/hooks/use-localstorage-sync";
import { useEditorSelectionStore } from "@/stores/editor-selection";
import { EditorLibrarySidebar } from "@/components/editor/EditorLibrarySidebar";
import { EditorWorkspaceSection } from "@/components/editor/EditorWorkspaceSection";

const MAX_TRAY_ITEMS = 5;

interface EditorShellProps {
  assets: EditorAssetSummary[];
}

export function EditorShell({ assets }: EditorShellProps) {
  useLocalStorageSyncEffect();
  const { state, handleChange, handleReset } = useWorkspaceState({
    enableKeyboardShortcuts: false,
  });
  const resetDocumentRef = useRef<() => void>(() => {});

  const hasInitRef = useRef(false);
  if (!hasInitRef.current) {
    hasInitRef.current = true;
    useEditorSelectionStore.setState({
      selectedAssetId: assets[0]?.id ?? null,
      trayAssetIds: assets.slice(0, MAX_TRAY_ITEMS).map((a) => a.id),
    });
  }

  const handleFullReset = useCallback(() => {
    handleReset();
    resetDocumentRef.current();
  }, [handleReset]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <HeaderPanel />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-12 shrink-0" aria-label="Tool rail">
          <ToolRail
            activeType={state.iconType}
            onTypeChange={(type) => handleChange({ iconType: type })}
          />
        </aside>

        <aside className="w-[320px] shrink-0" aria-label="Editor asset library">
          <EditorLibrarySidebar assets={assets} />
        </aside>

        <EditorWorkspaceSection
          assets={assets}
          state={state}
          onGlobalStateChange={handleChange}
          resetDocumentRef={resetDocumentRef}
        />

        <aside
          className="w-[380px] shrink-0 border-l border-border bg-card overflow-y-auto"
          aria-label="Customization controls"
        >
          <PropertiesPanel
            state={state}
            onChange={handleChange}
            onReset={handleFullReset}
          />
        </aside>
      </div>
    </div>
  );
}
