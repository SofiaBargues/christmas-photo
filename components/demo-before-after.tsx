"use client";

import BeforeAfterSlider from "./ui/before-after-slider";

export default function DemoBeforeAfter() {
  const beforeImage = "/demo-before.png";
  const afterImage = "/demo-after.png";

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

      <div className="relative w-full aspect-4/3 shadow-2xl">
        <BeforeAfterSlider
          beforeImage={beforeImage}
          afterImage={afterImage}
          beforeAlt="Before - Normal Version"
          afterAlt="After - Christmas Version"
          showLabels={false}
          containerClassName="rounded-2xl"
          handleSize="lg"
        />
      </div>

      <p className="text-white text-center text-lg font-semibold drop-shadow-md">
        Transform your photos with festive Christmas magic
      </p>
    </div>
  );
}
