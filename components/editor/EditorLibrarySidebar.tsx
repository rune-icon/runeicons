"use client";

import type { EditorAssetSummary } from "@/lib/editor/types";
import { useEditorLibrary } from "@/components/editor/hooks/useEditorLibrary";
import { EditorAssetLibrary } from "@/components/editor/EditorAssetLibrary";

interface EditorLibrarySidebarProps {
  assets: EditorAssetSummary[];
}

export function EditorLibrarySidebar({ assets }: EditorLibrarySidebarProps) {
  const library = useEditorLibrary(assets);

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
