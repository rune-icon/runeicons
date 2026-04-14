"use client";

import { useWorkspaceSelectionStore } from "@/stores/workspace-selection";

export function useWorkspaceSelection() {
  return useWorkspaceSelectionStore();
}
