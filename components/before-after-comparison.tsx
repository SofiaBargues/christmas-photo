"use client";

import BeforeAfterSlider from "./ui/before-after-slider";

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
}

// DELETE, unused component
export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
}: BeforeAfterComparisonProps) {
  return (
    <BeforeAfterSlider
      beforeImage={beforeImage}
      afterImage={afterImage}
      beforeAlt="Before"
      afterAlt="After"
      showLabels={true}
      handleSize="md"
    />
  );
}
