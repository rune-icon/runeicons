"use client";

import { useCallback, useMemo } from "react";

import { EASING_PRESETS } from "@/lib/editor/animation-engine";
import { computeTotalDuration } from "@/lib/editor/path-animation";
import {
  FEEL_PRESETS,
  getPresetsByInteractionMode,
  type MotionPreset,
} from "@/lib/editor/motion-presets";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Scrubber } from "@/components/ui/scrubber";

import type { CustomizationSectionProps } from "../types";
import type { PathAnimationOverride } from "@/lib/types";
import { BezierEditor } from "./bezier-editor";
import { Section } from "../components/Section";

type EasingId = (typeof EASING_PRESETS)[number]["id"];

const EASING_QUICK = EASING_PRESETS.filter((e) => e.id !== "linear" && e.id !== "ease-in" && e.id !== "back-in" && e.id !== "custom");

const INTERACTION_MODES = [
  { id: "animate", label: "Animate" },
  { id: "hover", label: "Hover" },
  { id: "loading", label: "Loading" },
  { id: "success", label: "Success" },
  { id: "error", label: "Error" },
] as const;

type InteractionMode = (typeof INTERACTION_MODES)[number]["id"];

const MODE_DEFAULTS: Record<InteractionMode, Partial<{ loop: boolean; trigger: PathAnimationOverride["trigger"]; animationType: string }>> = {
  animate: { loop: false, trigger: "auto" },
  hover: { loop: false, trigger: "hover" },
  loading: { loop: true, trigger: "auto" },
  success: { loop: false, trigger: "once", animationType: "draw" },
  error: { loop: false, trigger: "once", animationType: "shake" },
};

function pathColor(i: number): string {
  return `hsl(${(i * 137) % 360}deg 65% 55%)`;
}

function Toggle({
  value,
  onChange,
  size = "md",
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const knob = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const on = size === "sm" ? "translate-x-[18px]" : "translate-x-5";
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn("relative flex-shrink-0 rounded-full transition-colors duration-200", h, value ? "bg-primary" : "bg-muted")}
      role="switch"
      aria-checked={value}
    >
      <span className={cn("absolute top-0.5 rounded-full bg-white shadow transition-transform duration-200", knob, value ? on : "translate-x-0.5")} />
    </button>
  );
}

