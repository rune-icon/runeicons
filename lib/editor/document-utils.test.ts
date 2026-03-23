import { describe, expect, it } from "vitest";
import { areEditorDocumentsEqual } from "./document-utils";
import type {
  EditorDocument,
  EditorRevision,
  EditorStoredDocument,
} from "./types";

const baseDocument: EditorDocument = {
  assetId: "arrow-left",
  name: "Arrow Left",
  category: "navigation",
  categoryLabel: "Navigation",
  sourceFilePath: "regular/navigation/ArrowLeft.svg",
  viewBox: "0 0 24 24",
  defs: "<defs><clipPath id='clip0' /></defs>",
  paths: [
    {
      id: "arrow-left-path-0",
      d: "M 4 12 L 20 12",
      stroke: "#000000",
      strokeWidth: 1.5,
      visible: true,
      sourceTag: "path",
    },
  ],
};

describe("areEditorDocumentsEqual", () => {
  it("ignores persisted metadata fields when comparing documents", () => {
    const storedDocument: EditorStoredDocument = {
      ...baseDocument,
      updatedAt: "2026-03-12T00:00:00.000Z",
    };

    expect(areEditorDocumentsEqual(baseDocument, storedDocument)).toBe(true);
  });

  it("compares actual editor content changes", () => {
    const revision: EditorRevision = {
      ...baseDocument,
      id: "rev-1",
      createdAt: "2026-03-12T00:00:00.000Z",
    };

    const editedDocument: EditorDocument = {
      ...baseDocument,
      paths: [
        {
          ...baseDocument.paths[0],
          d: "M 6 12 L 20 12",
        },
      ],
    };

    expect(areEditorDocumentsEqual(revision, editedDocument)).toBe(false);
  });
});
