"use client";

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    addGradientStop,
    removeGradientStop,
    updateGradientStop,
    inputFormat,
    setInputFormat,
    getColorInputValue,
    handleColorInputChange,
    handleColorInputBlur,
}: ColorSectionProps) {
    const { getFastTransition } = useTuning();

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
        <div className="pt-4 px-4 pb-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider opacity-70 text-balance">Color</h3>
                <div className="flex bg-muted rounded-lg p-0.5 gap-0.5 border border-border/50">
                    <button
                        onClick={() => onChange({ iconGradient: false })}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-[scale,background-color,color,box-shadow,ring] duration-200 ease-out active:scale-[0.96]",
                            mode === 'solid' 
                                ? "bg-background text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.1)] ring-1 ring-border" 
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Solid
                    </button>
                    <button
                        onClick={() => onChange({ iconGradient: true })}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-[scale,background-color,color,box-shadow,ring] duration-200 ease-out active:scale-[0.96] relative overflow-hidden",
                            mode === 'gradient' 
                                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md ring-1 ring-white/20" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        {mode === 'gradient' && (
                            <motion.div 
                                layoutId="gradient-active"
                                className="absolute inset-0 bg-white/10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        )}
                        <span className="relative z-10">Gradient</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="wait" initial={false}>
                    {mode === 'solid' ? (
                        <motion.div 
                            key="solid" 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: 10 }} 
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
                            initial={{ opacity: 0, x: 10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -10 }} 
                            transition={getFastTransition()}
                            className="flex flex-col gap-1"
                        >
                            <motion.div 
                                className="space-y-1"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.08
                                        }
                                    }
                                }}
                            >
                                {state.gradient.stops.map((stop, i) => (
                                    <motion.div 
                                        key={i} 
                                        className="flex items-center gap-1"
                                        variants={{
                                            hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
                                            visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                                        }}
                                    >
                                        <div className="flex-1">
                                            <ColorRow 
                                                label={i === 0 ? "Start" : i === state.gradient.stops.length - 1 ? "End" : `Stop ${i + 1}`}
                                                value={stop.color as HexColor} 
                                                onChange={(val: HexColor) => handleGradientChange(i, val)} 
                                            />
                                        </div>
                                        {state.gradient.stops.length > 2 && (
                                            <button 
                                                onClick={() => removeGradientStop?.(i)}
                                                className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-[color,background-color,scale] active:scale-[0.96] relative after:absolute after:inset-[-8px] after:content-['']"
                                                title="Remove stop"
                                            >
                                                <span className="text-lg leading-none">×</span>
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                            
                            <button 
                                onClick={addGradientStop}
                                className="mt-2 py-1.5 w-full border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-md text-[10px] font-bold tracking-wider text-muted-foreground hover:text-primary transition-[border-color,background-color,color,scale] active:scale-[0.96]"
                            >
                                + ADD GRADIENT STOP
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {mode === 'gradient' && (
                  <div className="pt-2 flex items-center justify-between group">
                    <span className="text-[13px] font-medium text-muted-foreground/80 group-hover:text-foreground transition-colors duration-200">
                      Preview
                    </span>
                    <div className="flex-1 max-w-[140px] h-6 rounded-md bg-muted/30 p-[1.5px] border border-border/50 shadow-inner">
                      <div 
                        className="h-full w-full rounded-[4px]"
                        style={{ 
                          background: `linear-gradient(to right, ${state.gradient.stops.map(s => s.color).join(', ')})` 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
    );
}
