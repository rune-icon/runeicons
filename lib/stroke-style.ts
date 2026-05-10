export type StrokeStyle = "round" | "sharp" | "square" | "soft" | "medium" | "heavy";

export const STROKE_STYLE_MAP = {
  round: { strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 2 },
  sharp: { strokeLinecap: "butt" as const, strokeLinejoin: "miter" as const, strokeWidth: 2 },
  square: { strokeLinecap: "square" as const, strokeLinejoin: "miter" as const, strokeWidth: 2 },
  soft: { strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.5 },
  medium: { strokeLinecap: "round" as const, strokeLinejoin: "bevel" as const, strokeWidth: 2 },
  heavy: { strokeLinecap: "square" as const, strokeLinejoin: "bevel" as const, strokeWidth: 2.5 },
} as const;
