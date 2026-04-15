"use client";

import { memo, useMemo, useState } from "react";
import {
  History,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  EditorDocument,
  EditorIconPath,
  EditorRevision,
  EditorSavedAsset,
} from "@/lib/editor/types";
import { cn } from "@/lib/utils";
import { EditorSvgPreview } from "@/components/editor/EditorSvgPreview";
import { formatRelativeTimestamp } from "../../lib/editor/relative-time";

type DockTab = "style" | "saved" | "revisions";

interface EditorWorkspaceDockProps {
  document: EditorDocument | null;
  selectedPath: EditorIconPath | null;
  selectedPathId: string | null;
  onUpdateSelectedPath: (
    updater: (path: EditorIconPath) => EditorIconPath,
    options?: { pushHistory?: boolean },
  ) => void;
  onRemoveSelectedPath: () => void;
  onOpenSaveDialog: () => void;
  savedAssets: EditorSavedAsset[];
  revisions: EditorRevision[];
  onOpenSnapshot: (asset: EditorSavedAsset | EditorRevision) => void;
  onRemoveSavedAsset: (id: string) => void;
}

interface SelectedPathStylePanelProps {
  selectedPath: EditorIconPath;
  onUpdateSelectedPath: (
    updater: (path: EditorIconPath) => EditorIconPath,
    options?: { pushHistory?: boolean },
  ) => void;
  onRemoveSelectedPath: () => void;
}

interface PathDraftState {
  pathId: string;
  sourcePath: string;
  value: string;
}

