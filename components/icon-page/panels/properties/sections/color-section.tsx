"use client";

import React, { useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CustomizationState } from "@/lib/types";
import { HexColor } from "@/lib/color-utils";
import { ColorRow } from './color-section/color-row';
import { cn } from "@/lib/utils";
import { useTuning } from "@/components/icon-page/tuning";


interface ColorSectionProps {
    state: CustomizationState;
    onChange: (updates: Partial<CustomizationState>) => void;
    isCollapsed?: boolean;
    onToggle?: () => void;
    inputFormat?: "hex" | "rgb" | "hsl";
    setInputFormat?: (format: "hex" | "rgb" | "hsl") => void;
    addGradientStop?: () => void;
    updateGradientStop?: (index: number, updates: Partial<{ color: string; position: number }>) => void;
    removeGradientStop?: (index: number) => void;
    getColorInputValue?: (index: number) => string;
    handleColorInputChange?: (index: number, value: string) => void;
    handleColorInputBlur?: (index: number, value: string) => void;
}

export function ColorSection({ 
    state, 
    onChange, 
    isCollapsed, 
}: ColorSectionProps) {
    const { getSpring, getFastTransition, values } = useTuning();

    const handleSolidChange = useCallback((hex: HexColor) => {
        const newColors = [...state.colors];
        newColors[0] = hex;
        onChange({ colors: newColors });
    }, [state.colors, onChange]);

    const handleGradientChange = useCallback((index: number, hex: HexColor) => {
        const newStops = [...state.gradient.stops];
        newStops[index] = { ...newStops[index], color: hex };
        onChange({ gradient: { ...state.gradient, stops: newStops } });
    }, [state.gradient, onChange]);

    const mode = state.iconGradient ? 'gradient' : 'solid';

    if (isCollapsed) return null;

    return (
        <div className="border-t border-border pt-4 mt-2">
            <div 
                className="overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 pb-3">
                    <span className="text-sm font-semibold text-foreground">Color</span>
                    <div className="flex bg-muted rounded-lg p-0.5 gap-0.5">
                        {(['solid', 'gradient'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => onChange({ iconGradient: m === 'gradient' })}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ease-out active:scale-[0.97]",
                                    mode === m 
                                        ? "bg-background text-foreground shadow-sm" 
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <AnimatePresence mode="wait" initial={false}>
                        {mode === 'solid' ? (
                            <motion.div 
                                key="solid" 
                                initial={{ opacity: 0, x: -values.modeSwitchDistance }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: values.modeSwitchDistance }} 
                                transition={getFastTransition()}
                            >
                                <ColorRow 
                                    label="Fill"
                                    value={state.colors[0] as HexColor} 
                                    onChange={handleSolidChange} 
                                />
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="gradient" 
                                initial={{ opacity: 0, x: -values.modeSwitchDistance }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: values.modeSwitchDistance }} 
                                transition={getFastTransition()}
                                className="flex flex-col gap-1"
                            >
                                {state.gradient.stops.slice(0, 3).map((stop, i) => (
                                    <ColorRow 
                                        key={i} 
                                        label={i === 0 ? "Start" : i === 1 ? "End" : `Stop ${i + 1}`}
                                        value={stop.color as HexColor} 
                                        onChange={(val: HexColor) => handleGradientChange(i, val)} 
                                    />
                                ))}
                                
                                <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between px-1">
                                    <span className="text-xs font-medium text-muted-foreground">Preview</span>
                                    <div 
                                        className="h-6 flex-1 mx-4 rounded-full border border-border/50"
                                        style={{ 
                                            background: `linear-gradient(to right, ${state.gradient.stops.map(s => s.color).join(', ')})` 
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
