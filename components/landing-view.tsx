"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Upload, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import BeforeAfterSlider from "@/components/ui/before-after-slider";
import { RateLimitInfo } from "@/server/ratelimit";

export function LandingView({
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
      className="w-full max-w-7xl h-auto md:h-full grid grid-cols-1 sm:grid-cols-2 items-center justify-items-center relative z-10 gap-y-32
       md:gap-24 px-4 md:px-[45px] md:py-[67px]"
    >
      <div className="order-1 w-full flex flex-col items-center md:items-start text-center sm:text-left ">
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
          className="md:mt-4 text-md text-[#F5E6D3]/80 max-w-md"
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
