import { useCallback } from "react";
import { toast } from "sonner";
import { CustomizationState } from "@/lib/types";

export function useConfigPersistence(
  state: CustomizationState,
  onChange: (updates: Partial<CustomizationState>) => void
) {
  const handleExport = useCallback(() => {
    try {
      const configJSON = JSON.stringify(state, null, 2);
      const blob = new Blob([configJSON], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const now = new Date();
      const timestamp = now.toISOString()
        .replace(/T/, "_")
        .replace(/\..+/, "")
        .replace(/:/g, "-");
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `runeiconcustomization-${timestamp}.json`;
      a.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Configuration exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export configuration");
    }
  }, [state]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const importedState = JSON.parse(content);
          
          // Basic validation (check if it looks like our state)
          if (importedState && typeof importedState === 'object' && ('colors' in importedState || 'shadow' in importedState)) {
            onChange(importedState);
            toast.success("Configuration imported successfully");
          } else {
            toast.error("Invalid configuration file");
          }
        } catch (error) {
          console.error("Import failed:", error);
          toast.error("Failed to parse configuration file");
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }, [onChange]);

  return { handleExport, handleImport };
}
