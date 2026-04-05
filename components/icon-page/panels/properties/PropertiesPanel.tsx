"use client";

import { PropertiesPanelProps } from "./types";
import { useCollapsibleSections } from "./hooks/use-collapsible-sections";
import { useColorInput } from "./hooks/use-color-input";
import { useCustomIconUpload } from "./hooks/use-custom-icon-upload";
import { useGradientStops } from "./hooks/use-gradient-stops";
import { useExportCustomization } from "./hooks/use-export-customization";

import { PanelHeader } from "./components/PanelHeader";
import { ColorSection } from "./sections/color-section";
import { SizeTransformSection } from "./sections/size-transform-section";
import { CornerRadiusSection } from "./sections/corner-radius-section";
import { FlipRotateSection } from "./sections/flip-rotate-section";
import { ShadowSection } from "./sections/shadow-section";
import { NoiseSection } from "./sections/noise-section";
import { TextureSection } from "./sections/texture-section";
import { UploadSection } from "./sections/upload-section";

export function PropertiesPanel({
  state,
  onChange,
  onReset,
}: PropertiesPanelProps) {
  const { collapsedSections, toggleSection } = useCollapsibleSections();
  const { handleExport } = useExportCustomization(state);

  const {
    inputFormat,
    setInputFormat,
    getColorInputValue,
    handleColorInputChange,
    handleColorInputBlur,
  } = useColorInput(state, onChange);

  const { addGradientStop, updateGradientStop, removeGradientStop } =
    useGradientStops(state, onChange);

  const {
    isDragging,
    uploadError,
    setUploadError,
    isUploading,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    deleteIcon,
    MAX_CUSTOM_ICONS,
  } = useCustomIconUpload(state, onChange);

  return (
    <div
      className="h-full overflow-y-auto space-y-3 p-4"
      role="region"
      aria-label="Customization controls panel"
    >
      <PanelHeader onExport={handleExport} onReset={onReset} />

      <ColorSection
        state={state}
        onChange={onChange}
        isCollapsed={collapsedSections.has("colors")}
        onToggle={() => toggleSection("colors")}
        inputFormat={inputFormat}
        setInputFormat={setInputFormat}
        getColorInputValue={getColorInputValue}
        handleColorInputChange={handleColorInputChange}
        handleColorInputBlur={handleColorInputBlur}
        addGradientStop={addGradientStop}
        updateGradientStop={updateGradientStop}
        removeGradientStop={removeGradientStop}
      />

      <SizeTransformSection
        state={state}
        onChange={onChange}
        isCollapsed={collapsedSections.has("size")}
        onToggle={() => toggleSection("size")}
      />

      <CornerRadiusSection
        state={state}
        onChange={onChange}
        isCollapsed={collapsedSections.has("padding")}
        onToggle={() => toggleSection("padding")}
      />

      <FlipRotateSection
        state={state}
        onChange={onChange}
        isCollapsed={collapsedSections.has("flip")}
        onToggle={() => toggleSection("flip")}
      />

      <ShadowSection
        state={state}
        onChange={onChange}
        isCollapsed={collapsedSections.has("shadow")}
        onToggle={() => toggleSection("shadow")}
      />

      <NoiseSection
        state={state}
        onChange={onChange}
        isCollapsed={collapsedSections.has("noise")}
        onToggle={() => toggleSection("noise")}
      />

      <TextureSection
        state={state}
        onChange={onChange}
        isCollapsed={collapsedSections.has("texture")}
        onToggle={() => toggleSection("texture")}
      />

      <UploadSection
        state={state}
        isCollapsed={collapsedSections.has("upload")}
        onToggle={() => toggleSection("upload")}
        isDragging={isDragging}
        uploadError={uploadError}
        setUploadError={setUploadError}
        isUploading={isUploading}
        handleFileUpload={handleFileUpload}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        deleteIcon={deleteIcon}
        maxIcons={MAX_CUSTOM_ICONS}
      />
    </div>
  );
}
