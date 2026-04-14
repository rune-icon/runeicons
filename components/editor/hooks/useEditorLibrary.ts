"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import type { EditorAssetSummary } from "@/lib/editor/types";
import {
  useEditorSelectionStore,
  selectAssetInStore,
  removeFromTrayInStore,
} from "@/stores/editor-selection";

export function useEditorLibrary(assets: EditorAssetSummary[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const selectedAssetId = useEditorSelectionStore((s) => s.selectedAssetId);
  const trayAssetIds = useEditorSelectionStore((s) => s.trayAssetIds);

  const assetMap = useMemo(
    () => new Map(assets.map((asset) => [asset.id, asset])),
    [assets],
  );

  const effectiveSelectedAssetId = useMemo(() => {
    if (selectedAssetId && assetMap.has(selectedAssetId)) {
      return selectedAssetId;
    }
    return assets[0]?.id ?? null;
  }, [assetMap, assets, selectedAssetId]);

  const categories = useMemo(() => {
    const unique = new Map<string, string>([["all", "All"]]);
    for (const asset of assets) {
      unique.set(asset.category, asset.categoryLabel);
    }
    return [...unique.entries()].map(([value, label]) => ({ value, label }));
  }, [assets]);

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredActiveCategory = useDeferredValue(activeCategory);

  const filteredAssets = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();
    return assets.filter((asset) => {
      const categoryMatches =
        deferredActiveCategory === "all" ||
        asset.category === deferredActiveCategory;
      const searchMatches =
        !query ||
        asset.name.toLowerCase().includes(query) ||
        asset.categoryLabel.toLowerCase().includes(query) ||
        asset.filePath.toLowerCase().includes(query);
      return categoryMatches && searchMatches;
    });
  }, [deferredActiveCategory, assets, deferredSearchQuery]);

  const trayAssets = useMemo(
    () =>
      trayAssetIds
        .map((id) => assetMap.get(id))
        .filter((asset): asset is EditorAssetSummary => Boolean(asset)),
    [assetMap, trayAssetIds],
  );

  const selectAsset = useCallback((asset: EditorAssetSummary) => {
    selectAssetInStore(asset.id);
  }, []);

  const removeAssetFromTray = useCallback(
    (assetId: string) => {
      removeFromTrayInStore(assetId, assets[0]?.id ?? null);
    },
    [assets],
  );

  return {
    categories,
    filteredAssets,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    selectedAssetId: effectiveSelectedAssetId,
    selectAsset,
    trayAssets,
    removeAssetFromTray,
  };
}
