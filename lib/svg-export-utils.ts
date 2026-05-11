import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { CustomizationState, IconData } from "./types";
import {
  resolveAnimationType,
  resolveEasingValue,
} from "@/lib/editor/animation-engine";
import { buildConicSegments } from "@/lib/gradient-utils";
import { STROKE_STYLE_MAP } from "./stroke-style";

function buildIconTransform(state: CustomizationState, iconSize: number, iconCenter: number): string {
  const normalizedTranslateX = (state.translateX / state.width) * iconSize;
  const normalizedTranslateY = (state.translateY / state.height) * iconSize;
  const transforms = [
    `translate(${iconCenter}, ${iconCenter})`,
    `rotate(${state.rotation})`,
    `translate(-${iconCenter}, -${iconCenter})`,
    `translate(${normalizedTranslateX}, ${normalizedTranslateY})`,
  ];
  if (state.flipH) {
    transforms.push(`scale(-1, 1) translate(-${iconSize}, 0)`);
  }
  if (state.flipV) {
    transforms.push(`scale(1, -1) translate(0,-${iconSize})`);
  }
  return transforms.join(" ");
}

export async function generateStandaloneSvg(selectedIcon: IconData, state: CustomizationState): Promise<string> {
  const IconComponent = selectedIcon.icon;
  const iconUrl = selectedIcon.url;

  const gradientTarget = state.gradient.target ?? "both";
  const applyGradToStroke = state.iconGradient && (gradientTarget === "stroke" || gradientTarget === "both");
  const applyGradToFill = state.iconGradient && (gradientTarget === "fill" || gradientTarget === "both");
  const strokeColor = applyGradToStroke ? "url(#icon-gradient)" : state.colors[0] || "currentColor";
  const fillColor = applyGradToFill && (state.iconType === "fill" || state.iconType === "duotone" || state.iconType === "normal")
    ? "url(#icon-gradient)"
    : state.iconType === "fill"
      ? (state.colors[0] || "currentColor")
      : state.iconType === "duotone"
        ? `${state.colors[0] || "currentColor"}33`
        : "none";
  
  let innerContent = "";

  if (iconUrl) {
    try {
      const rawPaths = await fetchSvgInnerContentRaw(iconUrl);

      const effectiveFillColor = fillColor === "none" ? strokeColor : fillColor;
      const colorized = rawPaths
        .replace(/\bstroke="(?!none)[^"]*"/g, `stroke="${strokeColor}"`)
        .replace(/\bfill="(?!none)[^"]*"/g, `fill="${effectiveFillColor}"`);
      innerContent = colorized;
    } catch {

      innerContent = `
        <defs>
          <mask id="custom-icon-mask">
            <image href="${iconUrl}" width="24" height="24" />
          </mask>
        </defs>
        <rect 
          width="24" 
          height="24" 
          fill="${state.iconGradient ? "url(#icon-gradient)" : state.colors[0] || "currentColor"}"
          mask="url(#custom-icon-mask)"
        />
      `;
    }
  } else if (IconComponent) {
    const iconMarkup = renderToStaticMarkup(
      React.createElement(IconComponent, {
        size: 24, 
        strokeWidth: 2,
        style: {
          stroke: strokeColor,
          fill: fillColor,
          filter: state.shadow.inner ? "url(#inner-shadow)" : undefined,
        }
      })
    );
    innerContent = iconMarkup.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  }

  const iconViewBoxSize = 24;
  const iconCenter = iconViewBoxSize / 2;
  const transform = buildIconTransform(state, iconViewBoxSize, iconCenter);
  const paddingVB = (state.padding / state.width) * iconViewBoxSize;
  const iconScaleFactor = (iconViewBoxSize - 2 * paddingVB) / iconViewBoxSize;
  const animationType = resolveAnimationType(state.motion?.animationType);
  const easing = resolveEasingValue(state.motion?.easingId, state.motion?.customCubic);
  const duration = Math.max(0.2, state.motion?.duration ?? 2);
  const delay = Math.max(0, state.motion?.delay ?? 0);
  const iterationCount = state.motion?.loop ?? true ? "infinite" : "1";

  let defs = "";

  if (state.iconGradient) {
    const sortedStops = [...state.gradient.stops].sort((a, b) => a.position - b.position);
    const stops = sortedStops.map(s =>
      `<stop offset="${s.position}%" stop-color="${s.color || "#000000"}"/>`
    ).join("");
    const spreadMethod = state.gradient.spreadMethod ?? "pad";

    if (state.gradient.type === "linear") {
      const rad = (state.gradient.angle * Math.PI) / 180;
      const cx = iconViewBoxSize / 2;
      const x1 = (cx - cx * Math.sin(rad)).toFixed(3);
      const y1 = (cx + cx * Math.cos(rad)).toFixed(3);
      const x2 = (cx + cx * Math.sin(rad)).toFixed(3);
      const y2 = (cx - cx * Math.cos(rad)).toFixed(3);
      defs += `<linearGradient id="icon-gradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse" spreadMethod="${spreadMethod}">${stops}</linearGradient>`;
    } else if (state.gradient.type === "radial") {
      const cx = ((state.gradient.cx ?? 50) / 100) * iconViewBoxSize;
      const cy = ((state.gradient.cy ?? 50) / 100) * iconViewBoxSize;
      const r  = ((state.gradient.r  ?? 50) / 100) * iconViewBoxSize;
      defs += `<radialGradient id="icon-gradient" cx="${cx.toFixed(3)}" cy="${cy.toFixed(3)}" r="${r.toFixed(3)}" gradientUnits="userSpaceOnUse" spreadMethod="${spreadMethod}">${stops}</radialGradient>`;
    } else {

      const cx = ((state.gradient.cx ?? 50) / 100) * iconViewBoxSize;
      const cy = ((state.gradient.cy ?? 50) / 100) * iconViewBoxSize;
      const segs = buildConicSegments(state.gradient.stops, state.gradient.angle, cx, cy, 17);
      const polys = segs.map(s => `<polygon points="${s.points}" fill="${s.color}"/>`).join("");
      defs += `<pattern id="icon-gradient" width="${iconViewBoxSize}" height="${iconViewBoxSize}" patternUnits="userSpaceOnUse">${polys}</pattern>`;
    }
  }

  if (state.shadow.enabled && state.shadow.inner) {
    defs += `<filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${state.shadow.blur}" result="blur"/>
      <feComposite operator="out" in="SourceAlpha" in2="blur" result="inverse"/>
      <feFlood flood-color="black" flood-opacity="${state.shadow.opacity / 100}" result="color"/>
      <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>`;
  }

  if (state.shadow.enabled && !state.shadow.inner) {
    const blurVB = (state.shadow.blur / state.width) * iconViewBoxSize;
    const dxVB = (state.shadow.offsetX / state.width) * iconViewBoxSize;
    const dyVB = (state.shadow.offsetY / state.height) * iconViewBoxSize;
    defs += `<filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="${dxVB.toFixed(3)}" dy="${dyVB.toFixed(3)}" stdDeviation="${blurVB.toFixed(3)}" flood-color="black" flood-opacity="${state.shadow.opacity / 100}"/>
    </filter>`;
  }

  if (state.blur > 0) {
    const blurStd = ((state.blur / state.width) * iconViewBoxSize).toFixed(3);
    defs += `<filter id="icon-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${blurStd}" result="blur"/>
      <feComposite operator="in" in="blur" in2="SourceAlpha"/>
    </filter>`;
  }

  if (state.noise.enabled && state.noise.intensity > 0) {
    const noiseOpacity = (state.noise.intensity / 100).toFixed(3);
    defs += `<filter id="noise-filter" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 ${noiseOpacity} 0" result="colorNoise"/>
      <feComposite operator="in" in="colorNoise" in2="SourceGraphic" result="maskedNoise"/>
      <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="maskedNoise"/></feMerge>
    </filter>`;
  }

  if (state.iconType === "pixelated") {
    defs += `<filter id="pixelate" x="0%" y="0%" width="100%" height="100%">
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1"/>
        <feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1"/>
        <feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1"/>
      </feComponentTransfer>
    </filter>`;
  }

  if (state.iconType === "dither") {
    defs += `<filter id="dither-filter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="alpha"/>
      <feComposite operator="in" in="SourceGraphic" in2="alpha"/>
    </filter>`;
  }

  const isEnabled = state.motion?.enabled ?? false;
  const isGroupAnim = animationType === "bounce" || animationType === "shake" || animationType === "jump";

  const SVG_KEYFRAMES: Record<string, string> = {
    bounce: `@keyframes svg-bounce {
    0%   { transform: translateY(0) scale(1,1); }
    30%  { transform: translateY(-22px) scale(0.92,1.08); }
    50%  { transform: translateY(0) scale(1.05,0.95); }
    70%  { transform: translateY(-8px) scale(0.98,1.02); }
    100% { transform: translateY(0) scale(1,1); }
  }`,
    shake: `@keyframes svg-shake {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    15% { transform: translateX(-8px) rotate(-3deg); }
    30% { transform: translateX(7px) rotate(2deg); }
    45% { transform: translateX(-5px) rotate(-1.5deg); }
    60% { transform: translateX(4px) rotate(1deg); }
    75% { transform: translateX(-2px) rotate(-0.5deg); }
    90% { transform: translateX(1px) rotate(0deg); }
  }`,
    jump: `@keyframes svg-jump {
    0%, 100% { transform: translateY(0) scale(1,1); }
    15% { transform: translateY(-30px) scale(0.88,1.12); }
    30% { transform: translateY(-48px) scale(1.06,0.94); }
    45% { transform: translateY(-24px) scale(0.94,1.06); }
    60% { transform: translateY(-6px) scale(1.03,0.97); }
    75% { transform: translateY(0) scale(0.98,1.02); }
    90% { transform: translateY(-3px) scale(1.01,0.99); }
  }`,
    draw: `@keyframes svg-draw {
    0%   { stroke-dashoffset: 1200; fill-opacity: 0; }
    70%  { stroke-dashoffset: 0; fill-opacity: 0; }
    100% { stroke-dashoffset: 0; fill-opacity: 1; }
  }`,
    stroke: `@keyframes svg-stroke {
    0%   { stroke-dashoffset: 1200; fill-opacity: 0; }
    55%  { stroke-dashoffset: 0; fill-opacity: 0; }
    85%  { fill-opacity: 0.5; }
    100% { stroke-dashoffset: 0; fill-opacity: 1; }
  }`,
  };

  const animationCss = isEnabled ? `
    .icon-anim-group {
      transform-box: fill-box;
      transform-origin: 50% 50%;
      ${isGroupAnim ? `animation: svg-${animationType} ${duration}s ${easing} ${delay}s ${iterationCount} both;` : ""}
    }
    ${SVG_KEYFRAMES[animationType] ?? ""}
  ` : "";

  const rx = ((state.cornerRadius / state.width) * iconViewBoxSize).toFixed(3);
  const finalSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Made with RuneIcon — https://runeicon.com -->
<svg xmlns="http://www.w3.org/2000/svg" width="${state.width}" height="${state.height}" viewBox="0 0 ${iconViewBoxSize} ${iconViewBoxSize}" preserveAspectRatio="xMidYMid meet" fill="none">${defs ? `\n  <defs>${defs}</defs>` : ""}${animationCss ? `\n  <style>${animationCss}</style>` : ""}
  <rect width="${iconViewBoxSize}" height="${iconViewBoxSize}" rx="${rx}" ry="${rx}" fill="transparent"/>
  <g transform="translate(${paddingVB}, ${paddingVB}) scale(${iconScaleFactor})"${
    state.shadow.enabled && !state.shadow.inner ? ' filter="url(#drop-shadow)"' : ''}>
    <g transform="${transform}${state.iconType === "isometric" ? " rotateX(45) rotateZ(-45)" : ""}" class="icon-anim-group icon-anim-path" stroke="${strokeColor}" fill="${fillColor}" stroke-width="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeWidth}" stroke-linecap="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinecap}" stroke-linejoin="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinejoin}"${
    state.shadow.enabled && state.shadow.inner ? ' filter="url(#inner-shadow)"' :
    state.blur > 0 ? ' filter="url(#icon-blur)"' :
    state.iconType === "pixelated" ? ' filter="url(#pixelate)"' :
    state.iconType === "dither" ? ' filter="url(#dither-filter)"' :
    state.noise.enabled && state.noise.intensity > 0 ? ' filter="url(#noise-filter)"' : ''}>
      ${innerContent}
    </g>
  </g>
</svg>`.trim();

  return finalSvg;
}

function svgAttrToJsx(svg: string): string {
  return svg
    .replace(/\bclass=/g, "className=")
    .replace(/\bstroke-width=/g, "strokeWidth=")
    .replace(/\bstroke-linecap=/g, "strokeLinecap=")
    .replace(/\bstroke-linejoin=/g, "strokeLinejoin=")
    .replace(/\bfill-opacity=/g, "fillOpacity=")
    .replace(/\bstroke-opacity=/g, "strokeOpacity=")
    .replace(/\bfill-rule=/g, "fillRule=")
    .replace(/\bclip-rule=/g, "clipRule=")
    .replace(/\bstroke-dasharray=/g, "strokeDasharray=")
    .replace(/\bstroke-dashoffset=/g, "strokeDashoffset=")
    .replace(/\bstop-color=/g, "stopColor=")
    .replace(/\bflood-opacity=/g, "floodOpacity=")
    .replace(/\bclip-path=/g, "clipPath=")
    .replace(/<!--([\s\S]*?)-->/g, "{}");
}

export function buildComponentName(iconName: string): string {
  return (
    iconName
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Icon"
  );
}

function buildAnimationCss(state: CustomizationState): string {
  const isEnabled = state.motion?.enabled ?? false;
  if (!isEnabled) return "";

  const animationType = resolveAnimationType(state.motion?.animationType);
  const easing = resolveEasingValue(state.motion?.easingId, state.motion?.customCubic);
  const duration = Math.max(0.2, state.motion?.duration ?? 2);
  const delay = Math.max(0, state.motion?.delay ?? 0);
  const iterationCount = state.motion?.loop ?? true ? "infinite" : "1";
  const isGroupAnim = animationType === "bounce" || animationType === "shake" || animationType === "jump";

  const RUNE_KEYFRAMES: Record<string, string> = {
    bounce: `@keyframes rune-bounce {
    0%   { transform: translateY(0) scale(1,1); }
    30%  { transform: translateY(-22px) scale(0.92,1.08); }
    50%  { transform: translateY(0) scale(1.05,0.95); }
    70%  { transform: translateY(-8px) scale(0.98,1.02); }
    100% { transform: translateY(0) scale(1,1); }
  }`,
    shake: `@keyframes rune-shake {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    15%  { transform: translateX(-8px) rotate(-3deg); }
    30%  { transform: translateX(7px) rotate(2deg); }
    45%  { transform: translateX(-5px) rotate(-1.5deg); }
    60%  { transform: translateX(4px) rotate(1deg); }
    75%  { transform: translateX(-2px) rotate(-0.5deg); }
    90%  { transform: translateX(1px) rotate(0deg); }
  }`,
    jump: `@keyframes rune-jump {
    0%, 100% { transform: translateY(0) scale(1,1); }
    15%  { transform: translateY(-30px) scale(0.88,1.12); }
    30%  { transform: translateY(-48px) scale(1.06,0.94); }
    45%  { transform: translateY(-24px) scale(0.94,1.06); }
    60%  { transform: translateY(-6px) scale(1.03,0.97); }
    75%  { transform: translateY(0) scale(0.98,1.02); }
    90%  { transform: translateY(-3px) scale(1.01,0.99); }
  }`,
    draw: `@keyframes rune-draw {
    0%   { stroke-dashoffset: 1200; fill-opacity: 0; }
    70%  { stroke-dashoffset: 0; fill-opacity: 0; }
    100% { stroke-dashoffset: 0; fill-opacity: 1; }
  }`,
    stroke: `@keyframes rune-stroke {
    0%   { stroke-dashoffset: 1200; fill-opacity: 0; }
    55%  { stroke-dashoffset: 0; fill-opacity: 0; }
    85%  { fill-opacity: 0.5; }
    100% { stroke-dashoffset: 0; fill-opacity: 1; }
  }`,
  };

  return `
  .rune-icon-anim {
    transform-box: fill-box;
    transform-origin: 50% 50%;
    ${isGroupAnim ? `animation: rune-${animationType} ${duration}s ${easing} ${delay}s ${iterationCount} both;` : ""}
  }
  ${RUNE_KEYFRAMES[animationType] ?? ""}
  `.trim();
}

async function fetchSvgInnerContent(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) return `<image href="${url}" width="24" height="24" />`;
    const text = await res.text();
    const match = text.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
    if (!match) return `<image href="${url}" width="24" height="24" />`;
    return svgAttrToJsx(
      match[1]
        .trim()

        .replace(/stroke="(?!none|currentColor)[^"]*"/g, 'stroke="currentColor"')

        .replace(/fill="(?!none|currentColor)[^"]*"/g, 'fill="currentColor"')
    );
  } catch {
    return `<image href="${url}" width="24" height="24" />`;
  }
}

export async function fetchSvgInnerContentRaw(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SVG fetch failed: ${res.status}`);
  const text = await res.text();
  const match = text.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (!match) throw new Error("Could not parse SVG inner content");
  return match[1].trim();
}

