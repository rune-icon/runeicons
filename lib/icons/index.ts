import type { IconData } from "@/lib/types";
import {
  NORMAL_ICONS_MANIFEST,
  GLASS_ICONS_MANIFEST,
  type IconType,
  type NormalIconEntry,
  type GlassIconEntry,
} from "./manifest.generated";

export type { IconType, NormalIconEntry, GlassIconEntry };
export { NORMAL_ICONS_MANIFEST, GLASS_ICONS_MANIFEST };

export type StateIconType =
  | "normal"
  | "duotone"
  | "fill"
  | "pixelated"
  | "glass"
  | "isometric"
  | "dither";

const FILE_BACKED_TYPES = new Set<StateIconType>([
  "normal",
  "duotone",
  "fill",
  "pixelated",
  "glass",
]);

export function resolveLibraryIconType(state: StateIconType): IconType {
  return (FILE_BACKED_TYPES.has(state) ? state : "normal") as IconType;
}

const NORMAL_BY_ID = new Map<string, NormalIconEntry>(
  NORMAL_ICONS_MANIFEST.map((e) => [e.id, e]),
);
const GLASS_BY_ID = new Map<string, GlassIconEntry>(
  GLASS_ICONS_MANIFEST.map((e) => [e.id, e]),
);

function toIconData(e: NormalIconEntry, iconType: Exclude<IconType, "glass">): IconData {
  return {
    id: e.id,
    name: e.name,
    url: `/${iconType}/${e.folder}/${e.basename}.svg`,
    category: e.category,
    tags: e.tags,
  };
}

function glassToIconData(e: GlassIconEntry): IconData {
  return {
    id: e.id,
    name: e.name,
    url: `/glass-icons/${e.filename}`,
    category: e.category,
    tags: e.tags,
  };
}

export function getIconsForType(iconType: IconType): IconData[] {
  if (iconType === "glass") {
    return GLASS_ICONS_MANIFEST.map(glassToIconData);
  }
  return NORMAL_ICONS_MANIFEST
    .filter((e) => e.availability[iconType])
    .map((e) => toIconData(e, iconType));
}

export function getIconUrlById(id: string, iconType: IconType): string | null {
  if (iconType === "glass") {
    const g = GLASS_BY_ID.get(id);
    return g ? `/glass-icons/${g.filename}` : null;
  }
  const n = NORMAL_BY_ID.get(id);
  if (!n || !n.availability[iconType]) return null;
  return `/${iconType}/${n.folder}/${n.basename}.svg`;
}

export function getIconDataById(id: string, iconType: IconType): IconData | null {
  if (iconType === "glass") {
    const g = GLASS_BY_ID.get(id);
    return g ? glassToIconData(g) : null;
  }
  const n = NORMAL_BY_ID.get(id);
  if (!n || !n.availability[iconType]) return null;
  return toIconData(n, iconType);
}
