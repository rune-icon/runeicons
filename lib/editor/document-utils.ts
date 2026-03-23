import type {
  EditorDocument,
  EditorIconPath,
  EditorRevision,
  EditorSavedAsset,
  EditorStoredDocument,
} from "./types";

type ComparableEditorDocument =
  | EditorDocument
  | EditorRevision
  | EditorSavedAsset
  | EditorStoredDocument;

function arePathsEqual(a: EditorIconPath, b: EditorIconPath) {
  return (
    a.id === b.id &&
    a.d === b.d &&
    a.fill === b.fill &&
    a.stroke === b.stroke &&
    a.strokeWidth === b.strokeWidth &&
    a.strokeLinecap === b.strokeLinecap &&
    a.strokeLinejoin === b.strokeLinejoin &&
    a.opacity === b.opacity &&
    a.fillOpacity === b.fillOpacity &&
    a.strokeOpacity === b.strokeOpacity &&
    a.mixBlendMode === b.mixBlendMode &&
    a.fillRule === b.fillRule &&
    a.clipRule === b.clipRule &&
    a.filter === b.filter &&
    a.clipPath === b.clipPath &&
    a.mask === b.mask &&
    a.visible === b.visible &&
    a.sourceTag === b.sourceTag
  );
}

export function areEditorDocumentsEqual(
  left: ComparableEditorDocument | null | undefined,
  right: ComparableEditorDocument | null | undefined,
) {
  if (left === right) return true;
  if (!left || !right) return false;

  if (
    left.assetId !== right.assetId ||
    left.name !== right.name ||
    left.category !== right.category ||
    left.categoryLabel !== right.categoryLabel ||
    left.sourceFilePath !== right.sourceFilePath ||
    left.viewBox !== right.viewBox ||
    left.defs !== right.defs
  ) {
    return false;
  }

  if (left.paths.length !== right.paths.length) return false;

  for (let i = 0; i < left.paths.length; i++) {
    if (!arePathsEqual(left.paths[i], right.paths[i])) return false;
  }

  return true;
}
