"use client";

import { useMemo, useRef, useState } from "react";
import type { EditorDocument } from "@/lib/editor/types";
import type { CustomizationState } from "@/lib/types";
import { resolveEditorPathPaint } from "@/lib/editor/svg";
import { simplifyPoints, pointsToSmoothPath, type DrawPoint } from "./draw-utils";

interface EditorDrawCanvasProps {
  document: EditorDocument | null;
  state: CustomizationState;
  viewBox: string;
  onAddPath: (d: string) => void;
}

const MIN_POINTS_FOR_STROKE = 3;
const SIMPLIFY_TOLERANCE = 0.3;

export function EditorDrawCanvas({
  document: editorDocument,
  state,
  viewBox,
  onAddPath,
}: EditorDrawCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rawPointsRef = useRef<DrawPoint[]>([]);
  const isDrawingRef = useRef(false);

  const [drawingPoints, setDrawingPoints] = useState<DrawPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const viewBoxParts = useMemo(() => viewBox.split(" ").map(Number), [viewBox]);
  const vbSize = Math.max(viewBoxParts[2] || 24, viewBoxParts[3] || 24);
  const vbPad = vbSize * 0.1;
  const paddedViewBox = `${(viewBoxParts[0] || 0) - vbPad} ${(viewBoxParts[1] || 0) - vbPad} ${(viewBoxParts[2] || 24) + vbPad * 2} ${(viewBoxParts[3] || 24) + vbPad * 2}`;
  const scaleFactor = vbSize / 250;

  const paths = editorDocument?.paths ?? [];

  function clientToSvg(clientX: number, clientY: number): DrawPoint | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return {
      x: pt.x,
      y: pt.y,
    };
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (e.button !== 0) return;

    const point = clientToSvg(e.clientX, e.clientY);
    if (!point) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    rawPointsRef.current = [point];
    setIsDrawing(true);
    setDrawingPoints([point]);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawingRef.current) return;

    const point = clientToSvg(e.clientX, e.clientY);
    if (!point) return;

    rawPointsRef.current.push(point);
    setDrawingPoints([...rawPointsRef.current]);
  }

  function handlePointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;
    setIsDrawing(false);

    const raw = rawPointsRef.current;
    rawPointsRef.current = [];
    setDrawingPoints([]);

    if (raw.length < MIN_POINTS_FOR_STROKE) return;

    const simplified = simplifyPoints(raw, SIMPLIFY_TOLERANCE);
    const d = pointsToSmoothPath(simplified);
    if (d) {
      onAddPath(d);
    }
  }

  const livePolyline = useMemo(() => {
    if (drawingPoints.length < 2) return "";
    return drawingPoints.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  }, [drawingPoints]);

  return (
    <div className="relative h-full w-full bg-background">
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:18px_18px] dark:bg-[radial-gradient(#404040_1px,transparent_1px)]" />
        <svg
          ref={svgRef}
          viewBox={paddedViewBox}
          className="relative z-10 h-full w-full"
          style={{
            touchAction: "none",
            overflow: "hidden",
            cursor: isDrawing ? "crosshair" : "crosshair",
          }}
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()}
        >
          <g>
            {paths
              .filter((p) => p.visible)
              .map((p) => {
                const paint = resolveEditorPathPaint(p, state);

                return (
                  <path
                    key={p.id}
                    d={p.d}
                    fill={paint.fill}
                    stroke={paint.stroke}
                    strokeWidth={p.strokeWidth ?? 1.5}
                    strokeLinecap={p.strokeLinecap ?? "round"}
                    strokeLinejoin={p.strokeLinejoin ?? "round"}
                    opacity={p.opacity}
                    pointerEvents="none"
                  />
                );
              })}

            {livePolyline ? (
              <polyline
                points={livePolyline}
                fill="none"
                stroke="#1890ff"
                strokeWidth={2 * scaleFactor}
                strokeLinecap="round"
                strokeLinejoin="round"
                pointerEvents="none"
              />
            ) : null}
          </g>
        </svg>
      </div>
    </div>
  );
}
