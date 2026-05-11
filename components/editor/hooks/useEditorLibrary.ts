"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import type { EditorAssetSummary, EditorVariant } from "@/lib/editor/types";
import type { CustomizationState } from "@/lib/types";
import {
  useEditorSelectionStore,
  selectAssetInStore,
  removeFromTrayInStore,
} from "@/stores/editor-selection";

const SUPPORTED_VARIANTS: ReadonlySet<EditorVariant> = new Set([
  "normal",
  "duotone",
  "fill",
  "pixelated",
]);

export function useEditorLibrary(
  assets: EditorAssetSummary[],
  iconType: CustomizationState["iconType"],
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const selectedAssetId = useEditorSelectionStore((s) => s.selectedAssetId);
  const trayAssetIds = useEditorSelectionStore((s) => s.trayAssetIds);

  const variantAssets = useMemo(() => {
    if (!SUPPORTED_VARIANTS.has(iconType as EditorVariant)) {
      return [];
    }
    return assets.filter((asset) => asset.variant === iconType);
  }, [assets, iconType]);

  const assetMap = useMemo(
    () => new Map(variantAssets.map((asset) => [asset.id, asset])),
    [variantAssets],
  );

  const effectiveSelectedAssetId = useMemo(() => {
    if (selectedAssetId && assetMap.has(selectedAssetId)) {
      return selectedAssetId;
    }
    return variantAssets[0]?.id ?? null;
  }, [assetMap, variantAssets, selectedAssetId]);

  const categories = useMemo(() => {
    const unique = new Map<string, string>([["all", "All"]]);
    for (const asset of variantAssets) {
      unique.set(asset.category, asset.categoryLabel);
    }
    return [...unique.entries()].map(([value, label]) => ({ value, label }));
  }, [variantAssets]);

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const deferredActiveCategory = useDeferredValue(activeCategory);

  const filteredAssets = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();
    return variantAssets.filter((asset) => {
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
  }, [deferredActiveCategory, variantAssets, deferredSearchQuery]);

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
      removeFromTrayInStore(assetId, variantAssets[0]?.id ?? null);
    },
    [variantAssets],
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
