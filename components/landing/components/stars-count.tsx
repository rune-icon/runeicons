"use client";

import { useEffect, useState } from "react";

import { Star } from "lucide-react";

export function StarsCount() {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/AitijhyaModak/rune-icons"
        );
        const data = await response.json();
        setStars(data.stargazers_count);
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStars();
  }, []);

  if (loading || stars === null) {
    return (
      <span className="flex items-center gap-1 text-sm font-medium">
        <span>—</span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-sm font-medium">
      <span>{stars}</span>
    </span>
  );
}
