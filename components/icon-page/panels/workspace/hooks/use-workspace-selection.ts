"use client";

import { useWorkspaceSelectionStore } from "@/stores/use-workspace-selection-store";

export function useWorkspaceSelection() {
  return useWorkspaceSelectionStore();
}
