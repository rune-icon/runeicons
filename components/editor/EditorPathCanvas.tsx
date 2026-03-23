"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EditorIconPath } from "@/lib/editor/types";
import {
  addControlPointsToAllAnchors,
  parseSvgPath,
  pointsToSvgPath,
  type ControlPoint,
} from "@/components/editor/svg-path-utils";
import { ensureEditorPathEditable } from "../../lib/editor/path-data";

interface EditorPathCanvasProps {
  path: EditorIconPath | null;
  allPaths?: EditorIconPath[];
  viewBox: string;
  onPreviewChange: (d: string) => void;
  onCommitChange: (d: string) => void;
  onSelectPath?: (pathId: string) => void;
}

function cloneControlPoints(points: ControlPoint[]) {
  return points.map((point) => ({ ...point }));
}

export function EditorPathCanvas({
  path,
  allPaths,
  viewBox,
  onPreviewChange,
  onCommitChange,
  onSelectPath,
}: EditorPathCanvasProps) {
  const editorRef = useRef<SVGSVGElement>(null);

  const controlPointsRef = useRef<ControlPoint[]>([]);
  const currentEditPathRef = useRef("");
  const historyRef = useRef<ControlPoint[][]>([]);
  const historyIndexRef = useRef(0);

  const draggedPointIndexRef = useRef(-1);
  const isPanningRef = useRef(false);
  const startPanPositionRef = useRef({ x: 0, y: 0 });
  const zoomLevelRef = useRef(1);
  const panOffsetRef = useRef({ x: 0, y: 0 });

  const onPreviewChangeRef = useRef(onPreviewChange);
  const onCommitChangeRef = useRef(onCommitChange);
  useEffect(() => {
    onPreviewChangeRef.current = onPreviewChange;
    onCommitChangeRef.current = onCommitChange;
  });

  const rafIdRef = useRef(0);

  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [draggedPointIndex, setDraggedPointIndex] = useState<number>(-1);
  const [currentEditPath, setCurrentEditPath] = useState("");
  const [controlPointsHistory, setControlPointsHistory] = useState<
    ControlPoint[][]
  >([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoverPointIndex, setHoverPointIndex] = useState<number | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);

  const isViewMoved = zoomLevel !== 1 || panOffset.x !== 0 || panOffset.y !== 0;

  const viewBoxParts = useMemo(
    () => viewBox.split(" ").map(Number),
    [viewBox],
  );
  const vbSize = Math.max(viewBoxParts[2] || 24, viewBoxParts[3] || 24);
  const scaleFactor = vbSize / 250;
  const vbPad = vbSize * 0.1;
  const paddedViewBox = `${(viewBoxParts[0] || 0) - vbPad} ${(viewBoxParts[1] || 0) - vbPad} ${(viewBoxParts[2] || 24) + vbPad * 2} ${(viewBoxParts[3] || 24) + vbPad * 2}`;

  const backgroundPaths = useMemo(() => {
    if (!allPaths || !path) return [];
    return allPaths.filter((p) => p.id !== path.id && p.visible);
  }, [allPaths, path]);

  const flushCanvasState = (
    nextPoints: ControlPoint[],
    nextPath: string,
  ) => {
    controlPointsRef.current = nextPoints;
    currentEditPathRef.current = nextPath;
    setControlPoints(nextPoints);
    setCurrentEditPath(nextPath);
  };

  const flushHistoryState = (
    nextHistory: ControlPoint[][],
    nextHistoryIndex: number,
  ) => {
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistoryIndex;
    setControlPointsHistory(nextHistory);
    setHistoryIndex(nextHistoryIndex);
  };

  const cancelPendingRaf = () => {
    if (rafIdRef.current !== 0) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    }
  };

  const scheduleRafFlush = () => {
    if (rafIdRef.current !== 0) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = 0;
      setControlPoints(controlPointsRef.current);
      setCurrentEditPath(currentEditPathRef.current);
      setPanOffset(panOffsetRef.current);
      if (draggedPointIndexRef.current !== -1) {
        onPreviewChangeRef.current(currentEditPathRef.current);
      }
    });
  };

  useEffect(() => cancelPendingRaf, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!path?.d) {
      flushCanvasState([], "");
      flushHistoryState([], 0);
      setError(null);
      return;
    }

    try {
      const normalized = ensureEditorPathEditable(path.d);
      const points = addControlPointsToAllAnchors(parseSvgPath(normalized));
      const nextPath = pointsToSvgPath(points);
      flushCanvasState(points, nextPath);
      flushHistoryState([cloneControlPoints(points)], 0);
      setError(null);
    } catch (caughtError) {
      flushCanvasState([], path.d);
      flushHistoryState([], 0);
      setError(
        `Could not edit this path: ${
          caughtError instanceof Error ? caughtError.message : "Unknown error"
        }`,
      );
    }
  }, [path?.d, path?.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const resetView = () => {
    zoomLevelRef.current = 1;
    panOffsetRef.current = { x: 0, y: 0 };
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const startDrag = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    draggedPointIndexRef.current = index;
    setDraggedPointIndex(index);
  };

  const startPan = (event: React.MouseEvent<SVGSVGElement>) => {
    if (
      draggedPointIndexRef.current === -1 &&
      (event.button === 1 ||
        event.button === 2 ||
        (event.button === 0 && event.altKey))
    ) {
      event.preventDefault();
      isPanningRef.current = true;
      startPanPositionRef.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!editorRef.current) return;

    const svg = editorRef.current;
    const transformMatrix = svg.getScreenCTM();
    if (!transformMatrix) return;

    const clientX = event.clientX;
    const clientY = event.clientY;

    if (isPanningRef.current) {
      const dx =
        (clientX - startPanPositionRef.current.x) / transformMatrix.a;
      const dy =
        (clientY - startPanPositionRef.current.y) / transformMatrix.d;
      panOffsetRef.current = {
        x: panOffsetRef.current.x + dx,
        y: panOffsetRef.current.y + dy,
      };
      startPanPositionRef.current = { x: clientX, y: clientY };
      scheduleRafFlush();
      return;
    }

    const dragIdx = draggedPointIndexRef.current;
    if (dragIdx === -1) return;

    const zoom = zoomLevelRef.current;
    const pan = panOffsetRef.current;
    const svgPoint = new DOMPoint(clientX, clientY).matrixTransform(
      transformMatrix.inverse(),
    );
    const nextX = svgPoint.x / zoom - pan.x / zoom;
    const nextY = svgPoint.y / zoom - pan.y / zoom;

    if (Number.isNaN(nextX) || Number.isNaN(nextY)) return;

    const nextPoints = cloneControlPoints(controlPointsRef.current);
    const currentPoint = nextPoints[dragIdx];
    if (!currentPoint) return;

    const dx = nextX - currentPoint.x;
    const dy = nextY - currentPoint.y;
    nextPoints[dragIdx] = { ...currentPoint, x: nextX, y: nextY };

    if (!currentPoint.isControl) {
      if (dragIdx > 0 && nextPoints[dragIdx - 1]?.isControl) {
        nextPoints[dragIdx - 1] = {
          ...nextPoints[dragIdx - 1],
          x: nextPoints[dragIdx - 1].x + dx,
          y: nextPoints[dragIdx - 1].y + dy,
        };
      }
      if (dragIdx > 1 && nextPoints[dragIdx - 2]?.isControl) {
        nextPoints[dragIdx - 2] = {
          ...nextPoints[dragIdx - 2],
          x: nextPoints[dragIdx - 2].x + dx,
          y: nextPoints[dragIdx - 2].y + dy,
        };
      }
      if (
        dragIdx < nextPoints.length - 1 &&
        nextPoints[dragIdx + 1]?.isControl
      ) {
        nextPoints[dragIdx + 1] = {
          ...nextPoints[dragIdx + 1],
          x: nextPoints[dragIdx + 1].x + dx,
          y: nextPoints[dragIdx + 1].y + dy,
        };
      }
      if (
        dragIdx < nextPoints.length - 2 &&
        nextPoints[dragIdx + 2]?.isControl
      ) {
        nextPoints[dragIdx + 2] = {
          ...nextPoints[dragIdx + 2],
          x: nextPoints[dragIdx + 2].x + dx,
          y: nextPoints[dragIdx + 2].y + dy,
        };
      }
    }

    controlPointsRef.current = nextPoints;
    currentEditPathRef.current = pointsToSvgPath(nextPoints);
    scheduleRafFlush();
  };

  const endDrag = () => {
    cancelPendingRaf();

    if (
      draggedPointIndexRef.current !== -1 &&
      controlPointsRef.current.length > 0
    ) {
      setControlPoints(controlPointsRef.current);
      setCurrentEditPath(currentEditPathRef.current);
      const nextHistory = [
        ...historyRef.current.slice(0, historyIndexRef.current + 1),
        cloneControlPoints(controlPointsRef.current),
      ];
      flushHistoryState(nextHistory, nextHistory.length - 1);
      onCommitChangeRef.current(currentEditPathRef.current);
    }

    if (isPanningRef.current) {
      setPanOffset(panOffsetRef.current);
    }

    draggedPointIndexRef.current = -1;
    isPanningRef.current = false;
    setDraggedPointIndex(-1);
  };

  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    if (!editorRef.current) return;

    const rect = editorRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const factor = event.deltaY > 0 ? 0.9 : 1.1;
    const currentZoom = zoomLevelRef.current;
    const currentPan = panOffsetRef.current;
    const nextZoomLevel = Math.min(Math.max(currentZoom * factor, 0.2), 6);

    const nextPanOffset = {
      x: mouseX - (mouseX - currentPan.x) * (nextZoomLevel / currentZoom),
      y: mouseY - (mouseY - currentPan.y) * (nextZoomLevel / currentZoom),
    };

    zoomLevelRef.current = nextZoomLevel;
    panOffsetRef.current = nextPanOffset;
    setZoomLevel(nextZoomLevel);
    setPanOffset(nextPanOffset);
  };

  const removePoint = (index: number) => {
    if (controlPointsRef.current.length <= 2) return;

    const nextPoints = controlPointsRef.current.filter(
      (_, pointIndex) => pointIndex !== index,
    );
    const nextPath = pointsToSvgPath(nextPoints);
    const nextHistory = [
      ...historyRef.current.slice(0, historyIndexRef.current + 1),
      cloneControlPoints(nextPoints),
    ];

    flushCanvasState(nextPoints, nextPath);
    flushHistoryState(nextHistory, nextHistory.length - 1);
    onCommitChangeRef.current(nextPath);
  };

  if (!path) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
        Click a path on the canvas to edit it.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-background">
      {error ? (
        <div className="h-full flex items-center justify-center p-6 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:18px_18px] dark:bg-[radial-gradient(#404040_1px,transparent_1px)]" />
          <svg
            ref={editorRef}
            viewBox={paddedViewBox}
            className="relative z-10 h-full w-full"
            onMouseDown={startPan}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onWheel={handleWheel}
            style={{ touchAction: "none", overflow: "hidden" }}
            onContextMenu={(event) => event.preventDefault()}
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
            >
              {backgroundPaths.map((bp) => (
                <path
                  key={bp.id}
                  d={bp.d}
                  fill={bp.fill ?? "none"}
                  stroke={bp.stroke ?? "#000000"}
                  strokeWidth={bp.strokeWidth ?? 1.5}
                  strokeLinecap={bp.strokeLinecap ?? "round"}
                  strokeLinejoin={bp.strokeLinejoin ?? "round"}
                  opacity={0.35}
                  style={{ cursor: onSelectPath ? "pointer" : undefined }}
                  onClick={
                    onSelectPath
                      ? (e) => {
                          e.stopPropagation();
                          onSelectPath(bp.id);
                        }
                      : undefined
                  }
                />
              ))}

              <path
                d={currentEditPath}
                fill={path.fill ?? "none"}
                stroke={path.stroke ?? "#000000"}
                strokeWidth={path.strokeWidth ?? 1.5}
                strokeLinecap={path.strokeLinecap ?? "round"}
                strokeLinejoin={path.strokeLinejoin ?? "round"}
              />

              {controlPoints.map((point, index) => {
                const isAnchor = !point.isControl;
                const isHovered = index === hoverPointIndex;
                const isDragging = index === draggedPointIndex;
                let anchorIndex = -1;

                if (point.isControl) {
                  for (
                    let cursor = index - 1;
                    cursor >= 0;
                    cursor -= 1
                  ) {
                    if (!controlPoints[cursor].isControl) {
                      anchorIndex = cursor;
                      break;
                    }
                  }

                  if (anchorIndex === -1) {
                    for (
                      let cursor = index + 1;
                      cursor < controlPoints.length;
                      cursor += 1
                    ) {
                      if (!controlPoints[cursor].isControl) {
                        anchorIndex = cursor;
                        break;
                      }
                    }
                  }
                }

                return (
                  <g key={`${path.id}-point-${index}`}>
                    {point.isControl && anchorIndex !== -1 ? (
                      <line
                        x1={controlPoints[anchorIndex].x}
                        y1={controlPoints[anchorIndex].y}
                        x2={point.x}
                        y2={point.y}
                        stroke="#888"
                        strokeWidth={
                          (0.5 * scaleFactor) / zoomLevel
                        }
                        strokeDasharray={`${(1 * scaleFactor) / zoomLevel},${(1 * scaleFactor) / zoomLevel}`}
                      />
                    ) : null}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={
                        isAnchor
                          ? (4 * scaleFactor) / zoomLevel
                          : (3 * scaleFactor) / zoomLevel
                      }
                      fill={
                        isAnchor
                          ? isDragging
                            ? "#4338ca"
                            : isHovered
                              ? "#4096ff"
                              : "#1890ff"
                          : isDragging
                            ? "#e11d48"
                            : "#ff4d4f"
                      }
                      stroke="white"
                      strokeWidth={
                        (0.2 * scaleFactor) / zoomLevel
                      }
                      onMouseOver={() => setHoverPointIndex(index)}
                      onMouseOut={() => setHoverPointIndex(null)}
                      onMouseDown={(event) =>
                        startDrag(index, event)
                      }
                      onContextMenu={(event) => {
                        event.preventDefault();
                        removePoint(index);
                      }}
                      style={{ cursor: "move" }}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      )}

      {isViewMoved ? (
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="absolute bottom-3 right-3 z-20 bg-background/90 backdrop-blur-sm shadow-md"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset View
        </Button>
      ) : null}
    </div>
  );
}
