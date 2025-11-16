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

  const handleStart = () => setIsDragging(true);
  const handleEnd = () => setIsDragging(false);

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newPosition = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent scrolling while dragging
      updateSliderPosition(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-gray-200 rounded-xl overflow-hidden cursor-col-resize select-none group touch-manipulation"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onMouseLeave={handleEnd}
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
        {/* Handle button - larger touch target for mobile */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 md:w-12 md:h-12 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform touch-manipulation">
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
