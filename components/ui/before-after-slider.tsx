"use client";

import { useState, useRef, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  showLabels?: boolean;
  containerClassName?: string;
  handleSize?: "sm" | "md" | "lg";
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Before",
  afterAlt = "After",
  showLabels = true,
  containerClassName = "",
  handleSize = "md",
}: BeforeAfterSliderProps) {
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
      className={`relative w-full h-full bg-gray-200 rounded-xl overflow-hidden cursor-col-resize select-none group touch-manipulation ${containerClassName}`}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onMouseLeave={handleEnd}
    >
      {/* After image (background) */}
      <img
        src={afterImage || "/placeholder.svg"}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before image (clipped overlay) */}
      <img
        src={beforeImage || "/placeholder.svg"}
        alt={beforeAlt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />

      {/* Slider divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
        }}
      >
        {/* Handle button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] rounded-full w-8 h-16 flex items-center justify-center shadow-2xl border-2 border-white touch-manipulation">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <>
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-md font-bold text-xs tracking-wider shadow-lg">
            BEFORE
          </div>
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-md font-bold text-xs tracking-wider shadow-lg">
            AFTER
          </div>
        </>
      )}
    </div>
  );
}
