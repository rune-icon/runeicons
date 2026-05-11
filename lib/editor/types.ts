import type React from "react";

export type EditorSupportedTag = "path" | "circle" | "rect";

export type EditorVariant = "normal" | "duotone" | "fill" | "pixelated";

export interface EditorIconPath {
  id: string;
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  opacity?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  fillRule?: "nonzero" | "evenodd";
  clipRule?: "nonzero" | "evenodd";
  filter?: string;
  clipPath?: string;
  mask?: string;
  visible: boolean;
  sourceTag: EditorSupportedTag;
}

export interface EditorAssetSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  filePath: string;
  viewBox: string;
  defs?: string;
  paths: EditorIconPath[];
  variant: EditorVariant;
}

export interface EditorIconAsset extends EditorAssetSummary {
  rawSvg: string;
  unsupportedElements: string[];
}

export interface EditorDocument {
  assetId: string;
  name: string;
  category: string;
  categoryLabel: string;
  sourceFilePath: string;
  viewBox: string;
  defs?: string;
  paths: EditorIconPath[];
}

export interface EditorSavedAsset extends EditorDocument {
  id: string;
  savedName: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorRevision extends EditorDocument {
  id: string;
  createdAt: string;
}

export interface EditorStoredDocument extends EditorDocument {
  updatedAt: string;
}
