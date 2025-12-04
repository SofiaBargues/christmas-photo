"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BeforeAfterSlider from "@/components/ui/before-after-slider";

export function ResultView({
  image,
  originalImage,
  onReset,
}: {
  image: string | null;
  originalImage: string | null;
  onReset: () => void;
}) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
      img.src = originalImage;
    }
  }, [originalImage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col items-center justify-center gap-4 md:gap-6 px-4 py-6 box-border"
    >
      {/* Container 1: fixed viewport box */}
      <div className="w-[80vw] h-[60vh] max-w-5xl max-h-[60vh] flex items-center justify-center perspective-1000">
        {/* Container 2: aspect-ratio-aware box that fits inside container 1 */}
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative max-w-full max-h-full rounded-3xl overflow-hidden border-8 border-[#F5E6D3] shadow-2xl "
          style={{
            aspectRatio: aspectRatio ?? 4 / 5,
            width: aspectRatio && aspectRatio >= 1 ? "100%" : "auto",
            height: aspectRatio && aspectRatio < 1 ? "100%" : "auto",
          }}
        >
          {image && originalImage && (
            <BeforeAfterSlider
              beforeImage={originalImage}
              afterImage={image}
              beforeAlt="Original Photo"
              afterAlt="Christmas Result"
            />
          )}
        </motion.div>
      </div>

      <div className="shrink-0 text-center md:text-left px-4 pb-2">
        <h2 className="font-serif text-2xl md:text-4xl mb-4">
          Here is your card!
        </h2>
        <p className="text-[#F5E6D3]/70 mb-6 max-w-md mx-auto md:mx-0">
          Share the magic of Christmas with your loved ones.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
          <button className="bg-[#F5E6D3] text-[#1a0505] px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform">
            Download
          </button>
          <button className="bg-[#F5E6D3] text-[#1a0505] px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform">
            Share
          </button>
          <button
            onClick={onReset}
            className="border border-[#F5E6D3]/30 px-8 py-3 rounded-full font-medium hover:bg-[#F5E6D3]/10 transition-colors"
          >
            Start over
          </button>
        </div>
      </div>
    </motion.div>
  );
}
