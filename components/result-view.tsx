"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Share2, RotateCcw } from "lucide-react";
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

  const handleShare = async () => {
    if (!image) return;

    try {
      // Convert base64/URL to blob for sharing
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "christmas-card.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My Christmas Card",
          text: "Check out my Christmas card! 🎄✨",
          files: [file],
        });
      } else if (navigator.share) {
        // Fallback: share without file if file sharing is not supported
        await navigator.share({
          title: "My Christmas Card",
          text: "Check out my Christmas card! 🎄✨",
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      // User cancelled or share failed
      if ((error as Error).name !== "AbortError") {
        console.error("Error sharing:", error);
      }
    }
  };

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
      className="w-full flex flex-col items-center justify-center gap-2 md:gap-4 px-4 py-4 box-border"
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

      <div className="shrink-0 text-center px-4 flex flex-col items-center">
        <h2 className="font-serif text-2xl md:text-3xl mb-2 text-[#F5E6D3] drop-shadow-lg">
          Here is your card!
        </h2>
        <p className="text-[#F5E6D3]/80 mb-4 max-w-md text-sm font-light tracking-wide">
          Share the magic of Christmas with your loved ones.
        </p>
        <div className="flex flex-wrap gap-3 justify-center items-center">
          <button className="bg-[#F5E6D3] text-[#2C0A0A] px-6 py-2 rounded-full font-serif text-base hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,230,211,0.3)] flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="bg-[#3C1A1A] text-[#F5E6D3] border border-[#F5E6D3]/30 px-6 py-2 rounded-full font-serif text-base hover:bg-[#4C2A2A] hover:border-[#F5E6D3]/60 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={onReset}
            className="text-[#F5E6D3]/60 px-4 py-2 rounded-full font-serif text-base hover:text-[#F5E6D3] hover:bg-[#F5E6D3]/5 transition-all duration-300 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Start over
          </button>
        </div>
      </div>
    </motion.div>
  );
}
