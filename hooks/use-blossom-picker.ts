import { useState, useCallback, useRef } from 'react';
import { 
    HexColor, 
    normalizeHexColor, 
    hexToHsb, 
    hsbToHex, 
    clamp 
} from '../lib/color-utils';
import { Ring } from '../lib/blossom-utils';

interface UseBlossomModelOptions {
    value?: HexColor;
    defaultValue?: HexColor;
    onChange?: (color: HexColor) => void;
    defaultColor?: HexColor;
}

export function useBlossomColorPickerModel({ 
    value, 
    defaultValue, 
    onChange,
    defaultColor = '#007aff'
}: UseBlossomModelOptions) {
    const [uncontrolledColor, setUncontrolledColor] = useState<HexColor>(
        normalizeHexColor(value ?? defaultValue ?? defaultColor, defaultColor)
    );
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredPetalIndex, setHoveredPetalIndex] = useState<number | null>(null);
    const [hoveredRing, setHoveredRing] = useState<Ring | null>(null);
    const [isDraggingArc, setIsDraggingArc] = useState(false);
    const dragPointerIdRef = useRef<number | null>(null);

    const selectedColor = normalizeHexColor(value ?? uncontrolledColor, defaultColor);
    const hsb = hexToHsb(selectedColor);

    const commitColor = useCallback((color: HexColor) => {
        const normalized = normalizeHexColor(color, defaultColor);
        setUncontrolledColor(normalized);
        onChange?.(normalized);
    }, [onChange, defaultColor]);

    const updateLightness = useCallback((lightness: number) => {
        const nextColor = hsbToHex({
            hue: hsb.hue,
            saturation: hsb.saturation,
            brightness: clamp(lightness, 0, 100),
        });

        setUncontrolledColor(nextColor);
        onChange?.(nextColor);
    }, [hsb.hue, hsb.saturation, onChange]);

    const clearHover = useCallback(() => {
        setHoveredPetalIndex(null);
        setHoveredRing(null);
    }, []);

    return {

        selectedColor,
        hue: hsb.hue,
        saturation: hsb.saturation,
        lightness: hsb.brightness,
        isOpen,
        hoveredPetalIndex,
        hoveredRing,
        isDraggingArc,
        dragPointerIdRef,

        setIsOpen,
        setHoveredPetalIndex,
        setHoveredRing,
        setIsDraggingArc,
        commitColor,
        updateLightness,
        clearHover,
    };
}
