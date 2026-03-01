export function HouseDuck() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Bubbles */}
      <circle cx="40" cy="150" r="30" fill="#A2D5F2" opacity="0.8" />
      <circle cx="160" cy="140" r="35" fill="#A2D5F2" opacity="0.8" />
      <circle cx="180" cy="180" r="25" fill="#A2D5F2" opacity="0.8" />
      <circle cx="20" cy="180" r="20" fill="#A2D5F2" opacity="0.8" />

      {/* House Base */}
      <path
        d="M 20 120 L 100 40 L 180 120 L 180 190 L 20 190 Z"
        fill="#FF4500"
      />

      {/* Chimney */}
      <rect x="35" y="60" width="25" height="50" fill="#FF4500" />

      {/* Chimney Smoke/Bubbles */}
      <circle cx="45" cy="45" r="18" fill="#A2D5F2" opacity="0.9" />
      <circle cx="65" cy="30" r="14" fill="#A2D5F2" opacity="0.9" />
      <circle cx="35" cy="20" r="12" fill="#A2D5F2" opacity="0.9" />

      {/* Eyes */}
      <circle cx="75" cy="135" r="14" fill="white" />
      <circle cx="75" cy="135" r="5" fill="black" />
      <circle cx="125" cy="135" r="14" fill="white" />
      <circle cx="125" cy="135" r="5" fill="black" />

      {/* Front Bubbles */}
      <circle cx="50" cy="180" r="25" fill="#A2D5F2" />
      <circle cx="150" cy="180" r="30" fill="#A2D5F2" />
      <circle cx="100" cy="195" r="20" fill="#A2D5F2" />
      <circle cx="80" cy="185" r="15" fill="#A2D5F2" />
      <circle cx="120" cy="185" r="15" fill="#A2D5F2" />

      {/* Duck on Roof */}
      <g transform="translate(65, 15) scale(0.9)">
        {/* Duck Body */}
        <path
          d="M 30 30 C 30 10, 55 10, 55 30 C 55 45, 75 45, 75 65 C 75 85, 10 85, 10 65 C 10 45, 30 45, 30 30 Z"
          fill="#FFD700"
        />
        {/* Duck Eye */}
        <circle cx="45" cy="25" r="3" fill="black" />
        {/* Duck Beak */}
        <path d="M 52 25 L 65 25 L 58 32 Z" fill="#FF8C00" />
      </g>
    </svg>
  );
}
