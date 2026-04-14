import { CustomizationState } from "@/lib/types";

interface SvgDefinitionsProps {
  state: CustomizationState;
}

export function SvgDefinitions({ state }: SvgDefinitionsProps) {
  return (
    <svg
      width="0"
      height="0"
      className="absolute invisible pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        {state.gradient.type === "linear" && (
          <linearGradient
            id="icon-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientTransform={`rotate(${state.gradient.angle})`}
          >
            {state.gradient.stops.map((stop, i) => (
              <stop
                key={`stop-${i}-${stop.position}`}
                offset={`${Math.max(0, Math.min(100, stop.position))}%`}
                style={{
                  stopColor: stop.color || "#000000",
                  stopOpacity: 1,
                }}
              />
            ))}
          </linearGradient>
        )}
        {state.gradient.type === "radial" && (
          <radialGradient id="icon-gradient" cx="50%" cy="50%" r="50%">
            {state.gradient.stops.map((stop, i) => (
              <stop
                key={`stop-${i}-${stop.position}`}
                offset={`${Math.max(0, Math.min(100, stop.position))}%`}
                style={{
                  stopColor: stop.color || "#000000",
                  stopOpacity: 1,
                }}
              />
            ))}
          </radialGradient>
        )}
        <filter id="inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
          {/* 1. Blur the source alpha */}
          <feGaussianBlur
            in="SourceAlpha"
            stdDeviation={state.shadow.blur}
            result="blur"
          />
          {/* 2. Composite out: keep area inside shape but outside blur */}
          <feComposite
            operator="out"
            in="SourceAlpha"
            in2="blur"
            result="inverse"
          />
          {/* 3. Flood with shadow color */}
          <feFlood
            floodColor="black"
            floodOpacity={state.shadow.opacity / 100}
            result="color"
          />
          {/* 4. Composite in: clip color to the inverse shape */}
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          {/* 5. Composite over: put shadow ON TOP of the original graphic */}
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>

        {/* Pixelate Filter */}
        <filter id="pixelate" x="0%" y="0%" width="100%" height="100%">
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1" />
            <feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1" />
            <feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1" />
          </feComponentTransfer>
        </filter>

        {/* Dither Filter (Ordered Dithering pattern) */}
        <filter id="dither-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="1"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="alpha"
          />
          <feComposite operator="in" in="SourceGraphic" in2="alpha" />
        </filter>
      </defs>
    </svg>
  );
}
