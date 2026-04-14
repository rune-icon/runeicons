import { CustomizationState, IconData } from "./types";

/**
 * Generates a Tailwind CSS class string based on the customization state.
 * Note: Some properties like gradients and complex shadows use arbitrary values.
 */
export function generateTailwindSnippet(state: CustomizationState): string {
  const classes = [];
  
  // Size
  classes.push(`w-[${state.width}px] h-[${state.height}px]`);
  
  // Basic Color
  if (!state.iconGradient) {
    classes.push(`text-[${state.colors[0]}]`);
  }
  
  // Transforms
  if (state.scale !== 1) classes.push(`scale-[${state.scale}]`);
  if (state.rotation !== 0) classes.push(`rotate-[${state.rotation}deg]`);
  if (state.flipH) classes.push("-scale-x-100");
  if (state.flipV) classes.push("-scale-y-100");
  
  // Blur
  if (state.blurEnabled && state.blur > 0) {
    classes.push(`blur-[${state.blur}px]`);
  }
  
  return classes.join(" ");
}

/**
 * Generates a Framer Motion React component snippet.
 */
export function generateFramerMotionSnippet(icon: IconData, state: CustomizationState): string {
  const componentName = icon.name.replace(/\s+/g, "");
  
  const springConfig = `{ type: "spring", stiffness: 300, damping: 20 }`;
  
  const styleObj = {
    width: state.width,
    height: state.height,
    rotate: state.rotation,
    scale: state.scale,
    x: state.translateX,
    y: state.translateY,
    filter: state.blurEnabled ? `blur(${state.blur}px)` : undefined,
  };

  return `import { motion } from "framer-motion";
import { ${componentName} } from "lucide-react";

export const AnimatedIcon = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: ${state.scale},
        rotate: ${state.rotation},
        x: ${state.translateX},
        y: ${state.translateY}
      }}
      transition={${springConfig}}
      style={{
        width: ${state.width},
        height: ${state.height},
        color: "${state.colors[0]}",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <${componentName} size={24} />
    </motion.div>
  );
};`;
}

/**
 * Generates a React component snippet with Lucide.
 */
export function generateReactSnippet(icon: IconData, state: CustomizationState): string {
  const componentName = icon.name.replace(/\s+/g, "");
  const color = state.colors[0];
  
  return `import { ${componentName} } from 'lucide-react';

export default function MyIcon() {
  return (
    <div className="${generateTailwindSnippet(state)} flex items-center justify-center">
      <${componentName} 
        size={24} 
        strokeWidth={2} 
        color="${color}" 
        style={{
            transform: \`rotate(${state.rotation}deg) scale(${state.scale})\`,
            ${state.blurEnabled ? `filter: 'blur(${state.blur}px)',` : ""}
        }}
      />
    </div>
  );
}`;
}

/**
 * Generates a clean SVG path for Figma (flattened as much as possible).
 */
export function generateFigmaSvgSnippet(icon: IconData, state: CustomizationState): string {
  // Figma handles regular SVG well, but prefers plain paths.
  // We'll reuse the standalone generator but ensure it's "flat".
  // For now, we'll return the standard standalone SVG which is standard.
  return `<!-- Figma Friendly SVG -->
<svg width="${state.width}" height="${state.height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(12 12) rotate(${state.rotation}) scale(${state.scale}) translate(-12 -12)">
    <!-- Path content normally goes here -->
  </g>
</svg>`;
}
