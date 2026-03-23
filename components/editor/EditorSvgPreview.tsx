"use client";

import { memo } from "react";
import type { EditorDocument, EditorIconPath } from "@/lib/editor/types";
import type { CustomizationState } from "@/lib/types";
import { cn } from "@/lib/utils";

function stripDefsWrapper(defs?: string) {
  if (!defs) {
    return "";
  }

  return defs
    .replace(/^<defs\b[^>]*>/i, "")
    .replace(/<\/defs>$/i, "")
    .trim();
}

function resolvePathPaint(path: EditorIconPath, state?: CustomizationState) {
  if (!state) {
    return {
      stroke: path.stroke ?? "none",
      fill: path.fill ?? "none",
    };
  }

  if (state.iconGradient) {
    return {
      stroke:
        path.stroke && path.stroke !== "none" ? "url(#icon-gradient)" : path.stroke,
      fill: path.fill && path.fill !== "none" ? "url(#icon-gradient)" : path.fill,
    };
  }

  const strokeUsesDefault =
    !path.stroke ||
    path.stroke === "black" ||
    path.stroke === "#000000" ||
    path.stroke === "#ffffff" ||
    path.stroke === "currentColor";
  const fillUsesDefault =
    !path.fill ||
    path.fill === "black" ||
    path.fill === "#000000" ||
    path.fill === "#ffffff" ||
    path.fill === "currentColor";

  return {
    stroke:
      path.stroke && path.stroke !== "none" && strokeUsesDefault
        ? state.colors[0]
        : path.stroke ?? "none",
    fill:
      path.fill && path.fill !== "none" && fillUsesDefault
        ? state.colors[0]
        : path.fill ?? "none",
  };
}

interface EditorSvgPreviewProps {
  document: Pick<EditorDocument, "viewBox" | "defs" | "paths">;
  state?: CustomizationState;
  className?: string;
  onPathClick?: (pathId: string) => void;
}

export const EditorSvgPreview = memo(function EditorSvgPreview({
  document,
  state,
  className,
  onPathClick,
}: EditorSvgPreviewProps) {
  const defsMarkup = stripDefsWrapper(document.defs);

  return (
    <svg
      viewBox={document.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
    >
      {defsMarkup ? <defs dangerouslySetInnerHTML={{ __html: defsMarkup }} /> : null}
      {document.paths
        .filter((path) => path.visible)
        .map((path) => {
          const paint = resolvePathPaint(path, state);
          return (
            <path
              key={path.id}
              d={path.d}
              fill={paint.fill ?? "none"}
              stroke={paint.stroke ?? "none"}
              strokeWidth={path.strokeWidth ?? 1.5}
              strokeLinecap={path.strokeLinecap}
              strokeLinejoin={path.strokeLinejoin}
              opacity={path.opacity}
              fillOpacity={path.fillOpacity}
              strokeOpacity={path.strokeOpacity}
              fillRule={path.fillRule}
              clipRule={path.clipRule}
              filter={path.filter}
              clipPath={path.clipPath}
              mask={path.mask}
              style={{
                ...(path.mixBlendMode
                  ? { mixBlendMode: path.mixBlendMode }
                  : undefined),
                ...(onPathClick ? { cursor: "pointer" } : undefined),
              }}
              onClick={
                onPathClick
                  ? (e) => {
                      e.stopPropagation();
                      onPathClick(path.id);
                    }
                  : undefined
              }
            />
          );
        })}
    </svg>
  );
});
