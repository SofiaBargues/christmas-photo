"use client";

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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl h-full flex flex-col items-center justify-center gap-8 md:gap-16 pt-20 md:pt-0"
    >
      <div className="flex-1 w-full max-w-md perspective-1000">
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden border-8 border-[#F5E6D3] shadow-2xl bg-[#1a4d40]"
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

      <div className="flex-1 text-center md:text-left">
        <h2 className="font-serif text-3xl md:text-5xl mb-6">
          Here is your card!
        </h2>
        <p className="text-[#F5E6D3]/70 mb-8 max-w-md">
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
