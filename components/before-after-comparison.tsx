"use client";

import { useState, useRef, useEffect } from "react";

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, newPosition)));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-200 rounded-xl overflow-hidden cursor-col-resize select-none group"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 w-full h-full">
        <img
          src={afterImage || "/placeholder.svg"}
          alt="After"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          width: `${sliderPosition}%`,
        }}
      >
        <img
          src={beforeImage || "/placeholder.svg"}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            width: containerRef.current
              ? `${containerRef.current.offsetWidth}px`
              : "100%",
          }}
        />
      </div>

      {/* Slider divider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
        }}
      >
        {/* Handle button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-[#E63946]"></div>
            <div className="w-0.5 h-4 bg-[#E63946]"></div>
            <div className="w-0.5 h-4 bg-[#E63946]"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-[#E63946] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
        BEFORE
      </div>
      <div className="absolute top-4 right-4 bg-[#10B981] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
        AFTER
      </div>
    </div>
  );
}
