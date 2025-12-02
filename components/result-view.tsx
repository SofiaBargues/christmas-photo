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
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 5);

  useEffect(() => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
      img.src = originalImage;
    }
  }, [originalImage]);
  const isPortrait = aspectRatio < 1;
  const maxWidth = isPortrait ? "max-w-md" : "max-w-3xl";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-7xl h-full flex flex-col items-center justify-center gap-6 md:gap-8 py-8 md:py-12"
    >
      <div className={`w-full ${maxWidth} min-w-[300px] perspective-1000`}>
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative rounded-2xl overflow-hidden border-8 border-[#F5E6D3] shadow-2xl bg-[#1a4d40] w-full max-h-[75vh] mx-auto"
          style={{ aspectRatio: aspectRatio }}
        >
          {image && originalImage && (
            <>
              <div className="absolute inset-0 bg-[url('/winter-snowfall.png')] opacity-20 mix-blend-overlay z-10 pointer-events-none" />

              <BeforeAfterSlider
                beforeImage={originalImage}
                afterImage={image}
                beforeAlt="Original Photo"
                afterAlt="Christmas Result"
              />

              <div className="absolute inset-0 border-[20px] border-[#D4AF37]/20 z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#1a0505] to-transparent z-20 pointer-events-none" />

              <div className="absolute bottom-8 left-0 w-full text-center z-30 pointer-events-none">
                <div className="font-serif text-3xl text-[#F5E6D3] drop-shadow-md">
                  Merry Christmas
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      <div className="shrink-0 text-center md:text-left px-4">
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
