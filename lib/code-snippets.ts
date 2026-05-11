import { CustomizationState, IconData } from "./types";
import { STROKE_STYLE_MAP } from "./stroke-style";
import { resolveAnimationType, resolveEasingValue } from "@/lib/editor/animation-engine";
import { buildConicSegments } from "@/lib/gradient-utils";

export function generateTailwindSnippet(state: CustomizationState): string {
  const classes = [];

  classes.push(`w-[${state.width}px] h-[${state.height}px]`);

  if (!state.iconGradient) {
    classes.push(`text-[${state.colors[0]}]`);
  }

  if (state.scale !== 1) classes.push(`scale-[${state.scale}]`);
  if (state.rotation !== 0) classes.push(`rotate-[${state.rotation}deg]`);
  if (state.flipH) classes.push("-scale-x-100");
  if (state.flipV) classes.push("-scale-y-100");

  if (state.blur > 0) {
    classes.push(`blur-[${state.blur}px]`);
  }

  return classes.join(" ");
}

function buildGradientDefsJsx(state: CustomizationState): string {
  if (!state.iconGradient) return "";
  const stops = [...state.gradient.stops]
    .sort((a, b) => a.position - b.position)
    .map(s => `<stop offset="${s.position}%" stopColor="${s.color || "#000000"}"/>`)
    .join("\n          ");
  const spreadMethod = state.gradient.spreadMethod ?? "pad";

  if (state.gradient.type === "linear") {
    const rad = (state.gradient.angle * Math.PI) / 180;
    const cx = 12;
    const x1 = (cx - cx * Math.sin(rad)).toFixed(3);
    const y1 = (cx + cx * Math.cos(rad)).toFixed(3);
    const x2 = (cx + cx * Math.sin(rad)).toFixed(3);
    const y2 = (cx - cx * Math.cos(rad)).toFixed(3);
    return `\n      <defs>\n        <linearGradient id="icon-gradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse" spreadMethod="${spreadMethod}">\n          ${stops}\n        </linearGradient>\n      </defs>`;
  }

  if (state.gradient.type === "radial") {
    const cx = ((state.gradient.cx ?? 50) / 100) * 24;
    const cy = ((state.gradient.cy ?? 50) / 100) * 24;
    const r  = ((state.gradient.r  ?? 50) / 100) * 24;
    return `\n      <defs>\n        <radialGradient id="icon-gradient" cx="${cx.toFixed(3)}" cy="${cy.toFixed(3)}" r="${r.toFixed(3)}" gradientUnits="userSpaceOnUse" spreadMethod="${spreadMethod}">\n          ${stops}\n        </radialGradient>\n      </defs>`;
  }

  const cx = ((state.gradient.cx ?? 50) / 100) * 24;
  const cy = ((state.gradient.cy ?? 50) / 100) * 24;
  const segs = buildConicSegments(state.gradient.stops, state.gradient.angle, cx, cy, 17);
  const polys = segs.map(s => `<polygon points="${s.points}" fill="${s.color}"/>`).join("\n          ");
  return `\n      <defs>\n        <pattern id="icon-gradient" width="24" height="24" patternUnits="userSpaceOnUse">\n          ${polys}\n        </pattern>\n      </defs>`;
}

