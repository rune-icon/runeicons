"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EditorDocument, EditorStoredDocument } from "@/lib/editor/types";
import { areEditorDocumentsEqual } from "@/lib/editor/document-utils";

interface EditorEditsStore {
  documents: Record<string, EditorStoredDocument>;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  upsertDocument: (document: EditorDocument) => void;
  removeDocument: (assetId: string) => void;
}

export const useEditorEditsStore = create<EditorEditsStore>()(
  persist(
    (set) => ({
      documents: {},
      hasHydrated: false,
      setHasHydrated: (hasHydrated) =>
        set((state) => (state.hasHydrated === hasHydrated ? state : { hasHydrated })),
      upsertDocument: (document) =>
        set((state) => {
          const currentDocument = state.documents[document.assetId];
          if (currentDocument && areEditorDocumentsEqual(currentDocument, document)) {
            return state;
          }

          return {
            documents: {
              ...state.documents,
              [document.assetId]: {
                ...document,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),
      removeDocument: (assetId) =>
        set((state) => {
          if (!(assetId in state.documents)) {
            return state;
          }

          const nextDocuments = { ...state.documents };
          delete nextDocuments[assetId];
          return { documents: nextDocuments };
        }),
    }),
    {
      name: "runeicons-editor-edits",
      version: 1,
      partialize: (state) => ({
        documents: state.documents,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
