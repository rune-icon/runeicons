export interface GradientStop {
  color: string;
  position: number;
}

function lerpHex(c1: string, c2: string, t: number): string {
  const parse = (c: string) => {
    const h = c.replace("#", "").replace(/^([0-9a-f])([0-9a-f])([0-9a-f])$/i, "$1$1$2$2$3$3");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parse(c1 || "#000000");
  const [r2, g2, b2] = parse(c2 || "#000000");
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

export function interpolateStops(stops: GradientStop[], t: number): string {
  const s = [...stops].sort((a, b) => a.position - b.position);
  const pos = t * 100;
  if (!s.length) return "#000000";
  if (pos <= s[0].position) return s[0].color;
  const last = s[s.length - 1];
  if (pos >= last.position) return last.color;
  for (let i = 0; i < s.length - 1; i++) {
    if (pos >= s[i].position && pos <= s[i + 1].position) {
      const range = s[i + 1].position - s[i].position;
      return lerpHex(s[i].color, s[i + 1].color, range === 0 ? 0 : (pos - s[i].position) / range);
    }
  }
  return last.color;
}

export interface ConicSegment {
  points: string;
  color: string;
}

export function buildConicSegments(
  stops: GradientStop[],
  startAngleDeg: number,
  cx: number,
  cy: number,
  r: number,
  n = 72
): ConicSegment[] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / n;

    const a1 = ((startAngleDeg + t * 360 - 90) * Math.PI) / 180;
    const a2 = ((startAngleDeg + ((i + 1) / n) * 360 - 90) * Math.PI) / 180;
    const x1 = (cx + r * Math.cos(a1)).toFixed(3);
    const y1 = (cy + r * Math.sin(a1)).toFixed(3);
    const x2 = (cx + r * Math.cos(a2)).toFixed(3);
    const y2 = (cy + r * Math.sin(a2)).toFixed(3);
    return {
      points: `${cx.toFixed(3)},${cy.toFixed(3)} ${x1},${y1} ${x2},${y2}`,
      color: interpolateStops(stops, t),
    };
  });
}
