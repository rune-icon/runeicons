"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EditorDocument, EditorSavedAsset } from "@/lib/editor/types";

interface EditorSavedAssetsStore {
  savedAssets: EditorSavedAsset[];
  saveAsset: (name: string, document: EditorDocument) => void;
  removeSavedAsset: (id: string) => void;
}

export const useEditorSavedAssetsStore = create<EditorSavedAssetsStore>()(
  persist(
    (set) => ({
      savedAssets: [],
      saveAsset: (name, document) =>
        set((state) => {
          const timestamp = new Date().toISOString();
          const existing = state.savedAssets.find(
            (asset) =>
              asset.assetId === document.assetId &&
              asset.savedName.toLowerCase() === name.trim().toLowerCase(),
          );

          if (existing) {
            return {
              savedAssets: state.savedAssets.map((asset) =>
                asset.id === existing.id
                  ? {
                      ...asset,
                      ...document,
                      savedName: name.trim(),
                      updatedAt: timestamp,
                    }
                  : asset,
              ),
            };
          }

          return {
            savedAssets: [
              {
                id: `${document.assetId}-${Date.now()}`,
                savedName: name.trim(),
                createdAt: timestamp,
                updatedAt: timestamp,
                ...document,
              },
              ...state.savedAssets,
            ],
          };
        }),
      removeSavedAsset: (id) =>
        set((state) => ({
          savedAssets: state.savedAssets.filter((asset) => asset.id !== id),
        })),
    }),
    {
      name: "runeicons-editor-saved-assets",
      version: 1,
    },
  ),
);
