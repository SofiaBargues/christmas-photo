"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { SnowEffect } from "@/components/snow-effect";
import { Volume2, VolumeX, Github, Snowflake, PenLine } from "lucide-react";
import { generateImage } from "@/server/image";
import { getRateLimitStatus, RateLimitInfo } from "@/server/ratelimit";
import { resizeImage } from "@/lib/utils";
import { LandingView } from "@/components/landing-view";
import { ProcessingView } from "@/components/processing-view";
import { ResultView } from "@/components/result-view";

export default function Page() {
  const [isMuted, setIsMuted] = useState(true);
  const [isSnowEnabled, setIsSnowEnabled] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [view, setView] = useState<"landing" | "processing" | "result">(
    "landing"
  );
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

          if (result.imageData) {
            setUploadedImage(result.imageData);
            setView("result");
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
    <main className="relative min-h-screen pb-40 sm:pb-0  w-full overflow-x-hidden bg-[#1a0505] text-[#F5E6D3] selection:bg-[#D4AF37] selection:text-[#1a0505]">
      <SnowEffect isEnabled={isSnowEnabled} />

      <div className="absolute top-0 left-0 w-full p-6 md:p-12 z-20 flex justify-between items-start  ">
        <div className="flex flex-col">
          <h1 className="text-xs md:text-sm font-bold tracking-widest uppercase text-[#F5E6D3]/60">
            {/* Riven */}
          </h1>
          <p className="text-[10px] md:text-xs tracking-wider uppercase text-[#F5E6D3]/40 mt-1">
            {/* Presents */}
          </p>
        </div>
        <a
          href="https://github.com/SofiaBargues/christmas-photo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#F5E6D3]/10 hover:bg-[#F5E6D3]/20 px-3 py-1.5 rounded-full transition-colors text-xs md:text-sm font-medium"
        >
          <Github className="w-4 h-4" />
          <span>Star on GitHub</span>
        </a>
      </div>

      <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-20 flex gap-3">
        <button
          onClick={toggleSound}
          className="p-3 rounded-full bg-[#F5E6D3]/5 hover:bg-[#F5E6D3]/10 transition-colors backdrop-blur-sm"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={toggleSnow}
          className={`p-3 rounded-full transition-colors backdrop-blur-sm ${
            isSnowEnabled
              ? "bg-[#F5E6D3]/10 hover:bg-[#F5E6D3]/20"
              : "bg-[#F5E6D3]/5 hover:bg-[#F5E6D3]/10 opacity-50"
          }`}
          aria-label={isSnowEnabled ? "Disable Snow" : "Enable Snow"}
        >
          <Snowflake className="w-5 h-5" />
        </button>

        {!uploadedImage && (
          <button
            onClick={togglePrompt}
            className={`p-3 rounded-full transition-colors backdrop-blur-sm ${
              showPrompt
                ? "bg-[#F5E6D3]/10 hover:bg-[#F5E6D3]/20"
                : "bg-[#F5E6D3]/5 hover:bg-[#F5E6D3]/10 opacity-50"
            }`}
            aria-label={
              showPrompt ? "Hide Prompt Writer" : "Show Prompt Writer"
            }
          >
            <PenLine className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <div className="p-6 pt-24 pb-24 md:p-12 w-full flex items-center justify-center">
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
          {view === "result" && (
            <ResultView
              key="result"
              image={uploadedImage}
              originalImage={previewImage}
              onReset={() => {
                setUploadedImage(null);
                setPreviewImage(null);
                setRateLimitError(null);
                setView("landing");
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