export async function generatePng(
  selectedIcon: IconData,
  state: CustomizationState
): Promise<Blob> {
  const { width, height } = state;

  const staticState: CustomizationState = state.motion?.enabled
    ? { ...state, motion: { ...state.motion, enabled: false } }
    : state;
  const svgStr = await generateStandaloneSvg(selectedIcon, staticState);

  return new Promise((resolve, reject) => {
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); reject(new Error("No canvas context")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((b) => {
        URL.revokeObjectURL(url);
        b ? resolve(b) : reject(new Error("PNG generation failed"));
      }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("SVG load failed")); };
    img.src = url;
  });
}

function buildGradientDefs(state: CustomizationState): string {
  if (!state.iconGradient) return "";
  const stops = [...state.gradient.stops]
    .sort((a, b) => a.position - b.position)
    .map(s => `<stop offset="${s.position}%" stopColor="${s.color || "#000000"}"/>`)
    .join("\n            ");
  const spreadMethod = state.gradient.spreadMethod ?? "pad";

  if (state.gradient.type === "linear") {
    const rad = (state.gradient.angle * Math.PI) / 180;
    const cx = 12;
    const x1 = (cx - cx * Math.sin(rad)).toFixed(3);
    const y1 = (cx + cx * Math.cos(rad)).toFixed(3);
    const x2 = (cx + cx * Math.sin(rad)).toFixed(3);
    const y2 = (cx - cx * Math.cos(rad)).toFixed(3);
    return `\n        <defs>\n          <linearGradient id="icon-gradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse" spreadMethod="${spreadMethod}">\n            ${stops}\n          </linearGradient>\n        </defs>`;
  }

  if (state.gradient.type === "radial") {
    const cx = ((state.gradient.cx ?? 50) / 100) * 24;
    const cy = ((state.gradient.cy ?? 50) / 100) * 24;
    const r  = ((state.gradient.r  ?? 50) / 100) * 24;
    return `\n        <defs>\n          <radialGradient id="icon-gradient" cx="${cx.toFixed(3)}" cy="${cy.toFixed(3)}" r="${r.toFixed(3)}" gradientUnits="userSpaceOnUse" spreadMethod="${spreadMethod}">\n            ${stops}\n          </radialGradient>\n        </defs>`;
  }

  const cx = ((state.gradient.cx ?? 50) / 100) * 24;
  const cy = ((state.gradient.cy ?? 50) / 100) * 24;
  const segs = buildConicSegments(state.gradient.stops, state.gradient.angle, cx, cy, 17);
  const polys = segs.map(s => `<polygon points="${s.points}" fill="${s.color}"/>`).join("\n            ");
  return `\n        <defs>\n          <pattern id="icon-gradient" width="24" height="24" patternUnits="userSpaceOnUse">\n            ${polys}\n          </pattern>\n        </defs>`;
}

