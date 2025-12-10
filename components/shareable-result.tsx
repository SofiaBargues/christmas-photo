"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Share2, RotateCcw, Check } from "lucide-react";
import { SnowEffect } from "@/components/snow-effect";
import { Header } from "@/components/header";
import BeforeAfterSlider from "@/components/ui/before-after-slider";
import { PhotoResult } from "@/server/storage";
import { useBackgroundMusic } from "@/hooks/use-background-music";

interface ShareableResultProps {
  result: PhotoResult;
}

export function ShareableResult({ result }: ShareableResultProps) {
  const { isMuted, toggleSound } = useBackgroundMusic();
  const [isSnowEnabled, setIsSnowEnabled] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result.originalUrl) {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
      };
      img.src = result.originalUrl;
    }
  }, [result.originalUrl]);

  const handleDownload = async () => {
    try {
      const response = await fetch(result.generatedUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `christmas-photo-${result.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Our Christmas Photo",
          text: "Check out our Christmas photo transformation!",
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed, fall back to copy
        await copyToClipboard(shareUrl);
      }
    } else {
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleCreateOwn = () => {
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen w-full flex flex-col overflow-x-hidden bg-[#1a0505] text-[#F5E6D3] selection:bg-[#D4AF37] selection:text-[#1a0505]">
      <SnowEffect isEnabled={isSnowEnabled} />

      <Header
        isMuted={isMuted}
        isSnowEnabled={isSnowEnabled}
        showPrompt={false}
        showPromptButton={false}
        onToggleSound={toggleSound}
        onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)}
        onTogglePrompt={() => {}}
      />

      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex flex-col items-center justify-center gap-2 md:gap-4 px-4 py-4 box-border"
        >
          {/* Container 1: fixed viewport box */}
          <div className="w-[80vw] sm:h-[60vh] h-[50vh] max-w-5xl max-h-[60vh] flex items-center justify-center perspective-1000">
            {/* Container 2: aspect-ratio-aware box that fits inside container 1 */}
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-full max-h-full rounded-3xl overflow-hidden border-8 border-[#F5E6D3] shadow-2xl"
              style={{
                aspectRatio: aspectRatio ?? 4 / 5,
                width: aspectRatio && aspectRatio >= 1 ? "100%" : "auto",
                height: aspectRatio && aspectRatio < 1 ? "100%" : "auto",
              }}
            >
              <BeforeAfterSlider
                beforeImage={result.originalUrl}
                afterImage={result.generatedUrl}
                beforeAlt="Original Photo"
                afterAlt="Christmas Result"
              />
            </motion.div>
          </div>

          <div className="shrink-0 text-center px-4 flex flex-col items-center">
            <h2 className="font-serif text-2xl md:text-3xl mb-2 text-[#F5E6D3] drop-shadow-lg">
              A Christmas Photo!
            </h2>
            <p className="text-[#F5E6D3]/80 mb-4 max-w-md text-sm font-light tracking-wide">
              Share the magic of Christmas with your loved ones.
            </p>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <button
                onClick={handleCreateOwn}
                className="text-[#F5E6D3]/60 px-2 py-2 rounded-full font-serif text-base hover:text-[#F5E6D3] hover:bg-[#F5E6D3]/5 transition-all duration-300 flex items-center gap-2 sm:px-6 sm:text-base  text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Start Over</span>
              </button>
              <button
                onClick={handleDownload}
                className="bg-[#F5E6D3]   text-[#2C0A0A] px-2 py-2 rounded-full font-serif text-base hover:bg white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(245,230,211,0.3)] flex items-center gap-2 sm:px-6 sm:text-base  text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={handleShare}
                className="bg-[#3C1A1A] text-[#F5E6D3] border border-[#F5E6D3]/30 px-2 py-2 rounded-full font-serif text-base hover:bg-[#4C2A2A] hover:border-[#F5E6D3]/60 hover:scale-105 transition-all duration-300 flex items-center gap-2 sm:px-6 sm:text-base text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
