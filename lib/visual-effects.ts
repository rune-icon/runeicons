export interface Texture {
  id: string;
  name: string;
  path?: string;
}

export const TEXTURES: Texture[] = [
  { id: "none", name: "None" },
  { id: "paper", name: "Paper", path: "/textures/paper.png" },
  { id: "fabric", name: "Fabric", path: "/textures/fabric.png" },
  { id: "concrete", name: "Concrete", path: "/textures/concrete.png" },
  { id: "wood", name: "Wood", path: "/textures/wood.png" },
  { id: "metal", name: "Metal", path: "/textures/metal.png" },
];

export const NOISE_STYLES = `
  .noise-track-custom {
    background-color: hsl(var(--background)) !important;
    background-image: 
      linear-gradient(to right, transparent, hsl(var(--foreground) / 0.8)),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
      repeating-linear-gradient(45deg, hsl(var(--border)) 25%, transparent 25%, transparent 75%, hsl(var(--border)) 75%, hsl(var(--border))), 
      repeating-linear-gradient(45deg, hsl(var(--border)) 25%, transparent 25%, transparent 75%, hsl(var(--border)) 75%, hsl(var(--border))) !important;
    background-size: 100% 100%, 100px 100px, 8px 8px, 8px 8px !important;
    background-position: 0 0, 0 0, 0 0, 4px 4px !important;
    background-blend-mode: normal, overlay, normal, normal !important;
    box-shadow: inset 0 0 0 1px hsl(var(--border));
  }
`;
