import { getIconsForType } from "@/lib/icons";

// Kept as a backward-compatible export. Prefer `getIconsForType(iconType)` from
// `@/lib/icons` directly so the list reflects the user's current icon type.
export const REAL_ICONS = getIconsForType("normal");