async function buildComponentCode(
  selectedIcon: IconData,
  state: CustomizationState,
  tsx: boolean
): Promise<string> {
  const componentName = buildComponentName(selectedIcon.name);
  const color = state.colors[0] || "#000000";
  const defaultSize = 24;
  const animCss = buildAnimationCss(state);
  const isGradient = state.iconGradient;

  const strokeAttr = isGradient ? `stroke="url(#icon-gradient)"` : `stroke={color}`;
  const fillAttr = state.iconType === "fill"
    ? (isGradient ? `fill="url(#icon-gradient)"` : `fill={color}`)
    : `fill="none"`;
  const gradientDefs = buildGradientDefs(state);

  let innerContent = "";
  if (selectedIcon.url) {
    innerContent = await fetchSvgInnerContent(selectedIcon.url);
  } else if (selectedIcon.icon) {
    const markup = renderToStaticMarkup(
      React.createElement(selectedIcon.icon, { size: 24, strokeWidth: 1.5 })
    );
    innerContent = svgAttrToJsx(markup.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, ""));
  }

  const colorProp = isGradient ? "" : `, color = '${color}'`;
  const colorType = isGradient ? "" : `\n  color?: string;`;
  const propsInterface = tsx
    ? `interface ${componentName}Props {\n  size?: number;${colorType}\n  className?: string;\n}\n\n`
    : "";
  const propsType = tsx ? `: ${componentName}Props` : "";
  const isAnimated = !!animCss;
  const cssBlock = isAnimated ? `\nconst css = \`\n${animCss}\n\`;\n` : "";
  const svgClassName = isAnimated
    ? `className={\`rune-icon-anim \${className}\`}`
    : `className={className}`;
  const styleTag = isAnimated ? `\n      <style>{css}</style>` : "";
  const wrapper = isAnimated ? `(\n    <>${styleTag}\n      ` : `(\n    `;
  const wrapperClose = isAnimated ? `\n    </>` : ``;

  return `
import React from 'react';

${propsInterface}${cssBlock}
export function ${componentName}({ size = ${defaultSize}${colorProp}, className = '' }${propsType}) {
  return ${wrapper}<svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        ${fillAttr}
        ${strokeAttr}
        strokeWidth={${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeWidth}}
        strokeLinecap="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinecap}"
        strokeLinejoin="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinejoin}"
        ${svgClassName}
      >${gradientDefs}
        ${innerContent}
      </svg>${wrapperClose}
  );
}

export default ${componentName};`.trim();
}

