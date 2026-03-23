import { cache } from "react";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseEditorAsset } from "@/lib/editor/svg";
import type { EditorAssetSummary, EditorIconAsset } from "@/lib/editor/types";

const EDITOR_ASSET_ROOT = path.join(process.cwd(), "public", "regular");

async function collectSvgFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectSvgFiles(fullPath);
      }
      if (entry.isFile() && entry.name.endsWith(".svg")) {
        return [fullPath];
      }
      return [];
    }),
  );

  return files.flat();
}

function toSummary(asset: EditorIconAsset): EditorAssetSummary {
  return {
    id: asset.id,
    slug: asset.slug,
    name: asset.name,
    category: asset.category,
    categoryLabel: asset.categoryLabel,
    filePath: asset.filePath,
    viewBox: asset.viewBox,
    defs: asset.defs,
    paths: asset.paths,
  };
}

const getFullAssets = cache(async () => {
  const svgFiles = await collectSvgFiles(EDITOR_ASSET_ROOT);
  const assets = await Promise.all(
    svgFiles.map(async (filePath) => {
      const content = await readFile(filePath, "utf8");
      return parseEditorAsset(content, filePath);
    }),
  );

  return assets
    .filter((asset) => asset.paths.length > 0)
    .sort((left, right) => {
      if (left.category === right.category) {
        return left.name.localeCompare(right.name);
      }
      return left.category.localeCompare(right.category);
    });
});

export const getEditorAssets = cache(async (): Promise<EditorAssetSummary[]> => {
  const full = await getFullAssets();
  return full.map(toSummary);
});

export async function getEditorAssetById(
  assetId: string,
): Promise<EditorIconAsset | null> {
  const full = await getFullAssets();
  return full.find((asset) => asset.id === assetId) ?? null;
}
