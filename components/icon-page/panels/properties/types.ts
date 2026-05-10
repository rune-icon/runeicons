import { CustomizationState } from "@/lib/types";

export interface PropertiesPanelProps {
  state: CustomizationState;
  selectedIcon?: any;
  onIconSelect?: (icon: any) => void;
  onDeleteIcon?: (id: string) => void;
  onChange: (updates: Partial<CustomizationState>) => void;
  onReset: () => void;
}

export interface CustomizationSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  pathCount?: number;
}