export async function generateJsxComponent(selectedIcon: IconData, state: CustomizationState) {
  return buildComponentCode(selectedIcon, state, false);
}

export async function generateTsxComponent(selectedIcon: IconData, state: CustomizationState) {
  return buildComponentCode(selectedIcon, state, true);
}

export async function generateGsapComponent(
  selectedIcon: IconData,
  state: CustomizationState,
): Promise<string> {
  const componentName = buildComponentName(selectedIcon.name);
  const color = state.colors[0] || "#000000";

  let innerContent = "";
  if (selectedIcon.url) {
    try {
      const raw = await fetchSvgInnerContentRaw(selectedIcon.url);
      innerContent = raw
        .replace(/\bstroke="(?!none)[^"]*"/g, `stroke="${color}"`)
        .replace(/\bfill="(?!none)[^"]*"/g, `fill="none"`);
    } catch {
      innerContent = "";
    }
  } else if (selectedIcon.icon) {
    const markup = renderToStaticMarkup(
      React.createElement(selectedIcon.icon, { size: 24, strokeWidth: 2 })
    );
    const match = markup.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
    if (match) innerContent = match[1].trim();
  }

  return `
import React from 'react';

export function ${componentName}({ size = 24, color = '${color}' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeWidth}} strokeLinecap="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinecap}" strokeLinejoin="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinejoin}">
      ${innerContent}
    </svg>
  );
}

export default ${componentName};`.trim();
}

