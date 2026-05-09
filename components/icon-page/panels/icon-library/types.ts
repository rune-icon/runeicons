import { IconData, IconCategory } from "@/lib/types";

export interface IconLibraryPanelProps {
  onIconSelect?: (icon: IconData) => void;
  selectedIconId?: string | null;
  selectedCategory: IconCategory;
  onCategoryChange: (category: IconCategory) => void;
  customIcons?: Array<{ id: string; name: string; url: string }>;
}
