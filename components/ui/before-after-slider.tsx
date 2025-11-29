"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden select-none group ${containerClassName}`}
    >
      {/* Images Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
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
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-md font-bold text-xs tracking-wider shadow-lg">
            BEFORE
          </div>
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-md font-bold text-xs tracking-wider shadow-lg">
            AFTER
          </div>
        </div>
      )}

      {/* Resizable Control Layer */}
      <ResizablePanelGroup
        direction="horizontal"
        className="absolute inset-0 z-10 h-full w-full"
        onLayout={(sizes) => setSliderPosition(sizes[0])}
      >
        <ResizablePanel defaultSize={50} minSize={5} maxSize={100} />
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={5} />
      </ResizablePanelGroup>
    </div>
  );
}
