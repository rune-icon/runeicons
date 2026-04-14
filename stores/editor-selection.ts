"use client";

import { create } from "zustand";

const MAX_TRAY_ITEMS = 5;

interface EditorSelectionStore {
  selectedAssetId: string | null;
  trayAssetIds: string[];
}

export const useEditorSelectionStore = create<EditorSelectionStore>(() => ({
  selectedAssetId: null,
  trayAssetIds: [],
}));

export function selectAssetInStore(assetId: string) {
  useEditorSelectionStore.setState((state) => ({
    selectedAssetId: assetId,
    trayAssetIds: state.trayAssetIds.includes(assetId)
      ? state.trayAssetIds
      : [assetId, ...state.trayAssetIds].slice(0, MAX_TRAY_ITEMS),
  }));
}

export function removeFromTrayInStore(
  assetId: string,
  fallbackAssetId: string | null,
) {
  useEditorSelectionStore.setState((state) => {
    const nextTray = state.trayAssetIds.filter((id) => id !== assetId);
    return {
      trayAssetIds: nextTray,
      selectedAssetId:
        state.selectedAssetId === assetId
          ? nextTray[0] ?? fallbackAssetId
          : state.selectedAssetId,
    };
  });
}

export function updateTrayInStore(
  assetId: string,
  currentTrayIds: string[],
) {
  useEditorSelectionStore.setState({
    selectedAssetId: assetId,
    trayAssetIds: currentTrayIds.includes(assetId)
      ? currentTrayIds
      : [assetId, ...currentTrayIds].slice(0, MAX_TRAY_ITEMS),
  });
}
