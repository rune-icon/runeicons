export function Stamp() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer distressed rings */}
      <circle
        cx="100"
        cy="100"
        r="90"
        stroke="#52525b"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 3"
        opacity="0.8"
      />
      <circle
        cx="100"
        cy="100"
        r="85"
        stroke="#52525b"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke="#52525b"
        strokeWidth="3"
        fill="none"
        strokeDasharray="15 8 4 4"
        opacity="0.7"
      />

      {/* Text Paths */}
      <path
        id="stampTextPathTop"
        d="M 25, 100 A 75,75 0 0,1 175,100"
        fill="none"
      />
      <path
        id="stampTextPathBottom"
        d="M 175, 100 A 75,75 0 0,1 25,100"
        fill="none"
      />

      <text
        fill="#FFD700"
        fontFamily="monospace"
        fontSize="13"
        fontWeight="bold"
        letterSpacing="3"
      >
        <textPath
          href="#stampTextPathTop"
          startOffset="50%"
          textAnchor="middle"
        >
          February 2026
        </textPath>
      </text>
      <text
        fill="#FFD700"
        fontFamily="monospace"
        fontSize="13"
        fontWeight="bold"
        letterSpacing="3"
      >
        <textPath
          href="#stampTextPathBottom"
          startOffset="50%"
          textAnchor="middle"
        >
          Chill Guy Supporter
        </textPath>
      </text>

      {/* Center Duck */}
      <g transform="translate(65, 65) scale(0.9)">
        <path
          d="M 30 30 C 30 10, 55 10, 55 30 C 55 45, 75 45, 75 65 C 75 85, 10 85, 10 65 C 10 45, 30 45, 30 30 Z"
          fill="#FFD700"
        />
        <circle cx="45" cy="25" r="3" fill="black" />
        <path d="M 52 25 L 65 25 L 58 32 Z" fill="#FF8C00" />
      </g>
    </svg>
  );
}
