"use client";

import { useWorkspaceState } from "@/hooks/use-workspace-state";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { IconLibraryPanel } from "@/components/icon-page/panels/icon-library";
import { ToolRail } from "@/components/icon-page/panels/outline";
import { PropertiesPanel } from "@/components/icon-page/panels/properties";
import { WorkspacePanel } from "./WorkspacePanel";
import { useWorkspaceSelection } from "./hooks/use-workspace-selection";
import { KeyboardShortcutsModal } from "@/components/icon-page/keyboard-shortcuts-modal";
import { generateStandaloneSvg } from "@/lib/svg-export-utils";
import { toast } from "sonner";
import { useState } from "react";

export function WorkspaceShell() {
  const {
    state,
    handleChange,
    handleReset,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
  } = useWorkspaceState();

  const {
    activeCategory,
    setActiveCategory,
    selectedIcon,
    trayIcons,
    handleIconSelect,
    handleRemoveFromTray,
  } = useWorkspaceSelection();

  const [showGrid, setShowGrid] = useState(true);

  // Export handler
  const handleExport = () => {
    const configJSON = JSON.stringify(state, null, 2);
    const blob = new Blob([configJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customization-${Date.now()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Configuration exported");
  };

  // Copy SVG handler
  const handleCopySvg = async () => {
    if (!selectedIcon) {
      toast.error("Select an icon first");
      return;
    }
    try {
      const svg = generateStandaloneSvg(selectedIcon, state);
      await navigator.clipboard.writeText(svg);
      toast.success("SVG copied to clipboard");
    } catch {
      toast.error("Failed to copy SVG");
    }
  };

  // Keyboard shortcuts
  const { showHelp, setShowHelp } = useKeyboardShortcuts({
    onCopySvg: handleCopySvg,
    onExport: handleExport,
    onReset: handleReset,
    onSelectTraySlot: (index) => {
      if (trayIcons[index]) {
        handleIconSelect(trayIcons[index]);
        toast.success(`Selected ${trayIcons[index].name}`);
      }
    },
    trayIcons,
    canCopy: !!selectedIcon,
  });

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-12 shrink-0" aria-label="Tool rail">
        <ToolRail
          activeType={state.iconType}
          onTypeChange={(type) => handleChange({ iconType: type })}
        />
      </aside>

      <aside className="w-[320px] shrink-0" aria-label="Icon library">
        <IconLibraryPanel
          onIconSelect={handleIconSelect}
          selectedIconId={selectedIcon?.id ?? null}
          selectedCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </aside>

      <WorkspacePanel
        state={state}
        trayIcons={trayIcons}
        selectedIcon={selectedIcon}
        onSelectIcon={handleIconSelect}
        onRemoveFromTray={handleRemoveFromTray}
        onReset={handleReset}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        onChange={handleChange}
        showGrid={showGrid}
        onGridToggle={() => setShowGrid(!showGrid)}
      />

      <aside
        className="w-[380px] shrink-0 border-l border-border bg-workspace-pattern overflow-y-auto relative"
        aria-label="Customization controls"
      >
        <div className="absolute inset-0 bg-background/80 pointer-events-none" />
        <div className="relative z-10">
          <PropertiesPanel
            state={state}
            onChange={handleChange}
            onReset={handleReset}
          />
        </div>
      </aside>

      <KeyboardShortcutsModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
}
