"use client";

import { useState } from "react";

interface Snowflake {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

interface SnowEffectProps {
  isEnabled?: boolean;
}

function generateSnowflakes(): Snowflake[] {
  // Reduce count on mobile for better performance
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 50 : 80;

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 8, // 8-18 seconds to fall
    delay: Math.random() * -15, // Stagger start times
    opacity: Math.random() * 0.6 + 0.2,
    drift: Math.random() * 30 - 15, // Horizontal drift in px
  }));
}

export function SnowEffect({ isEnabled = true }: SnowEffectProps) {
  // Generate snowflakes only once using lazy initialization
  const [snowflakes] = useState<Snowflake[]>(generateSnowflakes);

  if (!isEnabled) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          100% {
            transform: translateY(110vh) translateX(var(--drift));
          }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute rounded-full bg-white will-change-transform"
            style={{
              top: "-5px",
              left: `${flake.x}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              ["--drift" as string]: `${flake.drift}px`,
              animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}
