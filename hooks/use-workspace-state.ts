import { useState, useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useHistory } from "@/hooks/use-history";
import { CustomizationState } from "@/lib/types";
import { DEFAULT_STATE } from "@/constants/workspace";

interface UseWorkspaceStateOptions {
  enableKeyboardShortcuts?: boolean;
}

function createAdaptiveState(theme?: string): CustomizationState {
  const isDark = theme === "dark";
  const adaptiveColor = isDark ? "#ffffff" : "#000000";
  const adaptiveStop = isDark ? "#cccccc" : "#333333";

  return {
    ...DEFAULT_STATE,
    colors: [adaptiveColor],
    gradient: {
      ...DEFAULT_STATE.gradient,
      stops: [
        { color: adaptiveColor, position: 0 },
        { color: adaptiveStop, position: 100 },
      ],
    },
  };
}

function areStringArraysEqual(a: string[], b: string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function areGradientStopsEqual(
  a: CustomizationState["gradient"]["stops"],
  b: CustomizationState["gradient"]["stops"],
) {
  return (
    a.length === b.length &&
    a.every(
      (stop, index) =>
        stop.color === b[index]?.color && stop.position === b[index]?.position,
    )
  );
}

function areGradientsEqual(
  a: CustomizationState["gradient"],
  b: CustomizationState["gradient"],
) {
  return (
    a.type === b.type &&
    a.angle === b.angle &&
    areGradientStopsEqual(a.stops, b.stops)
  );
}

export function useWorkspaceState(
  options: UseWorkspaceStateOptions = {},
) {
  const { enableKeyboardShortcuts = true } = options;
  const { resolvedTheme } = useTheme();
  const [state, setState] = useState<CustomizationState>(DEFAULT_STATE);
  const [hasInitializedTheme, setHasInitializedTheme] = useState(false);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const customIconsRef = useRef<
    Array<{ id: string; name: string; url: string }>
  >([]);
  const lastResolvedThemeRef = useRef<string | undefined>(undefined);

  // History management (undo/redo + keyboard shortcuts)
  const { history, historyIndex, handleUndo, handleRedo, pushState, canUndo, canRedo } =
    useHistory<CustomizationState>(DEFAULT_STATE, {
      maxHistory: 50,
      enableKeyboardShortcuts,
    });

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    if (typeof window === "undefined" || hasLoadedFromStorage) return;

    try {
      const savedState = localStorage.getItem("rune_workspace_state");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      }
    } catch (error) {
      console.error("Failed to load state from storage:", error);
    } finally {
      setHasLoadedFromStorage(true);
    }
  }, [hasLoadedFromStorage]);

  // 2. Save to LocalStorage (Debounced)
  useEffect(() => {
    if (!hasLoadedFromStorage) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("rune_workspace_state", JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state to storage:", error);
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(timeoutId);
  }, [state, hasLoadedFromStorage]);

  // Sync state with history: apply historical state on undo/redo,
  // push user changes to history. Uses a single effect to avoid the race.
  const lastHistoryIndexRef = useRef(historyIndex);
  const lastStateRef = useRef<CustomizationState>(state);
  useEffect(() => {
    // History index changed (undo/redo was triggered) -- apply historical state
    if (historyIndex !== lastHistoryIndexRef.current) {
      lastHistoryIndexRef.current = historyIndex;
      const historicalState = history[historyIndex];
      lastStateRef.current = historicalState;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(historicalState);
      return;
    }

    // State changed from user action -- push to history
    if (state !== lastStateRef.current) {
      pushState(state);
      lastStateRef.current = state;
    }
  }, [historyIndex, history, state, pushState]);

  useEffect(() => {
    customIconsRef.current = state.customIcons;
  }, [state.customIcons]);

  // Adaptive defaults for Dark Mode visibility (only if not loaded from storage)
  useEffect(() => {
    if (resolvedTheme && !hasInitializedTheme && !localStorage.getItem("rune_workspace_state")) {
      const isDark = resolvedTheme === "dark";
      const adaptiveColor = isDark ? "#ffffff" : "#000000";
      const adaptiveStop = isDark ? "#cccccc" : "#333333";

      setState((prev: CustomizationState) => ({
        ...prev,
        colors: [adaptiveColor],
        gradient: {
          ...prev.gradient,
          stops: [
            { color: adaptiveColor, position: 0 },
            { color: adaptiveStop, position: 100 },
          ],
        },
      }));
      setHasInitializedTheme(true);
    }

    const adaptiveState = createAdaptiveState(resolvedTheme);
    const previousTheme = lastResolvedThemeRef.current;
    const previousAdaptiveState = previousTheme
      ? createAdaptiveState(previousTheme)
      : null;
    const currentState = lastStateRef.current;
    const shouldSyncAdaptivePalette =
      !previousAdaptiveState ||
      (areStringArraysEqual(currentState.colors, previousAdaptiveState.colors) &&
        areGradientsEqual(currentState.gradient, previousAdaptiveState.gradient));

    lastResolvedThemeRef.current = resolvedTheme;

    if (!shouldSyncAdaptivePalette) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev: CustomizationState) => ({
      ...prev,
      colors: adaptiveState.colors,
      gradient: adaptiveState.gradient,
    }));
  }, [resolvedTheme]);

  const handleChange = useCallback((updates: Partial<CustomizationState>) => {
    setState((prev: CustomizationState) => ({ ...prev, ...updates }));
  }, []);

  const handleReset = useCallback(() => {
    setState(createAdaptiveState(resolvedTheme));
  }, [resolvedTheme]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      customIconsRef.current.forEach((icon) => {
        if (icon.url.startsWith("blob:")) {
          URL.revokeObjectURL(icon.url);
        }
      });
    };
  }, []);

  return {
    state,
    handleChange,
    handleReset,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
  };
}
