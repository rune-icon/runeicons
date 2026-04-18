"use client";

import { PropertiesPanelProps } from "./types";
import { useConfigPersistence } from "./hooks/use-config-persistence";
import { useColorInput } from "./hooks/use-color-input";
import { useCustomIconUpload } from "./hooks/use-custom-icon-upload";
import { useGradientStops } from "./hooks/use-gradient-stops";

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
  const { handleExport, handleImport } = useConfigPersistence(state, onChange);

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
      className="h-full overflow-y-auto custom-scrollbar bg-background"
      role="region"
      aria-label="Customization controls panel"
    >
      <div className="p-4 pt-6 space-y-6">
        <PanelHeader 
          onExport={handleExport} 
          onImport={handleImport}
          onReset={onReset} 
        />
        
        <div className="space-y-2">
          <ColorSection
            state={state}
            onChange={onChange}
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
          />

          <CornerRadiusSection
            state={state}
            onChange={onChange}
          />

          <FlipRotateSection
            state={state}
            onChange={onChange}
          />

          <ShadowSection
            state={state}
            onChange={onChange}
          />

          <NoiseSection
            state={state}
            onChange={onChange}
          />

          <TextureSection
            state={state}
            onChange={onChange}
          />

          <UploadSection
            state={state}
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
      </div>
    </div>
  );
}
