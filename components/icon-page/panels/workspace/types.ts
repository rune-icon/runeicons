import { IconCategory, IconData } from "@/lib/types";

export interface WorkspaceSelectionState {
  activeCategory: IconCategory;
  selectedIcon: IconData | null;
  trayIcons: IconData[];
}
