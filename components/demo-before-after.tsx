"use client";

import { useState, useRef, useEffect } from "react";

export default function DemoBeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const beforeImage =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dia-de-la-familia-1-EnYlG0bGb1aaRHCXme4PQ8Ksqj3bGG.jpg";
  const afterImage =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/generated-1763216268115-59A1QHi04SpMDLwPiAwaajeFG6ncjU.webp";

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
          Slide to see the magic
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
        className="relative w-full aspect-4/3 bg-gray-200 rounded-2xl overflow-hidden cursor-col-resize select-none group shadow-2xl"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
      >
        {/* After image (background) */}
        <img
          src={afterImage || "/placeholder.svg"}
          alt="After - Christmas Version"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Before image (clipped overlay) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage || "/placeholder.svg"}
            alt="Before - Normal Version"
            className="w-full h-full object-cover object-left"
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
        Transform your photos with festive Christmas magic
      </p>
    </div>
  );
}
