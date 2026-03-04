"use client";
import React from "react";
import { motion } from "framer-motion";

const BentoSvg = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="60 60 480 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Grid - Made subtle and using currentColor */}
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4"/>
        </pattern>
      </defs>
      <rect x="60" y="60" width="480" height="280" fill="url(#grid)" />

      {/* Main Container Outline */}
      <motion.rect 
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        x="160" y="100" width="160" height="160" rx="40" 
        stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5"
      />

      {/* The Rune Logo - Scaled Up */}
      <g transform="translate(240, 180)">
        <motion.g
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 2.8, opacity: 1, rotate: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2
          }}
        >
          {/* Centering the 42x43 logo */}
          <g transform="translate(-21, -21.5)">
            <motion.path
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              d="M7.17789 0.685059C5.9209 0.685059 4.3933 2.16131 4.00049 2.68506L31.5321 32.1099C31.9249 31.9789 32.632 32.974 37.0315 30.1458C42.5308 26.6105 42.138 15.6118 40.1739 11.2909C38.8646 8.14845 33.8104 1.6278 27.2112 0.685059H7.17789Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.2"
            />
            <motion.path
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: 1 }}
              transition={{ duration: 1.5, delay: 0.7 }}
              d="M0.892578 38.0023V25.8252L16.605 42.3232H5.99911C2.46382 42.3232 0.892578 40.752 0.892578 38.0023Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.2"
              strokeLinejoin="round"
            />
            <motion.path
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: 1 }}
              transition={{ duration: 1.5, delay: 0.9 }}
              d="M0.5 15.219V3.82754C0.5 2.4174 1.54749 1.14499 2.07124 0.685059C14.6412 13.255 36.6385 37.6092 38.6026 39.9661C39.6859 41.2661 36.6385 42.3229 35.8529 42.3229H25.6398L0.5 15.219Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.2"
            />
          </g>
        </motion.g>
      </g>

      {/* Measurements - Horizontal (120px) */}
      <motion.g 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        transform="translate(160, 290)"
      >
        <line x1="5" y1="0" x2="155" y2="0" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
        <path d="M 0 0 L 8 -3 L 8 3 Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M 160 0 L 152 -3 L 152 3 Z" fill="currentColor" fillOpacity="0.4" />
        <text x="80" y="20" fill="currentColor" fillOpacity="0.4" fontSize="12" textAnchor="middle" fontFamily="monospace">120px</text>
      </motion.g>

      {/* Measurements - Vertical (90px) */}
      <motion.g 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        transform="translate(340, 100)"
      >
        <line x1="0" y1="5" x2="0" y2="155" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
        <path d="M 0 0 L -3 8 L 3 8 Z" fill="currentColor" fillOpacity="0.4" />
        <path d="M 0 160 L -3 152 L 3 152 Z" fill="currentColor" fillOpacity="0.4" />
        <text x="15" y="80" fill="currentColor" fillOpacity="0.4" fontSize="12" alignmentBaseline="middle" fontFamily="monospace">90px</text>
      </motion.g>

      {/* Rotation Annotation (45°) */}
      <motion.g 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        transform="translate(100, 190)"
      >
        <rect x="0" y="0" width="18" height="18" rx="4" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="4" y1="14" x2="14" y2="4" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
        <text x="25" y="14" fill="currentColor" fillOpacity="0.4" fontSize="12" fontFamily="monospace">45°</text>
        <line x1="-20" y1="9" x2="0" y2="9" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 2" />
        <line x1="50" y1="9" x2="60" y2="9" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 2" />
      </motion.g>

      {/* Percentage Annotation (23.33%) */}
      <motion.g 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        transform="translate(80, 105)"
      >
        <text x="0" y="0" fill="currentColor" fillOpacity="0.4" fontSize="12" textAnchor="end" fontFamily="monospace">23.33%</text>
        <path d="M 5 0 L 50 0 L 65 15" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" fill="none" />
        <rect x="66" y="16" width="10" height="10" rx="2" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
      </motion.g>

      {/* Scale and RGB Labels */}
      <motion.g 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        transform="translate(450, 115)"
      >
        <text x="50" y="-8" fill="currentColor" fillOpacity="0.4" fontSize="10" textAnchor="end" fontFamily="monospace">SCALE 1:1</text>
        <text x="50" y="10" fill="currentColor" fillOpacity="0.4" fontSize="10" textAnchor="end" fontFamily="monospace">RGB 255, 255, 255</text>
      </motion.g>

      {/* Decorative extension lines */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        <line x1="160" y1="60" x2="160" y2="340" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
        <line x1="320" y1="60" x2="320" y2="340" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
        <line x1="60" y1="100" x2="540" y2="100" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
        <line x1="60" y1="260" x2="540" y2="260" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
      </motion.g>

    </svg>
  );
};

export default BentoSvg;
