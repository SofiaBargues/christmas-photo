"use client";

import { useState, useRef, useEffect } from "react";

interface UserResultComparisonProps {
  beforeImage: string;
  afterImage: string;
}

export default function UserResultComparison({
  beforeImage,
  afterImage,
}: UserResultComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(4 / 3);

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
    <div className="w-full h-full flex flex-col gap-6">
      <div className="text-center space-y-3">
        <p className="text-white text-2xl font-bold drop-shadow-lg">
          Your Christmas Magic is Ready! ✨
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-white font-bold text-sm bg-[#E63946] px-4 py-2 rounded-full shadow-lg">
            BEFORE
          </span>
          <svg
            className="w-8 h-8 text-white drop-shadow-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M13 5l7 7m0 0l-7 7m7-7H6"
            />
          </svg>
          <span className="text-white font-bold text-sm bg-[#10B981] px-4 py-2 rounded-full shadow-lg">
            AFTER
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full bg-gray-200 rounded-2xl overflow-hidden cursor-col-resize select-none group shadow-2xl"
        style={{ aspectRatio: imageAspectRatio }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
      >
        {/* After image (background) */}
        <img
          src={afterImage}
          alt="After - Your Christmas Transformation"
          className="w-full h-full object-cover"
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            const ratio = img.naturalWidth / img.naturalHeight;
            setImageAspectRatio(ratio);
            console.log(
              "After image loaded:",
              afterImage,
              "Aspect ratio:",
              ratio
            );
          }}
          onError={() =>
            console.error("Error loading after image:", afterImage)
          }
        />

        {/* Before image (clipped overlay) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before - Your Original Photo"
            className="h-full w-full object-cover"
            style={{ width: "200%" }}
          />
        </div>

        {/* Slider divider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
          style={{
            left: `${sliderPosition}%`,
            transform: "translateX(-50%)",
          }}
        >
          {/* Handle button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform border-4 border-white/50">
            <div className="flex gap-1">
              <div className="w-1 h-6 bg-[#E63946] rounded-full"></div>
              <div className="w-1 h-6 bg-[#E63946] rounded-full"></div>
              <div className="w-1 h-6 bg-[#E63946] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Labels */}
        {/* <div className="absolute top-6 left-6 bg-[#E63946] text-white px-5 py-2 rounded-full font-bold text-sm shadow-xl backdrop-blur-sm">
          BEFORE
        </div>
        <div className="absolute top-6 right-6 bg-[#10B981] text-white px-5 py-2 rounded-full font-bold text-sm shadow-xl backdrop-blur-sm">
          AFTER
        </div> */}
      </div>

      <p className="text-white text-center text-lg font-semibold drop-shadow-md">
        🎄 Your photo has been transformed with festive Christmas magic! 🎄
      </p>
    </div>
  );
}
