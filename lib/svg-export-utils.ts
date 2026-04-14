import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { CustomizationState, IconData } from "./types";

export function generateStandaloneSvg(selectedIcon: IconData, state: CustomizationState): string {
  const IconComponent = selectedIcon.icon;

  const strokeColor = state.iconGradient ? "url(#icon-gradient)" : state.colors[0] || "currentColor";
  const fillColor = state.iconType === "fill" 
    ? (state.colors[0] || "currentColor") 
    : state.iconType === "duotone" 
      ? `${state.colors[0] || "currentColor"}33` 
      : "none";
  
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

  const innerContent = iconMarkup.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");

  let defs = "";
  
  // Icon Gradient
  if (state.iconGradient) {
    const stops = state.gradient.stops.map(s => 
      `<stop offset="${s.position}%" stop-color="${s.color || "#000000"}" />`
    ).join("");
    
    if (state.gradient.type === "linear") {
      defs += `<linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${state.gradient.angle})">${stops}</linearGradient>`;
    } else {
      defs += `<radialGradient id="icon-gradient" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`;
    }
  }

  if (state.shadow.enabled && state.shadow.inner) {
    defs += `
      <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="${state.shadow.blur}" result="blur"/>
        <feComposite operator="out" in="SourceAlpha" in2="blur" result="inverse"/>
        <feFlood flood-color="black" flood-opacity="${state.shadow.opacity / 100}" result="color"/>
        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
        <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
      </filter>`;
  }

  const finalSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${state.width}" height="${state.height}" viewBox="0 0 24 24" fill="none">
  <defs>${defs}</defs>
  
  <!-- Background Rect -->
  <rect 
    width="24" 
    height="24" 
    rx="${(state.cornerRadius / state.width) * 24}" 
    ry="${(state.cornerRadius / state.height) * 24}"
    fill="transparent" 
  />

  <g transform="
    translate(12, 12) 
    scale(${state.scale}) 
    rotate(${state.rotation}) 
    translate(-12, -12) 
    translate(${ (state.translateX / state.width) * 24 }, ${ (state.translateY / state.height) * 24 })
    ${state.flipH ? "scale(-1, 1) translate(-24, 0)" : ""}
    ${state.flipV ? "scale(1, -1) translate(0,-24)" : ""}
  ">
    ${innerContent}
  </g>
</svg>`.trim();

  return finalSvg;
}
