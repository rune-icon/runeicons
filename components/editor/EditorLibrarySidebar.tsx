"use client";

import type { EditorAssetSummary } from "@/lib/editor/types";
import type { CustomizationState } from "@/lib/types";
import { useEditorLibrary } from "@/components/editor/hooks/useEditorLibrary";
import { EditorAssetLibrary } from "@/components/editor/EditorAssetLibrary";

interface EditorLibrarySidebarProps {
  assets: EditorAssetSummary[];
  iconType: CustomizationState["iconType"];
}

export function EditorLibrarySidebar({
  assets,
  iconType,
}: EditorLibrarySidebarProps) {
  const library = useEditorLibrary(assets, iconType);

  return (
    <EditorAssetLibrary
      assets={library.filteredAssets}
      categories={library.categories}
      searchQuery={library.searchQuery}
      onSearchQueryChange={library.setSearchQuery}
      activeCategory={library.activeCategory}
      onCategoryChange={library.setActiveCategory}
      selectedAssetId={library.selectedAssetId}
      onAssetSelect={library.selectAsset}
    />
  );
}
