import { useCallback } from "react";
import { toast } from "sonner";
import { CustomizationState } from "@/lib/types";

export function useExportCustomization(state: CustomizationState) {
  const handleExport = useCallback(() => {
    const configJSON = JSON.stringify(state, null, 2);
    const blob = new Blob([configJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customization-${Date.now()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Configuration exported");
  }, [state]);

  return { handleExport };
}