export async function generateFramerComponent(
  selectedIcon: IconData,
  state: CustomizationState,
): Promise<string> {
  const componentName = buildComponentName(selectedIcon.name);
  const loop = state.motion?.loop ?? false;
  const duration = Math.max(0.2, state.motion?.duration ?? 2);
  const stagger = state.motion?.pathSequential ? (state.motion?.pathStaggerDelay ?? 0.08) : 0;
  const easing = resolveEasingValue(state.motion?.easingId, state.motion?.customCubic);

  let innerContent = "";
  if (selectedIcon.url) {
    try {
      const raw = await fetchSvgInnerContentRaw(selectedIcon.url);
      const color = state.colors[0] || "currentColor";
      innerContent = raw
        .replace(/\bstroke="(?!none)[^"]*"/g, `stroke="${color}"`)
        .replace(/\bfill="(?!none)[^"]*"/g, `fill="none"`);
    } catch {
      innerContent = "";
    }
  } else if (selectedIcon.icon) {
    const markup = renderToStaticMarkup(
      React.createElement(selectedIcon.icon, { size: 24, strokeWidth: 2 })
    );
    const match = markup.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
    if (match) innerContent = match[1].trim();
  }

  let fmEase: string;
  if (easing.startsWith("cubic-bezier")) {
    const m = easing.match(/cubic-bezier\(\s*([\d.+-]+)\s*,\s*([\d.+-]+)\s*,\s*([\d.+-]+)\s*,\s*([\d.+-]+)\s*\)/);
    fmEase = m ? `[${m[1]}, ${m[2]}, ${m[3]}, ${m[4]}]` : '"easeInOut"';
  } else {
    fmEase = '"easeInOut"';
  }

  const repeatStr = loop ? "Infinity" : "0";

  return `

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: ${stagger},
    },
  },
};

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: ${duration},
      ease: ${fmEase},
      repeat: ${repeatStr},
    },
  },
};

export function ${componentName}({
  color = '${state.colors[0] || '#000000'}',
  animate = true,
}) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeWidth}}
      strokeLinecap="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinecap}"
      strokeLinejoin="${STROKE_STYLE_MAP[state.strokeStyle ?? "round"].strokeLinejoin}"
      variants={containerVariants}
      initial="hidden"
      animate={animate ? 'visible' : 'hidden'}
    >
      ${innerContent
        .replace(/<(path|circle|rect|ellipse|line|polyline|polygon)(\s)/g, "<motion.$1$2")
        .replace(/<\/(path|circle|rect|ellipse|line|polyline|polygon)>/g, "</motion.$1>")
        .replace(/(<motion\.[a-z]+\s[^>]*?)(\/>)/g, "$1 variants={pathVariants}$2")
      }
    </motion.svg>
  );
}

export default ${componentName};`.trim();
}
