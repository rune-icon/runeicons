"use client";

import { PropertiesPanelProps } from "./types";
import { useConfigPersistence } from "./hooks/use-config-persistence";
import { useCustomIconUpload } from "./hooks/use-custom-icon-upload";
import { PanelHeader } from "./components/PanelHeader";
import { ColorSection } from "./sections/color-section";
import { SizeTransformSection } from "./sections/size-transform-section";
import { FlipRotateSection } from "./sections/flip-rotate-section";
import { ShadowSection } from "./sections/shadow-section";
import { NoiseSection } from "./sections/noise-section";
import { TextureSection } from "./sections/texture-section";
import { UploadSection } from "./sections/upload-section";
import { MotionSection } from "./sections/motion-section";

import { StrokeStyleSection } from "./sections/stroke-style-section";

export function PropertiesPanel({
  state,
  selectedIcon,
  onIconSelect,
  onDeleteIcon,
  onChange,
  onReset,
}: PropertiesPanelProps) {
  const { handleExport, handleImport } = useConfigPersistence(state, onChange);

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
  } = useCustomIconUpload(state, onChange, onDeleteIcon);

  return (
    <div
      className="h-full overflow-y-auto custom-scrollbar bg-background"
      role="region"
      aria-label="Customization controls panel"
    >
      <div className="p-4 pt-4 space-y-2">
        <PanelHeader 
          onExport={handleExport} 
          onImport={handleImport}
          onReset={onReset} 
        />
        
        <div className="space-y-2 pb-10">
          <ColorSection
            state={state}
            onChange={onChange}
          />

          <SizeTransformSection state={state} onChange={onChange} />

          <MotionSection 
            state={state} 
            onChange={onChange} 
            pathCount={selectedIcon?.pathCount ?? 0}
          />
          
          <StrokeStyleSection state={state} onChange={onChange} />

          <FlipRotateSection state={state} onChange={onChange} />

          <ShadowSection state={state} onChange={onChange} />

          <NoiseSection state={state} onChange={onChange} />

          <TextureSection state={state} onChange={onChange} />

          <UploadSection
            state={state}
            onIconSelect={onIconSelect}
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
