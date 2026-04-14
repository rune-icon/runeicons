"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EditorDocument, EditorRevision } from "@/lib/editor/types";

const MAX_REVISIONS = 25;

interface EditorRevisionsStore {
  revisions: EditorRevision[];
  pushRevision: (document: EditorDocument) => void;
}

export const useEditorRevisionsStore = create<EditorRevisionsStore>()(
  persist(
    (set) => ({
      revisions: [],
      pushRevision: (document) =>
        set((state) => ({
          revisions: [
            {
              id: `${document.assetId}-${Date.now()}`,
              createdAt: new Date().toISOString(),
              ...document,
            },
            ...state.revisions,
          ].slice(0, MAX_REVISIONS),
        })),
    }),
    {
      name: "runeicons-editor-revisions",
      version: 1,
    },
  ),
);
