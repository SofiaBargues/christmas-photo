"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadFormProps {
  onUpload: (file: File, prompt: string) => void;
  isLoading: boolean;
  hasImage: boolean;
}

export default function ImageUploadForm({
  onUpload,
  isLoading,
  hasImage,
}: ImageUploadFormProps) {
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && prompt.trim()) {
      onUpload(selectedFile, prompt);
      setPrompt("");
      setFileName("");
      setSelectedFile(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white rounded-3xl p-10 shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#E63946] mb-2">
          Create Your Magic
        </h2>
        <p className="text-gray-600 text-sm">
          Upload and transform your photos
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            1. Upload your photo
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-6 py-4 border-2 border-dashed border-[#10B981] rounded-xl hover:bg-green-50 hover:border-[#0D9F6E] transition-all text-gray-700 font-semibold bg-green-50/30"
          >
            {fileName ? `📷 ${fileName}` : "📤 Choose a photo"}
          </button>
          {fileName && (
            <p className="text-sm text-[#10B981] mt-3 font-bold flex items-center gap-2">
              <span className="text-lg">✓</span> File selected
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            2. Describe your transformation
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add Christmas decorations, Santa hats, festive lights, and snow..."
            className="w-full h-32 px-4 py-3 border-2 border-[#10B981] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E63946] text-gray-700 placeholder-gray-400 resize-none bg-white"
          />
        </div>

        <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-4 border border-[#10B981]/30">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-bold text-[#E63946]">Pro tip:</span> Make sure
            all faces in your photo are clearly visible and well-lit for the
            best Christmas transformation results!
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !selectedFile || !prompt.trim()}
          className={`w-full py-6 rounded-xl font-bold text-lg text-white transition-all shadow-lg ${
            isLoading || !selectedFile || !prompt.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#E63946] to-[#F77F00] hover:from-[#D62828] hover:to-[#E85D04] active:scale-95"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="animate-spin text-2xl">⏳</span>
              Generating magic...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              ✨ Generate Christmas Magic
            </span>
          )}
        </Button>

        {hasImage && !isLoading && (
          <div className="text-center">
            <p className="text-base text-[#10B981] font-bold bg-green-50 py-3 px-4 rounded-xl">
              🎉 Ready to create another masterpiece!
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
