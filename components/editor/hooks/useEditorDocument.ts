"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  EditorAssetSummary,
  EditorDocument,
  EditorIconPath,
  EditorRevision,
  EditorSavedAsset,
} from "@/lib/editor/types";
import { cloneDocument, documentFromAsset } from "@/lib/editor/svg";
import { areEditorDocumentsEqual } from "@/lib/editor/document-utils";
import { isEditableKeyboardTarget } from "@/hooks/use-history";
import { useEditorEditsStore } from "@/stores/use-editor-edits-store";
import { useEditorRevisionsStore } from "@/stores/use-editor-revisions-store";
import { useEditorSavedAssetsStore } from "@/stores/use-editor-saved-assets-store";
import {
  useEditorSelectionStore,
  updateTrayInStore,
  removeFromTrayInStore,
} from "@/stores/use-editor-selection-store";

const MAX_HISTORY_ITEMS = 60;
const PERSIST_DEBOUNCE_MS = 500;

export function useEditorDocument(assets: EditorAssetSummary[]) {
  const selectedAssetId = useEditorSelectionStore((s) => s.selectedAssetId);
  const trayAssetIds = useEditorSelectionStore((s) => s.trayAssetIds);

  const [document, setDocument] = useState<EditorDocument | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [history, setHistory] = useState<EditorDocument[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const historyRef = useRef<EditorDocument[]>([]);
  const historyIndexRef = useRef(0);
  const documentRef = useRef<EditorDocument | null>(null);
  const skipNextRevision = useRef(true);
  const persistTimerRef = useRef(0);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);
  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);
  useEffect(() => {
    documentRef.current = document;
  }, [document]);

  const assetMap = useMemo(
    () => new Map(assets.map((asset) => [asset.id, asset])),
    [assets],
  );

  const effectiveSelectedAssetId = useMemo(() => {
    if (selectedAssetId && assetMap.has(selectedAssetId)) {
      return selectedAssetId;
    }
    return assets[0]?.id ?? null;
  }, [assetMap, assets, selectedAssetId]);

  const hasHydrated = useEditorEditsStore((state) => state.hasHydrated);
  const persistedDocument = useEditorEditsStore(
    useCallback(
      (state) =>
        effectiveSelectedAssetId
          ? state.documents[effectiveSelectedAssetId] ?? null
          : null,
      [effectiveSelectedAssetId],
    ),
  );
  const upsertDocument = useEditorEditsStore((state) => state.upsertDocument);
  const removeDocument = useEditorEditsStore((state) => state.removeDocument);
  const savedAssets = useEditorSavedAssetsStore((state) => state.savedAssets);
  const saveAsset = useEditorSavedAssetsStore((state) => state.saveAsset);
  const removeSavedAsset = useEditorSavedAssetsStore(
    (state) => state.removeSavedAsset,
  );
  const revisions = useEditorRevisionsStore((state) => state.revisions);
  const pushRevision = useEditorRevisionsStore((state) => state.pushRevision);

  const selectedAsset = useMemo(
    () =>
      effectiveSelectedAssetId
        ? assetMap.get(effectiveSelectedAssetId) ?? null
        : null,
    [assetMap, effectiveSelectedAssetId],
  );

  const trayAssets = useMemo(
    () =>
      trayAssetIds
        .map((id) => assetMap.get(id))
        .filter((a): a is EditorAssetSummary => Boolean(a)),
    [assetMap, trayAssetIds],
  );

  const selectedPath = useMemo(
    () => document?.paths.find((path) => path.id === selectedPathId) ?? null,
    [document, selectedPathId],
  );

  // --- Debounced persistence ---

  const flushPersistence = useCallback(() => {
    if (persistTimerRef.current) {
      window.clearTimeout(persistTimerRef.current);
      persistTimerRef.current = 0;
      const doc = documentRef.current;
      if (doc) {
        upsertDocument(doc);
      }
    }
  }, [upsertDocument]);

  const schedulePersistence = useCallback(() => {
    if (persistTimerRef.current) {
      window.clearTimeout(persistTimerRef.current);
    }
    persistTimerRef.current = window.setTimeout(() => {
      persistTimerRef.current = 0;
      const doc = documentRef.current;
      if (doc) {
        upsertDocument(doc);
      }
    }, PERSIST_DEBOUNCE_MS);
  }, [upsertDocument]);

  useEffect(() => {
    return () => {
      if (persistTimerRef.current) {
        window.clearTimeout(persistTimerRef.current);
        const doc = documentRef.current;
        if (doc) {
          upsertDocument(doc);
        }
      }
    };
  }, [upsertDocument]);

  // --- History ---

  const pushHistorySnapshot = useCallback(
    (nextDocument: EditorDocument) => {
      const snapshot = cloneDocument(nextDocument);
      const previousHistory = historyRef.current.slice(
        0,
        historyIndexRef.current + 1,
      );
      const nextHistory = [...previousHistory, snapshot].slice(
        -MAX_HISTORY_ITEMS,
      );
      const nextIndex = nextHistory.length - 1;

      historyRef.current = nextHistory;
      historyIndexRef.current = nextIndex;
      setHistory(nextHistory);
      setHistoryIndex(nextIndex);
    },
    [],
  );

  const loadDocument = useCallback(
    (
      nextDocument: EditorDocument,
      options?: { pushHistory?: boolean },
    ) => {
      flushPersistence();
      const snapshot = cloneDocument(nextDocument);
      documentRef.current = snapshot;
      setDocument(snapshot);
      setSelectedPathId(snapshot.paths[0]?.id ?? null);

      if (options?.pushHistory === false) {
        historyRef.current = [cloneDocument(snapshot)];
        historyIndexRef.current = 0;
        setHistory([cloneDocument(snapshot)]);
        setHistoryIndex(0);
        return;
      }

      pushHistorySnapshot(snapshot);
    },
    [flushPersistence, pushHistorySnapshot],
  );

  // Hydration: load document when selected asset changes
  useEffect(() => {
    if (!hasHydrated || !effectiveSelectedAssetId) return;

    const nextDocument =
      persistedDocument ??
      (() => {
        const asset = assetMap.get(effectiveSelectedAssetId);
        return asset ? documentFromAsset(asset) : null;
      })();

    if (!nextDocument) return;
    if (areEditorDocumentsEqual(documentRef.current, nextDocument)) return;

    skipNextRevision.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDocument(nextDocument, { pushHistory: false });
  }, [
    assetMap,
    effectiveSelectedAssetId,
    hasHydrated,
    loadDocument,
    persistedDocument,
  ]);

  // Debounced persistence on document change
  useEffect(() => {
    if (!hasHydrated || !document) return;
    schedulePersistence();
  }, [document, hasHydrated, schedulePersistence]);

  // Debounced revision push
  useEffect(() => {
    if (!document) return;
    if (skipNextRevision.current) {
      skipNextRevision.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      pushRevision(cloneDocument(document));
    }, 700);
    return () => window.clearTimeout(timer);
  }, [document, pushRevision]);

  // --- Document mutations ---

  const replaceDocument = useCallback(
    (
      nextDocument: EditorDocument,
      options?: { pushHistory?: boolean },
    ) => {
      if (areEditorDocumentsEqual(documentRef.current, nextDocument)) return;

      const snapshot = cloneDocument(nextDocument);
      documentRef.current = snapshot;
      setDocument(snapshot);

      if (options?.pushHistory !== false) {
        pushHistorySnapshot(snapshot);
      }
    },
    [pushHistorySnapshot],
  );

  const updateDocument = useCallback(
    (
      updater: (previous: EditorDocument) => EditorDocument,
      options?: { pushHistory?: boolean },
    ) => {
      const currentDocument = documentRef.current;
      if (!currentDocument) return;

      const nextDocument = updater(cloneDocument(currentDocument));
      replaceDocument(nextDocument, options);
    },
    [replaceDocument],
  );

  const updatePath = useCallback(
    (
      pathId: string,
      updater: (path: EditorIconPath) => EditorIconPath,
      options?: { pushHistory?: boolean },
    ) => {
      updateDocument(
        (previous) => ({
          ...previous,
          paths: previous.paths.map((path) =>
            path.id === pathId ? updater(path) : path,
          ),
        }),
        options,
      );
    },
    [updateDocument],
  );

  const updateSelectedPath = useCallback(
    (
      updater: (path: EditorIconPath) => EditorIconPath,
      options?: { pushHistory?: boolean },
    ) => {
      if (!selectedPathId) return;
      updatePath(selectedPathId, updater, options);
    },
    [selectedPathId, updatePath],
  );

  const togglePathVisibility = useCallback(
    (pathId: string) => {
      updatePath(pathId, (path) => ({ ...path, visible: !path.visible }));
    },
    [updatePath],
  );

  const movePath = useCallback(
    (pathId: string, direction: "up" | "down") => {
      updateDocument((previous) => {
        const currentIndex = previous.paths.findIndex(
          (path) => path.id === pathId,
        );
        if (currentIndex === -1) return previous;

        const targetIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= previous.paths.length)
          return previous;

        const nextPaths = [...previous.paths];
        const [movedPath] = nextPaths.splice(currentIndex, 1);
        nextPaths.splice(targetIndex, 0, movedPath);

        return { ...previous, paths: nextPaths };
      });
    },
    [updateDocument],
  );

  const addPath = useCallback(
    (pathData: string) => {
      const nextPathId = `${documentRef.current?.assetId ?? "editor"}-path-${Date.now()}`;
      updateDocument((previous) => ({
        ...previous,
        paths: [
          ...previous.paths,
          {
            id: nextPathId,
            d: pathData,
            fill: "none",
            stroke: previous.paths[0]?.stroke ?? "#000000",
            strokeWidth: previous.paths[0]?.strokeWidth ?? 1.5,
            strokeLinecap: previous.paths[0]?.strokeLinecap ?? "round",
            strokeLinejoin: previous.paths[0]?.strokeLinejoin ?? "round",
            visible: true,
            sourceTag: "path" as const,
          },
        ],
      }));
      setSelectedPathId(nextPathId);
    },
    [updateDocument],
  );

  const removeSelectedPath = useCallback(() => {
    if (!selectedPathId) return;
    updateDocument((previous) => {
      const nextPaths = previous.paths.filter(
        (path) => path.id !== selectedPathId,
      );
      setSelectedPathId(nextPaths[0]?.id ?? null);
      return { ...previous, paths: nextPaths };
    });
  }, [selectedPathId, updateDocument]);

  const commitPathDraft = useCallback(
    (pathId: string, d: string) => {
      updatePath(pathId, (path) => ({ ...path, d }), {
        pushHistory: true,
      });
    },
    [updatePath],
  );

  const resetCurrentAsset = useCallback(() => {
    if (!selectedAsset) return;
    flushPersistence();
    removeDocument(selectedAsset.id);
    skipNextRevision.current = true;
    loadDocument(documentFromAsset(selectedAsset), { pushHistory: false });
  }, [flushPersistence, loadDocument, removeDocument, selectedAsset]);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;

    const nextIndex = historyIndexRef.current - 1;
    const nextDocument = cloneDocument(historyRef.current[nextIndex]);
    historyIndexRef.current = nextIndex;
    documentRef.current = nextDocument;
    setHistoryIndex(nextIndex);
    setDocument(nextDocument);
    setSelectedPathId((current) =>
      nextDocument.paths.some((path) => path.id === current)
        ? current
        : nextDocument.paths[0]?.id ?? null,
    );
    skipNextRevision.current = true;
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;

    const nextIndex = historyIndexRef.current + 1;
    const nextDocument = cloneDocument(historyRef.current[nextIndex]);
    historyIndexRef.current = nextIndex;
    documentRef.current = nextDocument;
    setHistoryIndex(nextIndex);
    setDocument(nextDocument);
    setSelectedPathId((current) =>
      nextDocument.paths.some((path) => path.id === current)
        ? current
        : nextDocument.paths[0]?.id ?? null,
    );
    skipNextRevision.current = true;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditableKeyboardTarget(event.target)) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();

        if (event.shiftKey) {
          handleRedo();
          return;
        }

        handleUndo();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRedo, handleUndo]);

  const saveCurrentAsset = useCallback(
    (name: string) => {
      if (!document) return;
      flushPersistence();
      saveAsset(name, document);
    },
    [document, flushPersistence, saveAsset],
  );

  const openSavedAsset = useCallback(
    (savedAsset: EditorSavedAsset | EditorRevision) => {
      flushPersistence();
      upsertDocument(savedAsset);
      updateTrayInStore(
        savedAsset.assetId,
        useEditorSelectionStore.getState().trayAssetIds,
      );
      skipNextRevision.current = true;
      loadDocument(savedAsset, { pushHistory: false });
    },
    [flushPersistence, loadDocument, upsertDocument],
  );

  const removeAssetFromTray = useCallback(
    (assetId: string) => {
      removeFromTrayInStore(assetId, assets[0]?.id ?? null);
    },
    [assets],
  );

  const isModified = useMemo(() => {
    if (!document || !selectedAsset) return false;
    return !areEditorDocumentsEqual(document, documentFromAsset(selectedAsset));
  }, [document, selectedAsset]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    document,
    selectedAssetId: effectiveSelectedAssetId,
    trayAssets,
    selectedPath,
    selectedPathId,
    setSelectedPathId,
    updateSelectedPath,
    commitPathDraft,
    togglePathVisibility,
    movePath,
    addPath,
    removeSelectedPath,
    resetCurrentAsset,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
    isModified,
    savedAssets,
    saveCurrentAsset,
    removeSavedAsset,
    revisions,
    openSavedAsset,
    saveDialogOpen,
    setSaveDialogOpen,
    removeAssetFromTray,
  };
}