export async function generateFramerMotionSnippet(icon: IconData, state: CustomizationState): Promise<string> {
  const iconUrl = icon.url;
  const color = state.colors[0] || "#000000";
  const componentName = toComponentName(icon.name);
  const lucideName = icon.name.replace(/\s+/g, "");
  const isGradient = state.iconGradient;
  const gradientTarget = state.gradient?.target ?? "both";
  const gradToStroke = isGradient && (gradientTarget === "stroke" || gradientTarget === "both");
  const gradToFill = isGradient && (gradientTarget === "fill" || gradientTarget === "both");

  const animationType = resolveAnimationType(state.motion?.animationType);
  const easing = resolveEasingValue(state.motion?.easingId, state.motion?.customCubic);
  const duration = Math.max(0.2, state.motion?.duration ?? 2);
  const delay = Math.max(0, state.motion?.delay ?? 0);
  const repeat = (state.motion?.loop ?? true) ? "Infinity" : 0;

  const isPathAnim = animationType === "draw" || animationType === "stroke";

  const strokeAttr = gradToStroke ? `"url(#icon-gradient)"` : `{color}`;
  const fillAttr = (gradToFill && state.iconType === "fill") ? `"url(#icon-gradient)"` : `"none"`;
  const gradientDefs = buildGradientDefsJsx(state);

  const animateMap: Record<string, object> = {
    bounce: { y: [0, -22, 0, -8, 0], scaleY: [1, 1.08, 0.95, 1.02, 1], scaleX: [1, 0.92, 1.05, 0.98, 1] },
    shake:  { x: [0, -8, 7, -5, 4, -2, 1, 0], rotate: [0, -3, 2, -1.5, 1, -0.5, 0, 0] },
    jump:   { y: [0, -30, -48, -24, -6, 0, -3, 0], scaleY: [1, 1.12, 0.94, 1.06, 0.97, 1.02, 0.99, 1] },
  };

  let pathsJsx = "{}";
  if (iconUrl) {
    try {
      const res = await fetch(iconUrl);
      const text = await res.text();
      const match = text.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
      if (match) pathsJsx = svgToJsx(match[1].trim(), isGradient ? "url(#icon-gradient)" : color);
    } catch {  }
  }

  const colorProp = isGradient ? "" : `, color = "${color}"`;
  const svgEl = iconUrl
    ? `<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill=${fillAttr} stroke=${strokeAttr} strokeWidth={${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeWidth}} strokeLinecap="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinecap}" strokeLinejoin="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinejoin}">${gradientDefs}
        ${pathsJsx}
      </svg>`
    : `<${lucideName} size={size} strokeWidth={${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeWidth}} strokeLinecap="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinecap}" strokeLinejoin="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinejoin}" color={color} />`;

  const lucideImport = iconUrl ? "" : `\nimport { ${lucideName} } from "lucide-react";`;

  if (!isPathAnim) {
    const animObj = JSON.stringify(animateMap[animationType] ?? { scale: [1, 1.1, 1] });
    return `import { motion } from "framer-motion";${lucideImport}

export default function ${componentName}({ size = 24${colorProp} }) {
  return (
    <motion.div
      animate={${animObj}}
      transition={{ duration: ${duration}, ease: "${easing}", delay: ${delay}, repeat: ${repeat} }}
      style={{ display: "inline-flex" }}
    >
      ${svgEl}
    </motion.div>
  );
}`;
  }

  const pathAnimate = animationType === "stroke" ? "[0, 0, 0.5, 1]" : "[0, 0, 1]";
  const pathTimes = animationType === "stroke" ? " times={[0, 0.55, 0.85, 1]}" : "";
  return `import { motion } from "framer-motion";${lucideImport}

export default function ${componentName}({ size = 24${colorProp} }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill=${fillAttr} stroke=${strokeAttr} strokeWidth={${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeWidth}} strokeLinecap="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinecap}" strokeLinejoin="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinejoin}">${gradientDefs}
      <motion.g
        initial={{ strokeDashoffset: 1200, fillOpacity: 0 }}
        animate={{ strokeDashoffset: 0, fillOpacity: ${pathAnimate} }}
        transition={{ duration: ${duration}, ease: "${easing}", delay: ${delay}, repeat: ${repeat}${pathTimes} }}
        style={{ strokeDasharray: 1200 }}
      >
        ${pathsJsx}
      </motion.g>
    </svg>
  );
}`;
}

function svgToJsx(svgInner: string, strokeColor: string): string {
  return svgInner
    .replace(/\bstroke="(?!none)[^"]*"/g, `stroke="${strokeColor}"`)
    .replace(/\bfill="(?!none)[^"]*"/g, 'fill="none"')
    .replace(/\bclass=/g, "className=")
    .replace(/\bstroke-width=/g, "strokeWidth=")
    .replace(/\bstroke-linecap=/g, "strokeLinecap=")
    .replace(/\bstroke-linejoin=/g, "strokeLinejoin=")
    .replace(/\bfill-opacity=/g, "fillOpacity=")
    .replace(/\bstroke-opacity=/g, "strokeOpacity=")
    .replace(/\bclip-rule=/g, "clipRule=")
    .replace(/\bfill-rule=/g, "fillRule=")
    .replace(/\bstroke-dasharray=/g, "strokeDasharray=")
    .replace(/\bstroke-dashoffset=/g, "strokeDashoffset=")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function toComponentName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join("") + "Icon";
}

export async function generateReactSnippet(icon: IconData, state: CustomizationState): Promise<string> {
  const iconUrl = icon.url;
  const color = state.colors[0] || "#000000";
  const componentName = toComponentName(icon.name);
  const isGradient = state.iconGradient;
  const gradientTarget = state.gradient?.target ?? "both";
  const gradToStroke = isGradient && (gradientTarget === "stroke" || gradientTarget === "both");
  const gradToFill = isGradient && (gradientTarget === "fill" || gradientTarget === "both");
  const strokeAttr = gradToStroke ? `"url(#icon-gradient)"` : `{color}`;
  const fillAttr = (gradToFill && state.iconType === "fill") ? `"url(#icon-gradient)"` : `"none"`;
  const gradientDefs = buildGradientDefsJsx(state);
  const colorProp = isGradient ? "" : `, color = "${color}"`;

  if (iconUrl) {
    let pathsJsx = "{}";
    try {
      const res = await fetch(iconUrl);
      const text = await res.text();
      const match = text.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
      if (match) pathsJsx = svgToJsx(match[1].trim(), gradToStroke ? "url(#icon-gradient)" : color);
    } catch {  }

    return `export default function ${componentName}({ size = 24${colorProp}, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill=${fillAttr}
      stroke=${strokeAttr}
      strokeWidth={${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeWidth}}
      strokeLinecap="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinecap}"
      strokeLinejoin="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinejoin}"
      className={className}
    >${gradientDefs}
      ${pathsJsx}
    </svg>
  );
}`;
  }

  const lucideName = icon.name.replace(/\s+/g, "");
  return `import { ${lucideName} } from 'lucide-react';

export default function ${componentName}({ size = 24${colorProp}, className = "" }) {
  return (
    <${lucideName}
      size={size}
      strokeWidth={${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeWidth}}
      strokeLinecap="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinecap}"
      strokeLinejoin="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinejoin}"
      color={color}
      className={className}
    />
  );
}`;
}
