import { clamp } from './color-utils';

export interface Point {
    x: number;
    y: number;
}

export interface BlossomLayoutConfig {
    innerPetalCount: number;
    outerPetalCount: number;
    innerRadius: number;
    outerRadius: number;
}

export interface BlossomStyleConfig {
    petalSize: number;
    innerPetalSize: number;
    outerRingBorderWidth: number;
    centerCircleSize: number;
    sliderWidth: number;
    sliderHeight: number;
    spacing: number;
}

export type Ring = 'inner' | 'outer';

export function polarToCartesian(center: Point, radius: number, angleDegrees: number): Point {
    const radians = (angleDegrees * Math.PI) / 180;
    return {
        x: center.x + Math.cos(radians) * radius,
        y: center.y + Math.sin(radians) * radius,
    };
}

export function describeArc(center: Point, radius: number, startAngle: number, endAngle: number): string {
    const start = polarToCartesian(center, radius, endAngle);
    const end = polarToCartesian(center, radius, startAngle);
    const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? '0' : '1';

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function getRingPetalCount(ring: Ring, layout: BlossomLayoutConfig): number {
    return ring === 'inner' ? layout.innerPetalCount : layout.outerPetalCount;
}

export function getRingRadius(ring: Ring, layout: BlossomLayoutConfig): number {
    return ring === 'inner' ? layout.innerRadius : layout.outerRadius;
}

export function getPetalAngle(index: number, ring: Ring, layout: BlossomLayoutConfig): number {
    const count = getRingPetalCount(ring, layout);
    return index * (360 / count) - 90;
}

export function getPetalPosition(index: number, ring: Ring, center: Point, layout: BlossomLayoutConfig): Point {
    const angle = getPetalAngle(index, ring, layout);
    return polarToCartesian(center, getRingRadius(ring, layout), angle);
}

export function getExpandedMetrics(
    layout: BlossomLayoutConfig,
    style: {
        petalSize: number;
        sliderWidth: number;
        spacing: number;
    },
    viewPadding: number,
    outerRingInset: number
) {
    const ringRadius = layout.outerRadius + style.petalSize / 2 + outerRingInset;
    const sliderRadius = ringRadius + style.sliderWidth / 2 + style.spacing;
    const totalSize = sliderRadius * 2 + style.sliderWidth + viewPadding;
    const center = {
        x: totalSize / 2,
        y: totalSize / 2,
    };

    return {
        ringRadius,
        sliderRadius,
        totalSize,
        center,
    };
}

export function clampPortalPosition(value: number, viewport: number, popupSize: number, viewportPadding: number): number {
    return clamp(value, viewportPadding, viewport - popupSize - viewportPadding);
}
