

export type HexColor = `#${string}`;

export interface RGBColor {
    r: number;
    g: number;
    b: number;
}

export interface HSBColor {
    hue: number;
    saturation: number;
    brightness: number;
}

export interface HSLColor {
    h: number;
    s: number;
    l: number;
}


export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}


export function normalizeHexColor(value: string, defaultColor: HexColor = '#007aff'): HexColor {
    const trimmed = value.trim().toLowerCase();
    const expanded = trimmed.match(/^#?[0-9a-f]{3}$/)
        ? trimmed.replace('#', '').split('').map((char) => char + char).join('')
        : trimmed.replace(/^#/, '');

    if (!/^[0-9a-f]{6}$/.test(expanded)) {
        return defaultColor;
    }

    return `#${expanded}` as HexColor;
}


export function rgbToHex({ r, g, b }: RGBColor): HexColor {
    const parts = [r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0'));
    return `#${parts.join('')}` as HexColor;
}


export function hexToRgb(value: string): RGBColor {
    const normalized = normalizeHexColor(value).slice(1);
    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16),
    };
}


export function rgbToHsb({ r, g, b }: RGBColor): HSBColor {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;

    let hue = 0;

    if (delta !== 0) {
        if (max === red) {
            hue = 60 * (((green - blue) / delta) % 6);
        } else if (max === green) {
            hue = 60 * ((blue - red) / delta + 2);
        } else {
            hue = 60 * ((red - green) / delta + 4);
        }
    }

    if (hue < 0) {
        hue += 360;
    }

    const saturation = max === 0 ? 0 : delta / max;

    return {
        hue,
        saturation,
        brightness: max * 100,
    };
}


export function hexToHsb(value: string): HSBColor {
    return rgbToHsb(hexToRgb(value));
}


export function hsbToRgb({ hue, saturation, brightness }: HSBColor): RGBColor {
    const normalizedHue = ((hue % 360) + 360) % 360;
    const safeSaturation = clamp(saturation, 0, 1);
    const safeBrightness = clamp(brightness, 0, 100) / 100;
    const chroma = safeBrightness * safeSaturation;
    const huePrime = normalizedHue / 60;
    const x = chroma * (1 - Math.abs((huePrime % 2) - 1));

    let red = 0;
    let green = 0;
    let blue = 0;

    if (huePrime >= 0 && huePrime < 1) {
        red = chroma;
        green = x;
    } else if (huePrime < 2) {
        red = x;
        green = chroma;
    } else if (huePrime < 3) {
        green = chroma;
        blue = x;
    } else if (huePrime < 4) {
        green = x;
        blue = chroma;
    } else if (huePrime < 5) {
        red = x;
        blue = chroma;
    } else {
        red = chroma;
        blue = x;
    }

    const match = safeBrightness - chroma;

    return {
        r: Math.round((red + match) * 255),
        g: Math.round((green + match) * 255),
        b: Math.round((blue + match) * 255),
    };
}


export function hsbToHex(hsb: HSBColor): HexColor {
    return rgbToHex(hsbToRgb(hsb));
}


export function adjustBorderColor(
    color: HexColor,
    saturationMultiplier: number,
    brightnessMultiplier: number
): HexColor {
    const hsb = hexToHsb(color);
    return hsbToHex({
        hue: hsb.hue,
        saturation: clamp(hsb.saturation * saturationMultiplier, 0, 1),
        brightness: clamp(hsb.brightness * brightnessMultiplier, 0, 100),
    });
}


export function colorsMatch(left: string, right: string, tolerance = 0.01): boolean {
    const a = hexToHsb(left);
    const b = hexToHsb(right);
    const hueA = a.hue / 360;
    const hueB = b.hue / 360;
    const hueDistance = Math.abs(hueA - hueB);

    return (
        (hueDistance < tolerance || hueDistance > 1 - tolerance) &&
        Math.abs(a.saturation - b.saturation) < tolerance &&
        Math.abs(a.brightness / 100 - b.brightness / 100) < tolerance
    );
}


export function hslToRgb(h: number, s: number, l: number): RGBColor {
    const sNorm = s / 100;
    const lNorm = l / 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = sNorm * Math.min(lNorm, 1 - lNorm);
    const f = (n: number) => lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
        r: Math.round(255 * f(0)),
        g: Math.round(255 * f(8)),
        b: Math.round(255 * f(4)),
    };
}


export function hslToHex(h: number, s: number, l: number): HexColor {
    return rgbToHex(hslToRgb(h, s, l));
}


export function rgbToHsl({ r, g, b }: RGBColor): HSLColor {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
            case gNorm: h = (bNorm - rNorm) / d + 2; break;
            case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}


export function hexToHsl(hex: string): HSLColor {
    return rgbToHsl(hexToRgb(hex));
}