function SelectedPathStylePanel({
  selectedPath,
  onUpdateSelectedPath,
  onRemoveSelectedPath,
}: SelectedPathStylePanelProps) {
  const [pathDraft, setPathDraft] = useState<PathDraftState>(() => ({
    pathId: selectedPath.id,
    sourcePath: selectedPath.d,
    value: selectedPath.d,
  }));

  const effectivePathDraft =
    pathDraft.pathId !== selectedPath.id ||
    (pathDraft.sourcePath !== selectedPath.d && pathDraft.value === pathDraft.sourcePath)
      ? {
          pathId: selectedPath.id,
          sourcePath: selectedPath.d,
          value: selectedPath.d,
        }
      : pathDraft;

  const selectedStroke =
    selectedPath.stroke && selectedPath.stroke !== "none"
      ? selectedPath.stroke
      : "#000000";
  const selectedFill =
    selectedPath.fill && selectedPath.fill !== "none"
      ? selectedPath.fill
      : "#000000";

  const handleApplyPathData = () => {
    const trimmedValue = effectivePathDraft.value.trim();
    if (!trimmedValue) {
      return;
    }

    setPathDraft({
      pathId: selectedPath.id,
      sourcePath: trimmedValue,
      value: trimmedValue,
    });
    onUpdateSelectedPath(
      (path) => ({
        ...path,
        d: trimmedValue,
      }),
      { pushHistory: true },
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border p-3 bg-card space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Selected Path</p>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={onRemoveSelectedPath}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label htmlFor="dock-stroke" className="space-y-1 text-xs text-muted-foreground">
            Stroke
            <Input
              id="dock-stroke"
              type="color"
              value={selectedStroke}
              onChange={(event) =>
                onUpdateSelectedPath((path) => ({
                  ...path,
                  stroke: event.target.value,
                }))
              }
              className="h-10 p-1"
            />
          </label>
          <label htmlFor="dock-fill" className="space-y-1 text-xs text-muted-foreground">
            Fill
            <Input
              id="dock-fill"
              type="color"
              value={selectedFill}
              onChange={(event) =>
                onUpdateSelectedPath((path) => ({
                  ...path,
                  fill: event.target.value,
                }))
              }
              className="h-10 p-1"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label htmlFor="dock-stroke-width" className="space-y-1 text-xs text-muted-foreground">
            Stroke Width
            <Input
              id="dock-stroke-width"
              type="number"
              min={0}
              step={0.1}
              value={selectedPath.strokeWidth ?? 1.5}
              onChange={(event) =>
                onUpdateSelectedPath((path) => ({
                  ...path,
                  strokeWidth: Number.parseFloat(event.target.value) || 0,
                }))
              }
            />
          </label>
          <label htmlFor="dock-opacity" className="space-y-1 text-xs text-muted-foreground">
            Opacity
            <Input
              id="dock-opacity"
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={selectedPath.opacity ?? 1}
              onChange={(event) =>
                onUpdateSelectedPath((path) => ({
                  ...path,
                  opacity: Number.parseFloat(event.target.value) || 0,
                }))
              }
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-border p-3 bg-card space-y-3">
        <p className="text-sm font-medium">Raw Path Data</p>
        <Textarea
          value={effectivePathDraft.value}
          onChange={(event) =>
            setPathDraft({
              ...effectivePathDraft,
              value: event.target.value,
            })
          }
          rows={7}
        />
        <Button
          onClick={handleApplyPathData}
          disabled={
            !effectivePathDraft.value.trim() ||
            effectivePathDraft.value.trim() === selectedPath.d
          }
        >
          Apply Path Data
        </Button>
      </div>
    </div>
  );
}

export const EditorWorkspaceDock = memo(function EditorWorkspaceDock({
  document,
  selectedPath,
  selectedPathId,
  onUpdateSelectedPath,
  onRemoveSelectedPath,
  onOpenSaveDialog,
  savedAssets,
  revisions,
  onOpenSnapshot,
  onRemoveSavedAsset,
}: EditorWorkspaceDockProps) {
  const [activeTab, setActiveTab] = useState<DockTab>("style");

  const tabButtons = useMemo(
    () => [
      { id: "style" as const, label: "Style", icon: Sparkles },
      { id: "saved" as const, label: "Saved", icon: Save },
      { id: "revisions" as const, label: "History", icon: History },
    ],
    [],
  );

  return (
    <div className="absolute top-4 right-4 bottom-4 z-20 w-[320px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="border-b border-border px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">Editor Dock</p>
            <p className="text-xs text-muted-foreground">
              Click a path on the canvas to select &amp; edit it
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onOpenSaveDialog}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        <div className="mt-3 flex gap-1 rounded-lg border bg-muted/20 p-1">
          {tabButtons.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 rounded-md px-2 py-2 text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[calc(100%-104px)] overflow-y-auto px-3 py-3 space-y-4">
        {activeTab === "style" ? (
          selectedPath ? (
            <SelectedPathStylePanel
              selectedPath={selectedPath}
              onUpdateSelectedPath={onUpdateSelectedPath}
              onRemoveSelectedPath={onRemoveSelectedPath}
            />
          ) : (
            <div className="rounded-xl border border-border p-4 bg-card text-sm text-muted-foreground">
              Click a path on the canvas to select it and edit its style.
            </div>
          )
        ) : null}

        {activeTab === "saved" ? (
          <div className="space-y-3">
            {savedAssets.length === 0 ? (
              <div className="rounded-xl border border-border p-4 bg-card text-sm text-muted-foreground">
                No saved snapshots yet.
              </div>
            ) : null}

            {savedAssets.map((savedAsset) => (
              <div
                key={savedAsset.id}
                className="rounded-xl border border-border bg-card p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 shrink-0 rounded-lg border border-border bg-background p-2">
                    <EditorSvgPreview document={savedAsset} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{savedAsset.savedName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {savedAsset.name} • {savedAsset.categoryLabel}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Updated {formatRelativeTimestamp(savedAsset.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => onOpenSnapshot(savedAsset)}>
                    Load
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveSavedAsset(savedAsset.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === "revisions" ? (
          <div className="space-y-3">
            {revisions.length === 0 ? (
              <div className="rounded-xl border border-border p-4 bg-card text-sm text-muted-foreground">
                No revision history yet.
              </div>
            ) : null}

            {revisions.map((revision) => (
              <button
                key={revision.id}
                type="button"
                onClick={() => onOpenSnapshot(revision)}
                className="w-full rounded-xl border border-border bg-card p-3 text-left hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 shrink-0 rounded-lg border border-border bg-background p-2">
                    <EditorSvgPreview document={revision} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{revision.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {revision.categoryLabel}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {formatRelativeTimestamp(revision.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
});
