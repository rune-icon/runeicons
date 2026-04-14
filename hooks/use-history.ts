"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UseHistoryOptions {
  maxHistory?: number;
}

interface UseHistoryReturn<T> {
  history: T[];
  historyIndex: number;
  handleUndo: () => void;
  handleRedo: () => void;
  pushState: (newState: T) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useHistory<T>(
  initialState: T,
  options: UseHistoryOptions = {},
): UseHistoryReturn<T> {
  const { maxHistory = 50 } = options;

  const [history, setHistory] = useState<T[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoRef = useRef(false);
  const historyIndexRef = useRef(0);
  const historyRef = useRef<T[]>([initialState]);

  // Keep refs in sync with state
  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const pushState = useCallback(
    (newState: T) => {
      if (isUndoRedoRef.current) {
        isUndoRedoRef.current = false;
        return;
      }

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndexRef.current + 1);
        newHistory.push(newState);
        return newHistory.slice(-maxHistory);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, maxHistory - 1));
    },
    [maxHistory],
  );

  // Stable callbacks using refs -- no dependencies on state, never recreated
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      isUndoRedoRef.current = true;
      setHistoryIndex((prev) => prev - 1);
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      isUndoRedoRef.current = true;
      setHistoryIndex((prev) => prev + 1);
    }
  }, []);

  // Keyboard shortcuts: Ctrl+Z / Ctrl+Y -- stable, never re-attaches
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isZ = e.key.toLowerCase() === "z";
      const isY = e.key.toLowerCase() === "y";
      const hasMod = e.metaKey || e.ctrlKey;

      if (hasMod && isZ) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (hasMod && isY) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  return {
    history,
    historyIndex,
    handleUndo,
    handleRedo,
    pushState,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}
