"use client";

import React, { useState } from "react";

const images = [
  "https://i.pinimg.com/474x/4b/a6/38/4ba638209ce7f96151d138879dbf03f6.jpg",
  "https://i.pinimg.com/474x/4b/a6/38/4ba638209ce7f96151d138879dbf03f6.jpg",
  "https://i.pinimg.com/474x/4b/a6/38/4ba638209ce7f96151d138879dbf03f6.jpg",
  "https://i.pinimg.com/474x/4b/a6/38/4ba638209ce7f96151d138879dbf03f6.jpg",
  "https://i.pinimg.com/474x/4b/a6/38/4ba638209ce7f96151d138879dbf03f6.jpg",
];
const BnDevCarousal = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const next = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative flex h-48 w-full items-center justify-center overflow-visible">
      <button
        onClick={prev}
        className="absolute -left-10 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-md transition-transform active:scale-95"
        aria-label="Previous image"
      >
        &#8592;
      </button>
      <div className="relative flex h-48 w-32 items-center justify-center">
        <img
          src={images[current]}
          alt="carousel"
          className="h-48 w-32 scale-110 rounded-lg object-cover shadow-lg"
          style={{
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        />
        {/* Overflow effect: show next/prev images slightly */}
        <img
          src={images[(current + 1) % images.length]}
          alt="next"
          className="pointer-events-none absolute top-1/2 left-[70%] h-40 w-24 -translate-y-1/2 scale-90 rounded-lg object-cover opacity-60 blur-sm"
          style={{ zIndex: 1 }}
        />
        <img
          src={images[(current - 1 + images.length) % images.length]}
          alt="prev"
          className="pointer-events-none absolute top-1/2 left-[-20%] h-40 w-24 -translate-y-1/2 scale-90 rounded-lg object-cover opacity-60 blur-sm"
          style={{ zIndex: 1 }}
        />
      </div>
      <button
        onClick={next}
        className="absolute -right-10 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-md transition-transform active:scale-95"
        aria-label="Next image"
      >
        &#8594;
      </button>
    </div>
  );
};

export default BnDevCarousal;
