"use client";

import { useWorkspaceState } from "@/hooks/use-workspace-state";
import { IconLibraryPanel } from "@/components/icon-page/panels/icon-library";
import { ToolRail } from "@/components/icon-page/panels/outline";
import { PropertiesPanel } from "@/components/icon-page/panels/properties";
import { WorkspacePanel } from "./WorkspacePanel";
import { useWorkspaceSelection } from "./hooks/use-workspace-selection";

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
    </div>
  );
}
