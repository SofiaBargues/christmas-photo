"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { SnowEffect } from "@/components/snow-effect";
import { Header } from "@/components/header";
import { generateImage } from "@/server/image";
import { getRateLimitStatus, RateLimitInfo } from "@/server/ratelimit";
import { resizeImage } from "@/lib/utils";
import { LandingView } from "@/components/landing-view";
import { ProcessingView } from "@/components/processing-view";
import { ResultView } from "@/components/result-view";

export default function Page() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const [isSnowEnabled, setIsSnowEnabled] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [view, setView] = useState<"landing" | "processing">("landing");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo | null>(
    null
  );
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch rate limit status on mount
  useEffect(() => {
    getRateLimitStatus().then(setRateLimitInfo).catch(console.error);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(
      "https://upload.wikimedia.org/wikipedia/commons/4/4d/Jingle_Bells_%28ISRC_USUAN1100187%29.mp3"
    );
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.log("Audio playback failed:", error);
        });
      }
    }
  }, [isMuted]);

  const toggleSound = () => setIsMuted(!isMuted);
  const toggleSnow = () => setIsSnowEnabled(!isSnowEnabled);
  const togglePrompt = () => setShowPrompt(!showPrompt);

  const handleUpload = async (file: File) => {
    // Check rate limit before starting
    if (rateLimitInfo && rateLimitInfo.remaining <= 0) {
      setRateLimitError(
        "You've reached your daily limit. Come back tomorrow to generate more images."
      );
      return;
    }

    setRateLimitError(null);
    setIsGenerating(true);
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setView("processing");

    try {
      const resizedFile = await resizeImage(file, 1024, 1024, 0.85);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const originalImage = e.target?.result as string;
        const base64Data = originalImage.split(",")[1];
        const mimeType = resizedFile.type;

        try {
          const result = await generateImage(prompt, {
            data: base64Data,
            mimeType: mimeType,
          });

          // Update rate limit info from response
          setRateLimitInfo(result.rateLimitInfo);

          if (result.photoResult) {
            // Navigate to shareable result page
            router.push(`/result/${result.photoResult.id}`);
          } else if (result.error) {
            console.error("Error:", result.error);
            setRateLimitError(result.error);
            setView("landing");
          } else {
            console.error("No result returned");
            setView("landing");
          }
        } catch (error) {
          console.error("Error generating image:", error);
          setView("landing");
        } finally {
          setIsGenerating(false);
        }
      };
      reader.readAsDataURL(resizedFile);
    } catch (error) {
      console.error("Error processing file:", error);
      setView("landing");
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col overflow-x-hidden bg-[#1a0505] text-[#F5E6D3] selection:bg-[#D4AF37] selection:text-[#1a0505]">
      <SnowEffect isEnabled={isSnowEnabled} />

      <Header
        isMuted={isMuted}
        isSnowEnabled={isSnowEnabled}
        showPrompt={showPrompt}
        showPromptButton={!uploadedImage}
        onToggleSound={toggleSound}
        onToggleSnow={toggleSnow}
        onTogglePrompt={togglePrompt}
      />

      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <div className="p-6 w-full flex items-center justify-center">
              <LandingView
                key="landing"
                onUpload={handleUpload}
                showPrompt={showPrompt}
                prompt={prompt}
                setPrompt={setPrompt}
                isGenerating={isGenerating}
                previewImage={previewImage}
                resultImage={uploadedImage}
                rateLimitInfo={rateLimitInfo}
                rateLimitError={rateLimitError}
                onReset={() => {
                  setUploadedImage(null);
                  setPreviewImage(null);
                  setRateLimitError(null);
                  setView("landing");
                }}
              />
            </div>
          )}
          {view === "processing" && <ProcessingView key="processing" />}
        </AnimatePresence>
      </div>
    </main>
  );
}
