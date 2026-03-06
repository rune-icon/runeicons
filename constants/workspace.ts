import { Rocket, Heart, Star, Smile, Coffee } from "lucide-react";
import { CustomizationState, IconData } from "@/lib/types";

export const DEFAULT_STATE: CustomizationState = {
  colors: ["#000000"], // Solid black
  numColors: 1,
  scale: 1,
  blur: 0,
  translateX: 0,
  translateY: 0,
  padding: 4,
  cornerRadius: 12,
  flipH: false,
  flipV: false,
  rotation: 0,
  width: 128,
  height: 128,
  lockAspect: true,
  iconGradient: false,
  shadow: {
    opacity: 0,
    blur: 10,
    offsetX: 0,
    offsetY: 4,
    inner: false,
  },
  noise: {
    enabled: false,
    intensity: 20,
  },
  texture: {
    selected: "none",
    opacity: 50,
  },
  gradient: {
    type: "linear",
    angle: 90,
    stops: [
      { color: "#000000", position: 0 },
      { color: "#333333", position: 100 },
    ],
  },
  customIcons: [],
  iconType: "normal",
};

export const DEFAULT_TRAY_ICONS: IconData[] = [
  { id: "rocket", name: "Rocket", icon: Rocket, category: "action", tags: ["rocket", "start"] },
  { id: "heart", name: "Heart", icon: Heart, category: "shapes", tags: ["heart", "love"] },
  { id: "star", name: "Star", icon: Star, category: "shapes", tags: ["star", "rating"] },
  { id: "smile", name: "Smile", icon: Smile, category: "emojis", tags: ["smile", "happy"] },
  { id: "coffee", name: "Coffee", icon: Coffee, category: "food", tags: ["coffee", "drink"] },
];
