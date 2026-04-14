"use client";

import React, { useCallback } from 'react';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { CustomizationState } from "@/lib/types";
import { HexColor } from "@/lib/color-utils";
import { BlossomColorPicker } from "../../../blossom-picker/blossom-picker";
import { ColorRow } from './color-section/color-row';

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
    onToggle, 
    inputFormat, 
    setInputFormat,
    addGradientStop,
    updateGradientStop,
    removeGradientStop,
    getColorInputValue,
    handleColorInputChange,
    handleColorInputBlur
}: ColorSectionProps) {
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

    return (
        <div className="px-1.5 pb-2 pt-0.5">
            <m.div 
                className="color-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                    background: '#fff', 
                    borderRadius: 12, 
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 8px 16px -4px rgba(0,0,0,0.04)', 
                    overflow: 'hidden' 
                }}
            >
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px 16px', 
                    borderBottom: '1px solid rgba(0,0,0,0.06)' 
                }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>Color</span>
                    <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: 8, padding: 2, gap: 2 }}>
                        {(['solid', 'gradient'] as const).map(opt => (
                            <button
                                key={opt}
                                onClick={() => onChange({ iconGradient: opt === 'gradient' })}
                                style={{
                                    padding: '5px 12px', 
                                    borderRadius: 6, 
                                    border: 'none', 
                                    fontSize: 12, 
                                    fontWeight: 500, 
                                    cursor: 'pointer',
                                    background: mode === opt ? '#fff' : 'transparent',
                                    color: mode === opt ? '#171717' : '#525252',
                                    boxShadow: mode === opt ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                                }}
                            >
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '8px 12px' }}>
                    <AnimatePresence mode="wait">
                        {mode === 'solid' ? (
                            <m.div 
                                key="solid" 
                                initial={{ opacity: 0, x: -4 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 4 }} 
                                transition={{ duration: 0.15 }}
                            >
                                <ColorRow 
                                    label="Fill"
                                    value={state.colors[0] as HexColor} 
                                    onChange={handleSolidChange} 
                                />
                            </m.div>
                        ) : (
                            <m.div 
                                key="gradient" 
                                initial={{ opacity: 0, x: -4 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 4 }} 
                                transition={{ duration: 0.15 }}
                                className="flex flex-col gap-1"
                            >
                                {state.gradient.stops.slice(0, 3).map((stop, i) => (
                                    <ColorRow 
                                        key={`stop-${i}-${stop.position}`} 
                                        label={i === 0 ? "Start" : i === 1 ? "End" : `Stop ${i + 1}`}
                                        value={stop.color as HexColor} 
                                        onChange={(val) => handleGradientChange(i, val)} 
                                    />
                                ))}
                                
                                <div className="mt-3 pt-3 border-t border-black/[0.03] flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground/60">Preview</span>
                                    <div 
                                        className="h-6 flex-1 mx-4 rounded-full border border-black/[0.04]"
                                        style={{ 
                                            background: `linear-gradient(to right, ${state.gradient.stops.map(s => s.color).join(', ')})` 
                                        }}
                                    />
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </m.div>
        </div>
    );
}
