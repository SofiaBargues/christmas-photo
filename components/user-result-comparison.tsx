"use client";

import { useState } from "react";
import BeforeAfterSlider from "./ui/before-after-slider";

interface UserResultComparisonProps {
  beforeImage: string;
  afterImage: string;
}

export default function UserResultComparison({
  beforeImage,
  afterImage,
}: UserResultComparisonProps) {
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(4 / 3);

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
        className="relative w-full shadow-2xl"
        style={{ aspectRatio: imageAspectRatio }}
      >
        <BeforeAfterSlider
          beforeImage={beforeImage}
          afterImage={afterImage}
          beforeAlt="Before - Your Original Photo"
          afterAlt="After - Your Christmas Transformation"
          showLabels={false}
          containerClassName="rounded-2xl"
          handleSize="lg"
        />
        
        {/* Hidden image to detect aspect ratio */}
        <img
          src={afterImage}
          alt=""
          className="invisible absolute"
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
      </div>

      <p className="text-white text-center text-lg font-semibold drop-shadow-md">
        🎄 Your photo has been transformed with festive Christmas magic! 🎄
      </p>
    </div>
  );
}
