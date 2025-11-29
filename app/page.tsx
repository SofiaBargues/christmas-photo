"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SnowEffect } from "@/components/snow-effect";
import {
  Volume2,
  VolumeX,
  Upload,
  Sparkles,
  Github,
  Snowflake,
  PenLine,
} from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BeforeAfterSlider from "@/components/ui/before-after-slider";
import { generateImage } from "@/server/image";
import { getRateLimitStatus, RateLimitInfo } from "@/server/ratelimit";
import { resizeImage } from "@/lib/utils";

export default function Page() {
  const [isMuted, setIsMuted] = useState(true);
  const [isSnowEnabled, setIsSnowEnabled] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [view, setView] = useState<
    "landing" | "upload" | "processing" | "result"
  >("landing");
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
    setView("landing");

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
          } else if (result.error) {
            console.error("Error:", result.error);
            setRateLimitError(result.error);
            setView("upload");
          } else {
            console.error("No result returned");
            setView("upload");
          }
        } catch (error) {
          console.error("Error generating image:", error);
          setView("upload");
        } finally {
          setIsGenerating(false);
        }
      };
      reader.readAsDataURL(resizedFile);
    } catch (error) {
      console.error("Error processing file:", error);
      setView("upload");
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#1a0505] text-[#F5E6D3] selection:bg-[#D4AF37] selection:text-[#1a0505]">
      <SnowEffect isEnabled={isSnowEnabled} />

      <div className="absolute top-0 left-0 w-full p-6 md:p-12 z-20 flex justify-between items-start">
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

      <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row items-center justify-center p-6 pt-24 pb-24 md:p-12">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <LandingView
              key="landing"
              onStart={() => setView("upload")}
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
                setView("landing");
              }}
            />
          )}
          {view === "upload" && (
            <UploadView
              key="upload"
              onBack={() => setView("landing")}
              onUpload={handleUpload}
              showPrompt={showPrompt}
              prompt={prompt}
              setPrompt={setPrompt}
            />
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
                setView("upload");
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function LandingView({
  onUpload,
  showPrompt,
  prompt,
  setPrompt,
  isGenerating,
  previewImage,
  resultImage,
  rateLimitInfo,
  rateLimitError,
  onReset,
}: {
  onStart: () => void;
  onUpload: (file: File) => void;
  showPrompt: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  previewImage: string | null;
  resultImage: string | null;
  rateLimitInfo: RateLimitInfo | null;
  rateLimitError: string | null;
  onReset: () => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [mainDragActive, setMainDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = `christmas-magic-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-7xl h-auto md:h-full grid grid-cols-1 sm:grid-cols-2 items-center justify-items-center relative z-10 gap-y-16 md:gap-24 px-4 md:px-[45px] py-8 md:py-[67px]"
    >
      <div className="order-1 w-full flex flex-col items-center md:items-start text-center md:text-left mt-8 md:mt-0">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-balance max-w-lg"
        >
          CREATE YOUR CHRISTMAS PHOTO WITH AI.
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-lg text-[#F5E6D3]/80 max-w-md"
        >
          Transform any photo into a festive masterpiece. Add Christmas
          decorations and costumes instantly.
        </motion.p>
      </div>

      <div className="order-2 w-full max-w-md md:max-w-xl relative group perspective-1000">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="relative w-full aspect-[3/4] md:aspect-[4/5] z-10"
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMainDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.currentTarget.contains(e.relatedTarget as Node)) return;
            setMainDragActive(false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMainDragActive(true);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMainDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              onUpload(e.dataTransfer.files[0]);
            }
          }}
        >
          {!resultImage && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`absolute -inset-10 border-2 border-dashed rounded-[3rem] z-0 animate-pulse transition-colors cursor-pointer flex items-start justify-center pt-0 my-[-67px] ${
                mainDragActive
                  ? "border-[#F5E6D3] bg-[#F5E6D3]/10"
                  : "border-[#F5E6D3]/30 group-hover:border-[#F5E6D3]/60"
              }`}
            >
              <div className="bg-[#F5E6D3] text-[#1a0505] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg transform -translate-y-1/2">
                Drop your photo here
              </div>
            </div>
          )}

          <div className="absolute inset-0 rounded-[2rem] overflow-hidden border-8 border-[#F5E6D3] shadow-2xl shadow-black/50 bg-[#1a0505] transition-transform duration-500 group-hover:scale-[1.02] px-0 mx-[-2px] my-[-51px] py-0">
            {resultImage && previewImage ? (
              <BeforeAfterSlider
                beforeImage={previewImage}
                afterImage={resultImage}
                beforeAlt="Original Photo"
                afterAlt="Christmas Result"
              />
            ) : previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <BeforeAfterSlider
                beforeImage="/demo-before.png"
                afterImage="/demo-after.png"
                beforeAlt="Original Photo"
                afterAlt="Christmas Result"
              />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[90%] p-6 bg-[#F5E6D3] rounded-xl text-[#1a0505] text-center shadow-xl z-20 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 px-0 flex flex-col items-center my-[-97px]"
        >
          {resultImage ? (
            <div className="flex flex-col items-center gap-4 w-full px-6">
              <p className="font-serif text-xl text-[#1a0505]">
                Your Christmas Card is Ready!
              </p>
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-[#1a0505] text-[#F5E6D3] py-2 rounded-lg text-sm font-medium hover:bg-[#1a0505]/90 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={onReset}
                  className="flex-1 border border-[#1a0505]/20 text-[#1a0505] py-2 rounded-lg text-sm font-medium hover:bg-[#1a0505]/5 transition-colors"
                >
                  New Photo
                </button>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#1a0505]/20 animate-spin border-t-[#1a0505]" />
              <p className="font-serif text-xl text-[#1a0505]">
                Creating Christmas Magic...
              </p>
              <p className="text-sm text-[#1a0505]/60">
                The elves are working on your photo
              </p>
            </div>
          ) : rateLimitInfo && rateLimitInfo.remaining <= 0 ? (
            <div className="flex flex-col items-center gap-4 w-full px-6 py-4">
              <div className="w-16 h-16 rounded-full bg-[#1a0505]/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#1a0505]/60" />
              </div>
              <p className="font-serif text-xl text-[#1a0505]">
                You&apos;ve used all your images for today!
              </p>
              <p className="text-sm text-[#1a0505]/60 text-center">
                Come back tomorrow to create more Christmas magic.
              </p>
              <div className="text-xs text-[#1a0505]/40">
                0 of {rateLimitInfo.limit} images available
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full px-6">
              {rateLimitError && (
                <div className="w-full bg-red-100 border border-red-300 rounded-lg p-3 text-xs text-red-800">
                  {rateLimitError}
                </div>
              )}

              {rateLimitInfo && (
                <div className="w-full bg-[#1a0505]/5 rounded-lg p-2 text-xs text-[#1a0505]/80 border border-[#1a0505]/10 text-center">
                  <span className="font-medium">{rateLimitInfo.remaining}</span>{" "}
                  of {rateLimitInfo.limit} images available today
                </div>
              )}

              <div className="w-full bg-[#1a0505]/5 rounded-lg p-3 text-xs text-[#1a0505]/80 border border-[#1a0505]/10">
                <strong>Pro tip:</strong> Make sure all faces are clearly
                visible and well-lit for the best results!
              </div>

              <div
                className={`w-full aspect-[3/1] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer py-0.5 my-[-0px] ${
                  dragActive
                    ? "border-[#1a0505] bg-[#1a0505]/10"
                    : "border-[#1a0505]/20 hover:border-[#1a0505]/40 hover:bg-[#1a0505]/5"
                }
              `}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    onUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-10 h-10 rounded-full bg-[#1a0505] text-[#F5E6D3] flex items-center justify-center mb-2 shadow-md">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="font-medium text-sm text-[#1a0505]">
                  Your photo here
                </p>
                <p className="text-xs text-[#1a0505]/60">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onUpload(e.target.files[0]);
                    }
                  }}
                />
              </div>

              <div className="w-full flex flex-col gap-2 border-[#1a0505]/10 pt-4 border-t-0 my-[-10px]">
                <AnimatePresence>
                  {showPrompt && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden w-full"
                    >
                      <Textarea
                        placeholder="Describe your perfect Christmas transformation..."
                        className="bg-[#1a0505]/5 border-[#1a0505]/20 text-[#1a0505] placeholder:text-[#1a0505]/40 min-h-[80px] focus-visible:ring-[#1a0505]/30 resize-none mt-2 text-xs"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                      <p className="text-[10px] text-[#1a0505]/40 mt-1 text-left">
                        Customize how the AI transforms your photo.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function UploadView({
  onBack,
  onUpload,
  showPrompt,
  prompt,
  setPrompt,
}: {
  onBack: () => void;
  onUpload: (file: File) => void;
  showPrompt: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
}) {
  const [dragActive, setDragActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full max-w-4xl flex flex-col items-center justify-center text-center z-30"
    >
      <button
        onClick={onBack}
        className="absolute top-24 left-6 md:left-12 md:top-32 text-sm opacity-50 hover:opacity-100 flex items-center gap-2 transition-opacity"
      >
        ← Back
      </button>

      <h2 className="font-serif text-3xl md:text-5xl mb-4">
        Your Magical Photo
      </h2>

      <div className="bg-[#F5E6D3]/10 border border-[#F5E6D3]/20 rounded-lg p-4 max-w-md mx-auto mb-8 text-sm text-[#F5E6D3]/80">
        <p>
          <strong>Pro tip:</strong> Make sure all faces in your photo are
          clearly visible and well-lit for the best Christmas transformation
          results!
        </p>
      </div>

      <div
        className={`
          w-full max-w-xl aspect-video md:aspect-[16/9] border-2 border-dashed rounded-3xl 
          flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-pointer
          ${
            dragActive
              ? "border-[#F5E6D3] bg-[#F5E6D3]/10"
              : "border-[#F5E6D3]/30 hover:border-[#F5E6D3]/60 hover:bg-[#F5E6D3]/5"
          }
        `}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <div className="w-16 h-16 rounded-full bg-[#F5E6D3] text-[#1a0505] flex items-center justify-center mb-4 shadow-lg">
          <Upload className="w-8 h-8" />
        </div>
        <p className="font-medium text-lg mb-2">Drag your photo here</p>
        <p className="text-sm opacity-50">or click to browse</p>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onUpload(e.target.files[0]);
            }
          }}
        />
      </div>

      <div className="w-full max-w-xl mt-8">
        <AnimatePresence>
          {showPrompt && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2 px-2">
                <PenLine className="w-4 h-4 text-[#F5E6D3]/60" />
                <Label htmlFor="prompt-mode" className="text-[#F5E6D3]/80">
                  Prompt Editor
                </Label>
              </div>
              <Textarea
                placeholder="Describe your perfect Christmas transformation..."
                className="bg-[#1a0505]/50 border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/30 min-h-[100px] focus-visible:ring-[#F5E6D3]/50"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <p className="text-[10px] text-[#F5E6D3]/40 mt-2 text-left">
                Customize how the AI transforms your photo.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ProcessingView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center text-center"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-[#F5E6D3]/20 animate-spin border-t-[#F5E6D3]" />
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <Sparkles className="w-8 h-8 text-[#D4AF37]" />
        </div>
      </div>
      <h3 className="font-serif text-2xl md:text-3xl animate-pulse">
        Transformation in progress...
      </h3>
      <p className="mt-4 text-[#F5E6D3]/60">
        The elves are working on your photo
      </p>
    </motion.div>
  );
}

function ResultView({
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
      className="w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-20 md:pt-0"
    >
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
          <button
            onClick={onReset}
            className="border border-[#F5E6D3]/30 px-8 py-3 rounded-full font-medium hover:bg-[#F5E6D3]/10 transition-colors"
          >
            Start over
          </button>
        </div>
      </div>

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
    </motion.div>
  );
}
