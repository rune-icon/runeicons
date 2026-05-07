"use client";

import { CustomizationState, IconData } from "@/lib/types";
import { PreviewArea } from "./components/PreviewArea";
import { SvgDefinitions } from "./components/SvgDefinitions";
import { WorkspaceActionBar } from "./components/WorkspaceActionBar";
import { AnimationPopBar } from "./components/AnimationPopBar";

export interface WorkspacePanelProps {
  state: CustomizationState;
  trayIcons: IconData[];
  selectedIcon: IconData | null;
  onSelectIcon: (icon: IconData) => void;
  onRemoveFromTray: (iconName: string) => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onChange: (updates: Partial<CustomizationState>) => void;
  showGrid: boolean;
  onGridToggle: () => void;
}

export function WorkspacePanel({
  state,
  trayIcons,
  selectedIcon,
  onSelectIcon,
  onRemoveFromTray,
  onReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onChange,
  showGrid,
  onGridToggle,
}: WorkspacePanelProps) {
  return (
    <>
      <SvgDefinitions state={state} />
      <main
        className="flex-1 flex flex-col relative overflow-hidden"
        aria-label="Preview area"
      >
        <PreviewArea
          state={state}
          trayIcons={trayIcons}
          selectedIcon={selectedIcon}
          onSelectIcon={onSelectIcon}
          onRemoveFromTray={onRemoveFromTray}
          showGrid={showGrid}
        />

        <div className="absolute left-[546px] top-[731px] z-20">
          <AnimationPopBar />
        </div>

        <div className="absolute bottom-9.5 left-1/2 -translate-x-1/2 z-10">
          <WorkspaceActionBar
            onDownload={() => {}}
            onReset={onReset}
            onCode={() => {}}
            onUndo={onUndo}
            onRedo={onRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            selectedIcon={selectedIcon}
            state={state}
            onChange={onChange}
            showGrid={showGrid}
            onGridToggle={onGridToggle}
          />
        </div>
      </main>
    </>
  );
}
