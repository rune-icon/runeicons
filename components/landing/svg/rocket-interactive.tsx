"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * VECTOR ENGINE: A flexible component to render and edit SVG paths.
 * Architected to be "data-driven" - it can handle any point-based SVG structure.
 */

interface Point {
  id: string;
  x: number;
  y: number;
  label?: string;
  type: "anchor" | "control";
}

const VectorEngine = () => {
  const containerRef = useRef<SVGSVGElement>(null);
  const [activePreset, setActivePreset] = useState<"rocket" | "heart">("rocket");

  // PRESETS DATA - This is the "Engine" configuration
  const PRESETS: Record<string, { points: Record<string, Point>, layers: any[] }> = {
    rocket: {
      points: {
        nose: { id: "nose", x: 200, y: 40, type: "anchor", label: "Nose" },
        bodyRight: { id: "bodyRight", x: 280, y: 160, type: "control", label: "Curve R" },
        bodyLeft: { id: "bodyLeft", x: 120, y: 160, type: "control", label: "Curve L" },
        baseRight: { id: "baseRight", x: 240, y: 280, type: "anchor", label: "Base R" },
        baseLeft: { id: "baseLeft", x: 160, y: 280, type: "anchor", label: "Base L" },
        wingRTip: { id: "wingRTip", x: 340, y: 320, type: "anchor", label: "Wing R" },
        wingLTip: { id: "wingLTip", x: 60, y: 320, type: "anchor", label: "Wing L" },
        flameTip: { id: "flameTip", x: 200, y: 360, type: "anchor", label: "Propulsion" },
        window: { id: "window", x: 200, y: 150, type: "anchor", label: "Porthole" },
      },
      layers: [
        {
          id: "body",
          template: (pts: any) => `M ${pts.nose.x},${pts.nose.y} C ${pts.bodyRight.x},${pts.bodyRight.y} ${pts.bodyRight.x},${pts.bodyRight.y} ${pts.baseRight.x},${pts.baseRight.y} L ${pts.baseLeft.x},${pts.baseLeft.y} C ${pts.bodyLeft.x},${pts.bodyLeft.y} ${pts.bodyLeft.x},${pts.bodyLeft.y} ${pts.nose.x},${pts.nose.y} Z`,
          style: { stroke: "#fff", fill: "rgba(255,255,255,0.05)", strokeWidth: 2.5 }
        },
        {
          id: "wingLeft",
          template: (pts: any) => `M ${pts.baseLeft.x},${pts.baseLeft.y - 60} L ${pts.wingLTip.x},${pts.wingLTip.y} L ${pts.baseLeft.x},${pts.baseLeft.y} Z`,
          style: { stroke: "rgba(255,255,255,0.4)", fill: "rgba(255,255,255,0.02)", strokeWidth: 1.5 }
        },
        {
          id: "wingRight",
          template: (pts: any) => `M ${pts.baseRight.x},${pts.baseRight.y - 60} L ${pts.wingRTip.x},${pts.wingRTip.y} L ${pts.baseRight.x},${pts.baseRight.y} Z`,
          style: { stroke: "rgba(255,255,255,0.4)", fill: "rgba(255,255,255,0.02)", strokeWidth: 1.5 }
        },
        {
          id: "flame",
          template: (pts: any) => `M ${pts.baseLeft.x + 20},${pts.baseLeft.y} Q ${pts.flameTip.x},${pts.flameTip.y} ${pts.baseRight.x - 20},${pts.baseRight.y} Z`,
          style: { stroke: "#3b82f6", fill: "rgba(59,130,246,0.1)", strokeWidth: 2 }
        }
      ]
    },
    heart: {
      points: {
        top: { id: "top", x: 200, y: 120, type: "anchor", label: "Split" },
        bottom: { id: "bottom", x: 200, y: 340, type: "anchor", label: "Tip" },
        leftC1: { id: "leftC1", x: 40, y: 40, type: "control", label: "L Curve 1" },
        leftC2: { id: "leftC2", x: 40, y: 240, type: "control", label: "L Curve 2" },
        rightC1: { id: "rightC1", x: 360, y: 40, type: "control", label: "R Curve 1" },
        rightC2: { id: "rightC2", x: 360, y: 240, type: "control", label: "R Curve 2" },
      },
      layers: [
        {
          id: "main",
          template: (pts: any) => `M ${pts.top.x},${pts.top.y} C ${pts.leftC1.x},${pts.leftC1.y} ${pts.leftC2.x},${pts.leftC2.y} ${pts.bottom.x},${pts.bottom.y} C ${pts.rightC2.x},${pts.rightC2.y} ${pts.rightC1.x},${pts.rightC1.y} ${pts.top.x},${pts.top.y} Z`,
          style: { stroke: "#f43f5e", fill: "rgba(244,63,94,0.1)", strokeWidth: 3 }
        }
      ]
    }
  };

  const [points, setPoints] = useState<Record<string, Point>>(PRESETS.rocket.points);

  const swapPreset = (name: "rocket" | "heart") => {
    setActivePreset(name);
    setPoints(PRESETS[name].points);
  };

  const handleDrag = (id: string, info: any) => {
    setPoints((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        x: prev[id].x + info.delta.x,
        y: prev[id].y + info.delta.y,
      }
    }));
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 min-h-[350px] group overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* PRESET SWITCHER */}
      <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => swapPreset("rocket")}
          className={`px-2 py-1 text-[10px] rounded border transition-colors ${activePreset === "rocket" ? "bg-white/10 border-white/20 text-white" : "bg-black/20 border-white/5 text-white/40 hover:text-white"}`}
        >
          ROCKET
        </button>
        <button 
          onClick={() => swapPreset("heart")}
          className={`px-2 py-1 text-[10px] rounded border transition-colors ${activePreset === "heart" ? "bg-white/10 border-white/20 text-white" : "bg-black/20 border-white/5 text-white/40 hover:text-white"}`}
        >
          HEART
        </button>
      </div>

      <svg
        ref={containerRef}
        viewBox="0 0 400 400"
        className="w-full h-full max-w-[320px] overflow-visible select-none"
      >
        <defs>
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* RENDER LAYERS FOR ACTIVE PRESET */}
        {PRESETS[activePreset].layers.map((layer: any) => (
          <motion.path
            key={layer.id}
            d={layer.template(points)}
            stroke={layer.style.stroke}
            fill={layer.style.fill}
            strokeWidth={layer.style.strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            animate={{ d: layer.template(points) }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="backdrop-blur-[1px]"
          />
        ))}

        {/* Dynamic Detail rendering */}
        {activePreset === "rocket" && points.window && (
           <motion.circle
            cx={points.window.x}
            cy={points.window.y}
            r="14"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            animate={{ cx: points.window.x, cy: points.window.y }}
          />
        )}

        {/* VECTOR HANDLES */}
        <AnimatePresence mode="popLayout">
          {Object.values(points).map((point) => (
            <motion.g
              key={`${activePreset}-${point.id}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ x: point.x, y: point.y, scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="cursor-grab active:cursor-grabbing"
            >
              <motion.circle
                r={point.type === "anchor" ? 6 : 4}
                fill={point.type === "anchor" ? "#fff" : "rgba(255,255,255,0.4)"}
                stroke={point.id === "flameTip" || point.id === "bottom" ? "#3b82f6" : "rgba(255,255,255,0.2)"}
                strokeWidth="1.5"
                filter="url(#nodeGlow)"
                drag
                dragConstraints={containerRef}
                dragElastic={0}
                dragMomentum={false}
                onDrag={(e, info) => handleDrag(point.id, info)}
                whileHover={{ scale: 1.4, fill: "#3b82f6" }}
              />
              <motion.text
                y="-15"
                textAnchor="middle"
                className="text-[8px] fill-white/40 font-bold uppercase tracking-tighter pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {point.label}
              </motion.text>
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>

      {/* FOOTER CONTROLS */}
      <div className="absolute bottom-4 left-0 w-full px-6 flex justify-between items-end pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="h-0.5 w-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Vector Engine v1.2
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-white/30 font-mono tracking-tighter uppercase">
            {activePreset} active
          </span>
        </div>
      </div>
    </div>
  );
};

export default VectorEngine;