export function MotionSection({ state, onChange, pathCount = 0 }: CustomizationSectionProps) {
  const motionState = state.motion;
  const isEnabled = motionState?.enabled ?? false;
  const selectedPathIdx = motionState?.selectedPathIndex ?? -1;
  const perPathOverrides = (motionState?.perPathAnimations ?? {}) as Record<string, PathAnimationOverride>;
  const isPaused = motionState?.isPaused ?? false;
  const scrubProgress = motionState?.scrubProgress ?? null;
  const interactionMode = (motionState?.interactionMode ?? "animate") as InteractionMode;
  const isPathAnim = (motionState?.animationType ?? "draw") === "draw" || motionState?.animationType === "stroke";

  const buildMotionState = useCallback(
    (updates: Partial<typeof state.motion>) => ({
      enabled: motionState?.enabled ?? false,
      animationType: motionState?.animationType ?? "draw",
      duration: motionState?.duration ?? 2,
      delay: motionState?.delay ?? 0.12,
      easingId: motionState?.easingId ?? "ease-in-out",
      customCubic: motionState?.customCubic ?? "cubic-bezier(0.34, 1.56, 0.64, 1)",
      loop: motionState?.loop ?? true,
      replayNonce: motionState?.replayNonce ?? 0,
      pathTrimStart: motionState?.pathTrimStart ?? 0,
      pathTrimEnd: motionState?.pathTrimEnd ?? 100,
      pathSequential: motionState?.pathSequential ?? false,
      pathStaggerDelay: motionState?.pathStaggerDelay ?? 0.12,
      pathReverse: motionState?.pathReverse ?? false,
      selectedPathIndex: motionState?.selectedPathIndex ?? -1,
      perPathAnimations: (motionState?.perPathAnimations ?? {}) as Record<string, PathAnimationOverride>,
      isPaused: motionState?.isPaused ?? false,
      scrubProgress: motionState?.scrubProgress ?? null,
      presetId: motionState?.presetId ?? null,
      interactionMode: (motionState?.interactionMode ?? "animate") as InteractionMode,
      trigger: (motionState?.trigger ?? "auto") as "auto" | "hover" | "click" | "once",
      autoReverse: motionState?.autoReverse ?? false,
      ...updates,
    }),
    [motionState],
  );

  const handleGlobalChange = (updates: Partial<typeof state.motion>) => {
    onChange({ motion: buildMotionState(updates) });
  };

  const handlePathSelect = (index: number) => {
    handleGlobalChange({ selectedPathIndex: index });
  };

  const applyPreset = (preset: MotionPreset) => {
    const modeDefaults = MODE_DEFAULTS[preset.interactionMode] ?? {};
    const perPath = preset.buildPerPath?.(pathCount) ?? {};
    handleGlobalChange({
      ...preset.config,
      ...modeDefaults,
      presetId: preset.id,
      interactionMode: preset.interactionMode,
      perPathAnimations: perPath,
      selectedPathIndex: -1,
      isPaused: false,
      scrubProgress: null,
      replayNonce: (motionState?.replayNonce ?? 0) + 1,
    });
  };

  const handleInteractionModeChange = (mode: InteractionMode) => {
    const defaults = MODE_DEFAULTS[mode];
    handleGlobalChange({
      interactionMode: mode,
      ...defaults,
      presetId: null,
    });
  };

  const handleOverrideEnable = (index: number, enabled: boolean) => {
    const nextOverrides = { ...perPathOverrides };
    if (enabled) {
      const staggeredDelay = motionState?.pathSequential
        ? (motionState?.delay ?? 0) + index * (motionState?.pathStaggerDelay ?? 0.12)
        : (motionState?.delay ?? 0);
      nextOverrides[String(index)] = {
        enabled: true,
        animationType: motionState?.animationType ?? "draw",
        duration: motionState?.duration ?? 2,
        delay: staggeredDelay,
        easingId: motionState?.easingId ?? "ease-in-out",
        pathTrimStart: motionState?.pathTrimStart ?? 0,
        pathTrimEnd: motionState?.pathTrimEnd ?? 100,
        pathReverse: motionState?.pathReverse ?? false,
      };
    } else {
      delete nextOverrides[String(index)];
    }
    handleGlobalChange({ perPathAnimations: nextOverrides });
  };

  const handlePathOverrideUpdate = (index: number, updates: Partial<PathAnimationOverride>) => {
    const nextOverrides = { ...perPathOverrides };
    if (nextOverrides[String(index)]) {
      nextOverrides[String(index)] = { ...nextOverrides[String(index)], ...updates };
      handleGlobalChange({ perPathAnimations: nextOverrides });
    }
  };

  const handlePathVisibility = (index: number) => {
    const nextOverrides = { ...perPathOverrides };
    const existing = nextOverrides[String(index)] ?? {};
    nextOverrides[String(index)] = { ...existing, enabled: true, hidden: !existing.hidden };
    handleGlobalChange({ perPathAnimations: nextOverrides });
  };

  const activeOverride = selectedPathIdx >= 0 ? (perPathOverrides[String(selectedPathIdx)] ?? null) : null;

  const totalDuration = useMemo(() => {
    if (pathCount === 0) return motionState?.duration ?? 2;
    return computeTotalDuration(pathCount, state);
  }, [pathCount, state]);

  const pathTimings = useMemo(() => {
    if (!isPathAnim || pathCount === 0 || totalDuration <= 0) return [];
    return Array.from({ length: pathCount }, (_, i) => {
      const override = perPathOverrides[String(i)] || {};
      const duration = override.duration ?? (motionState?.duration ?? 2);
      const staggeredDelay = motionState?.pathSequential
        ? (motionState?.delay ?? 0) + i * (motionState?.pathStaggerDelay ?? 0.12)
        : (motionState?.delay ?? 0);
      const delay = override.delay ?? staggeredDelay;
      return {
        delay,
        duration,
        leftPct: (delay / totalDuration) * 100,
        widthPct: (duration / totalDuration) * 100,
        hasOverride: !!perPathOverrides[String(i)],
        hidden: !!(perPathOverrides[String(i)]?.hidden),
      };
    });
  }, [isPathAnim, pathCount, perPathOverrides, motionState, totalDuration]);

  const currentEasingId = (motionState?.easingId ?? "ease-in-out") as EasingId;
  const isCustomEasing = currentEasingId === "custom";

  const modePresets = useMemo(
    () => getPresetsByInteractionMode(interactionMode),
    [interactionMode],
  );

  return (
    <Section
      title="Motion"
      headerAction={
        <Toggle value={isEnabled} onChange={(v) => handleGlobalChange({ enabled: v })} size="sm" />
      }
    >
      <style>{`
        .motion-preview-bounce { animation-name: motion-preview-bounce; }
        .motion-preview-shake { animation-name: motion-preview-shake; }
        .motion-preview-jump { animation-name: motion-preview-jump; }
        .motion-preview-line-base { stroke-dasharray: 1; stroke-dashoffset: 1; }
        .motion-preview-line-draw { animation: motion-preview-line-draw 1.2s ease-in-out infinite both; }
        @keyframes motion-preview-bounce { 0%, 100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-7px) scale(0.95,1.05); } 60% { transform: translateY(0) scale(1.05,0.95); } }
        @keyframes motion-preview-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
        @keyframes motion-preview-jump { 0%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } }
        @keyframes motion-preview-line-draw { 0% { stroke-dashoffset: 1; opacity: 0.2; } 70% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 1; } }
      `}</style>

      <AnimatePresence initial={false}>
        {isEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-1 pb-2">
              <div className="flex items-center gap-1.5">
                <Button variant="secondary" size="sm" className="h-8 flex-1 gap-1.5 text-[10px] uppercase tracking-wider"
                  onClick={() => handleGlobalChange({ replayNonce: (motionState?.replayNonce ?? 0) + 1, isPaused: false, scrubProgress: null })}>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  Play
                </Button>
                <Button variant={isPaused ? "default" : "secondary"} size="sm" className="h-8 flex-1 gap-1.5 text-[10px] uppercase tracking-wider"
                  onClick={() => handleGlobalChange({ isPaused: !isPaused, scrubProgress: null })}>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  {isPaused ? "Resume" : "Pause"}
                </Button>
                <Button variant="secondary" size="sm" className="h-8 flex-1 gap-1.5 text-[10px] uppercase tracking-wider"
                  onClick={() => handleGlobalChange({ replayNonce: (motionState?.replayNonce ?? 0) + 1, isPaused: false, scrubProgress: null, selectedPathIndex: -1 })}>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                  Reset
                </Button>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-medium uppercase tracking-widest text-foreground/40 px-1">Mode</div>
                <div className="flex gap-1 flex-wrap">
                  {INTERACTION_MODES.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleInteractionModeChange(id)}
                      className={cn(
                        "h-7 rounded-md px-2.5 text-[10px] uppercase tracking-tight transition-all",
                        interactionMode === id
                          ? "bg-foreground text-background shadow-sm"
                          : "text-foreground/40 hover:text-foreground hover:bg-muted/20"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {modePresets.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-foreground/40 px-1">Presets</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {modePresets.map((preset) => {
                      const isActive = motionState?.presetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className={cn(
                            "rounded-sm border p-2 text-left transition-all duration-150 active:scale-[0.98]",
                            isActive
                              ? "border-foreground/30 bg-muted/20 text-foreground"
                              : "border-border/40 bg-muted/5 text-foreground/40 hover:border-foreground/20 hover:text-foreground hover:bg-muted/10"
                          )}
                          title={preset.description}
                        >
                          <div className="text-base leading-none mb-1">{preset.icon}</div>
                          <div className="text-[9px] font-medium leading-tight uppercase tracking-tighter">{preset.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="text-[10px] font-medium uppercase tracking-widest text-foreground/40 px-1">Feel</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {FEEL_PRESETS.map((feel) => (
                    <button
                      key={feel.id}
                      type="button"
                      onClick={() => handleGlobalChange({
                        duration: feel.duration,
                        easingId: feel.easingId,
                        pathStaggerDelay: feel.stagger,
                        presetId: null,
                      })}
                      className="h-8 rounded-sm border border-border/40 bg-muted/5 text-[9px] uppercase tracking-tighter text-foreground/40 hover:border-foreground/20 hover:text-foreground hover:bg-muted/10 transition-all"
                    >
                      {feel.label}
                    </button>
                  ))}
                </div>
              </div>

              {isPathAnim && (
                <div className="space-y-1.5 rounded-sm bg-muted/10 border border-border/40 p-2.5 shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] uppercase tracking-widest text-foreground/40">Timeline</span>
                    <span className="text-[10px] text-foreground/30 tabular-nums">
                      {((scrubProgress ?? 0) / 100 * totalDuration).toFixed(1)}s / {totalDuration.toFixed(1)}s
                    </span>
                  </div>
                  <Scrubber
                    label=""
                    value={scrubProgress ?? 0}
                    min={0} max={100} step={0.5}
                    onChange={(v) => handleGlobalChange({ scrubProgress: v === 0 ? null : v, isPaused: v > 0 ? true : isPaused })}
                  />
                  {scrubProgress !== null && (
                    <button type="button" className="text-[9px] uppercase tracking-widest text-primary/60 hover:text-primary transition-colors px-1"
                      onClick={() => handleGlobalChange({ scrubProgress: null, isPaused: false })}>
                      / Resume live
                    </button>
                  )}
                </div>
              )}

              {isPathAnim && pathCount > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-foreground/40 px-1">
                    <span>Paths</span>
                    <span className="lowercase">{pathCount} layers</span>
                  </div>
                  <div className="rounded-sm border border-border/40 overflow-hidden bg-muted/5">
                    <button type="button" onClick={() => handlePathSelect(-1)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all",
                        selectedPathIdx === -1
                          ? "bg-foreground/5 text-foreground"
                          : "text-foreground/40 hover:bg-muted/10 hover:text-foreground"
                      )}>
                      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0 bg-foreground/20" />
                      <span className="text-[10px] uppercase tracking-widest flex-1">Global</span>
                      <span className="text-[9px] opacity-30">all paths</span>
                    </button>

                    {pathTimings.map((timing, i) => (
                      <div key={i}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 border-t border-border/10 transition-all",
                          selectedPathIdx === i ? "bg-foreground/5 text-foreground" : "text-foreground/40 hover:bg-muted/10 hover:text-foreground",
                          timing.hidden && "opacity-40"
                        )}>
                        <button type="button" className="flex items-center gap-2 flex-1 min-w-0" onClick={() => handlePathSelect(i)}>
                          <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: pathColor(i) }} />
                          <span className="text-[10px] font-mono w-6 flex-shrink-0">P{i}</span>
                          <div className="flex-1 h-1 bg-muted/20 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{
                              marginLeft: `${Math.min(timing.leftPct, 90)}%`,
                              width: `${Math.max(timing.widthPct, 8)}%`,
                              background: pathColor(i),
                              opacity: 0.8,
                            }} />
                          </div>
                          {timing.hasOverride && !timing.hidden && <span className="text-[10px] text-primary flex-shrink-0">★</span>}
                        </button>
                        <button type="button" onClick={() => handlePathVisibility(i)}
                          className="flex-shrink-0 text-foreground/20 hover:text-foreground transition-colors p-0.5"
                          title={timing.hidden ? "Show path" : "Hide path"}>
                          {timing.hidden ? (
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPathIdx === -1 ? (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase tracking-widest text-foreground/40 px-1">Type</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["draw", "stroke", "bounce", "shake", "jump"] as const).map((type) => {
                        const isActive = (motionState?.animationType ?? "draw") === type;
                        const label = type.charAt(0).toUpperCase() + type.slice(1);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleGlobalChange({ animationType: type, presetId: null })}
                            className={cn(
                              "h-7 rounded-md text-[10px] uppercase tracking-tight transition-all",
                              isActive
                                ? "bg-foreground text-background shadow-sm"
                                : "text-foreground/40 hover:text-foreground hover:bg-muted/20"
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-widest text-foreground/40 px-1">Easing</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {EASING_QUICK.map((e) => {
                        const isActive = currentEasingId === e.id;
                        return (
                          <button key={e.id} type="button"
                            onClick={() => handleGlobalChange({ easingId: e.id, presetId: null })}
                            className={cn(
                              "h-7 rounded-md px-1 text-[10px] uppercase tracking-tighter transition-all",
                              isActive ? "bg-foreground text-background shadow-sm" : "text-foreground/40 hover:text-foreground hover:bg-muted/20"
                            )}>
                            {e.label}
                          </button>
                        );
                      })}
                      <button type="button"
                        onClick={() => handleGlobalChange({ easingId: "custom", presetId: null })}
                        className={cn(
                          "h-7 rounded-md px-1 text-[10px] uppercase tracking-tighter transition-all",
                          isCustomEasing ? "bg-foreground text-background shadow-sm" : "text-foreground/40 hover:text-foreground hover:bg-muted/20"
                        )}>
                        Custom
                      </button>
                    </div>
                    {isCustomEasing && (
                      <BezierEditor
                        value={motionState?.customCubic ?? "cubic-bezier(0.34, 1.56, 0.64, 1)"}
                        onChange={(v) => handleGlobalChange({ customCubic: v, easingId: "custom", presetId: null })}
                      />
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <Scrubber label="Duration" value={motionState?.duration ?? 2} onChange={(v) => handleGlobalChange({ duration: v, presetId: null })} min={0.1} max={5} step={0.05} />
                    <Scrubber label="Delay" value={motionState?.delay ?? 0} onChange={(v) => handleGlobalChange({ delay: v, presetId: null })} min={0} max={3} step={0.05} />
                  </div>

                  {isPathAnim && (
                    <div className="space-y-2.5 pt-2.5 border-t border-border/40">
                      <Scrubber label="Start" value={motionState?.pathTrimStart ?? 0} onChange={(v) => handleGlobalChange({ pathTrimStart: v })} min={0} max={100} />
                      <Scrubber label="End" value={motionState?.pathTrimEnd ?? 100} onChange={(v) => handleGlobalChange({ pathTrimEnd: v })} min={0} max={100} />
                      <div className="flex items-center justify-between h-[34px] px-1">
                        <span className="text-[10px] uppercase tracking-widest text-foreground/60">Sequential</span>
                        <Toggle size="sm" value={motionState?.pathSequential ?? false} onChange={(v) => handleGlobalChange({ pathSequential: v })} />
                      </div>
                      {motionState?.pathSequential && (
                        <Scrubber label="Stagger" value={motionState?.pathStaggerDelay ?? 0.12} onChange={(v) => handleGlobalChange({ pathStaggerDelay: v })} min={0.01} max={0.5} step={0.01} />
                      )}
                      <div className="flex items-center justify-between h-[34px] px-1">
                        <span className="text-[10px] uppercase tracking-widest text-foreground/60">Reverse</span>
                        <Toggle size="sm" value={motionState?.pathReverse ?? false} onChange={(v) => handleGlobalChange({ pathReverse: v })} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <div className="flex items-center justify-between p-2.5 rounded-sm bg-muted/10 border border-border/40 shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: pathColor(selectedPathIdx) }} />
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-mono" style={{ color: pathColor(selectedPathIdx) }}>Path {selectedPathIdx}</div>
                        <div className="text-[9px] uppercase tracking-tighter opacity-40">{activeOverride ? "Override active" : "Global settings"}</div>
                      </div>
                    </div>
                    <Toggle size="sm" value={!!activeOverride} onChange={(v) => handleOverrideEnable(selectedPathIdx, v)} />
                  </div>

                  {activeOverride ? (
                    <div className="space-y-3.5">
                      <div className="space-y-2.5">
                        <Scrubber label="Delay" value={activeOverride.delay ?? 0} onChange={(v) => handlePathOverrideUpdate(selectedPathIdx, { delay: v })} min={0} max={3} step={0.05} />
                        <Scrubber label="Duration" value={activeOverride.duration ?? (motionState?.duration ?? 2)} onChange={(v) => handlePathOverrideUpdate(selectedPathIdx, { duration: v })} min={0.1} max={5} step={0.1} />
                        {isPathAnim && (
                          <Scrubber label="Progress" value={activeOverride.scrubProgress ?? 0} onChange={(v) => handlePathOverrideUpdate(selectedPathIdx, { scrubProgress: v === 0 ? null : v })} min={0} max={100} step={1} />
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-1.5">
                        {EASING_QUICK.map((e) => {
                          const isActive = (activeOverride.easingId ?? motionState?.easingId) === e.id;
                          return (
                            <button key={e.id} type="button"
                              onClick={() => handlePathOverrideUpdate(selectedPathIdx, { easingId: e.id })}
                              className={cn("h-7 rounded-md text-[10px] uppercase tracking-tighter transition-all",
                                isActive ? "bg-foreground text-background shadow-sm" : "text-foreground/40 hover:text-foreground hover:bg-muted/20")}>
                              {e.label}
                            </button>
                          );
                        })}
                        <button type="button"
                          onClick={() => handlePathOverrideUpdate(selectedPathIdx, { easingId: "custom" })}
                          className={cn("h-7 rounded-md text-[10px] uppercase tracking-tighter transition-all",
                            activeOverride.easingId === "custom" ? "bg-foreground text-background shadow-sm" : "text-foreground/40 hover:text-foreground hover:bg-muted/20")}>
                          Custom
                        </button>
                      </div>
                      {activeOverride.easingId === "custom" && (
                        <BezierEditor
                          value={activeOverride.customCubic ?? "cubic-bezier(0.34, 1.56, 0.64, 1)"}
                          onChange={(v) => handlePathOverrideUpdate(selectedPathIdx, { customCubic: v })}
                        />
                      )}

                      {isPathAnim && (
                        <div className="space-y-2.5 pt-2 border-t border-border/40">
                          <Scrubber label="Start" value={activeOverride.pathTrimStart ?? (motionState?.pathTrimStart ?? 0)} onChange={(v) => handlePathOverrideUpdate(selectedPathIdx, { pathTrimStart: v })} min={0} max={100} />
                          <Scrubber label="End" value={activeOverride.pathTrimEnd ?? (motionState?.pathTrimEnd ?? 100)} onChange={(v) => handlePathOverrideUpdate(selectedPathIdx, { pathTrimEnd: v })} min={0} max={100} />
                        </div>
                      )}

                      <div className="space-y-1.5 pt-1 border-t border-border/40">
                        {([
                          { key: "pathReverse", label: "Reverse (erase)" },
                          { key: "loop", label: "Loop" },
                          { key: "fillTransition", label: "Fill after draw" },
                        ] as const).map(({ key, label }) => {
                          const val = !!(activeOverride as Record<string, unknown>)[key];
                          return (
                            <div key={key} className="flex items-center justify-between h-[34px] px-1">
                              <span className="text-[10px] uppercase tracking-widest text-foreground/60">{label}</span>
                              <Toggle size="sm" value={val} onChange={(v) => handlePathOverrideUpdate(selectedPathIdx, { [key]: v } as Partial<PathAnimationOverride>)} />
                            </div>
                          );
                        })}
                        {activeOverride.fillTransition && (
                          <Scrubber label="Fill delay" value={activeOverride.fillDelay ?? 0.5} onChange={(v) => handlePathOverrideUpdate(selectedPathIdx, { fillDelay: v })} min={0} max={2} step={0.05} />
                        )}
                      </div>
                      <div className="space-y-2 pt-2 border-t border-border/40">
                        <div className="text-[10px] uppercase tracking-widest text-foreground/40 px-1">Trigger</div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(["auto", "once", "hover", "click"] as const).map((t) => (
                            <button key={t} type="button"
                              onClick={() => handlePathOverrideUpdate(selectedPathIdx, { trigger: t })}
                              className={cn("h-7 rounded-md text-[10px] uppercase tracking-tighter transition-all",
                                (activeOverride.trigger ?? "auto") === t ? "bg-foreground text-background shadow-sm" : "text-foreground/40 hover:text-foreground hover:bg-muted/20")}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center space-y-4 bg-muted/5 rounded-sm border border-dashed border-border/60">
                      <p className="text-[10px] uppercase tracking-widest opacity-30">Global settings active</p>
                      <Button variant="secondary" size="sm" className="h-7 text-[9px] uppercase tracking-widest px-4"
                        onClick={() => handleOverrideEnable(selectedPathIdx, true)}>
                        / Enable Override
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <Button variant="ghost" className="h-7 px-2 text-[9px] uppercase tracking-widest text-foreground/40 hover:text-foreground"
                  onClick={() => handleGlobalChange({ loop: !motionState?.loop })}>
                  <span className="flex items-center gap-1.5">
                    <span className={cn("h-1 w-1 rounded-full", motionState?.loop ? "bg-primary" : "bg-muted-foreground/30")} />
                    {motionState?.loop ? "Looping" : "Once"}
                  </span>
                </Button>
                <Button variant="ghost" className="h-7 px-2 text-[9px] uppercase tracking-widest text-destructive/60 hover:text-destructive hover:bg-destructive/5"
                  onClick={() => handleGlobalChange({ perPathAnimations: {}, selectedPathIndex: -1, presetId: null })}>
                  Clear Overrides
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
