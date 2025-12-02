"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Upload, PenLine } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function UploadView({
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
