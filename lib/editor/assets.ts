import { cache } from "react";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parseEditorAsset } from "@/lib/editor/svg";
import type {
  EditorAssetSummary,
  EditorIconAsset,
  EditorVariant,
} from "@/lib/editor/types";

const VARIANTS: Array<{ id: EditorVariant; folder: string }> = [
  { id: "normal", folder: "normal" },
  { id: "duotone", folder: "duotone" },
  { id: "fill", folder: "fill" },
  { id: "pixelated", folder: "pixelated" },
];

const VARIANT_ORDER: Record<EditorVariant, number> = {
  normal: 0,
  duotone: 1,
  fill: 2,
  pixelated: 3,
};

async function collectSvgFiles(directory: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
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
    variant: asset.variant,
  };
}

const getFullAssets = cache(async () => {
  const allAssets: EditorIconAsset[] = [];

  for (const variant of VARIANTS) {
    const root = path.join(process.cwd(), "public", variant.folder);
    const svgFiles = await collectSvgFiles(root);
    const parsed = await Promise.all(
      svgFiles.map(async (filePath) => {
        const content = await readFile(filePath, "utf8");
        const asset = parseEditorAsset(content, filePath);
        return {
          ...asset,
          id: `${variant.id}:${asset.id}`,
          slug: `${variant.id}/${asset.slug}`,
          variant: variant.id,
        };
      }),
    );

    allAssets.push(...parsed.filter((asset) => asset.paths.length > 0));
  }

  return allAssets.sort((left, right) => {
    if (left.variant !== right.variant) {
      return VARIANT_ORDER[left.variant] - VARIANT_ORDER[right.variant];
    }
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
