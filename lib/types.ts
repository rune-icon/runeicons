import type { LucideIcon } from "lucide-react";

export interface CustomizationState {
  colors: string[];
  numColors: number;
  scale: number;
  blur: number;
  translateX: number;
  translateY: number;
  padding: number;
  cornerRadius: number;
  flipH: boolean;
  flipV: boolean;
  rotation: number;
  width: number;
  height: number;
  lockAspect: boolean;
  iconGradient: boolean;
  shadow: {
    opacity: number;
    blur: number;
    offsetX: number;
    offsetY: number;
    inner: boolean;
  };
  noise: {
    enabled: boolean;
    intensity: number;
  };
  texture: {
    selected: string;
    opacity: number;
  };
  gradient: {
    type: "linear" | "radial" | "angular";
    angle: number;
    stops: Array<{ color: string; position: number }>;
  };
  customIcons: Array<{ id: string; name: string; url: string }>;
  iconType: "normal" | "duotone" | "fill" | "pixelated" | "glass" | "isometric" | "dither";
}

export interface IconData {
  id: string;
  name: string;
  icon: LucideIcon;
  category: IconCategory;
  tags: string[];
}

export type IconCategory = "all" | "outline" | "filled" | "duotone" | "brand" | "custom" | "action" | "shapes" | "emojis" | "food";
export type Collection = "all" | "favorites" | "recent";


