import { CustomizationState } from "@/lib/types";

export interface PropertiesPanelProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
  onReset: () => void;
}

export interface CustomizationSectionProps {
  state: CustomizationState;
  onChange: (updates: Partial<CustomizationState>) => void;
}
