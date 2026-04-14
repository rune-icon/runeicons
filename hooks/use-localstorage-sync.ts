"use client";

import { useEffect } from "react";
import { useEditorEditsStore } from "@/stores/use-editor-edits-store";
import { useEditorSavedAssetsStore } from "@/stores/use-editor-saved-assets-store";
import { useEditorRevisionsStore } from "@/stores/use-editor-revisions-store";

const STORE_KEYS = [
  "runeicons-editor-edits",
  "runeicons-editor-saved-assets",
  "runeicons-editor-revisions",
] as const;

function resetStoreByKey(key: string) {
  switch (key) {
    case "runeicons-editor-edits":
      useEditorEditsStore.setState({ documents: {} });
      break;
    case "runeicons-editor-saved-assets":
      useEditorSavedAssetsStore.setState({ savedAssets: [] });
      break;
    case "runeicons-editor-revisions":
      useEditorRevisionsStore.setState({ revisions: [] });
      break;
  }
}

function resetAllStores() {
  for (const key of STORE_KEYS) {
    resetStoreByKey(key);
  }
}

export function useLocalStorageSyncEffect() {
  useEffect(() => {
    // Cross-tab: fires when another tab modifies localStorage
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null) {
        // localStorage.clear() was called
        resetAllStores();
        return;
      }
      if (
        (STORE_KEYS as readonly string[]).includes(event.key) &&
        event.newValue === null
      ) {
        resetStoreByKey(event.key);
      }
    };

    // Same-tab: detect devtools clearing on tab re-focus
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      for (const key of STORE_KEYS) {
        if (localStorage.getItem(key) === null) {
          resetStoreByKey(key);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
}
