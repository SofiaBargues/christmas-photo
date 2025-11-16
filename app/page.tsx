"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DemoBeforeAfter from "@/components/demo-before-after";
import UserResultComparison from "@/components/user-result-comparison";
import ImageUploadForm from "@/components/image-upload-form";
import { generateImage } from "@/server/image";

export default function Home() {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File, prompt: string) => {
    setIsLoading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const originalImage = e.target?.result as string;

        // Immediately set the before image so user can see their upload
        setBeforeImage(originalImage);
        setAfterImage(null); // Clear previous after image while generating

        // Extract base64 data without the data URL prefix
        const base64Data = originalImage.split(",")[1];
        const mimeType = file.type;

        try {
          // Call the generateImage function
          const result = await generateImage(prompt, {
            data: base64Data,
            mimeType: mimeType,
          });

          // Set the generated image - this will replace the demo
          if (result) {
            console.log("Generated image path:", result);
            setAfterImage(result); // result ya incluye la barra inicial
          } else {
            console.log("No result returned from generateImage");
            // If generation fails, show original as after image
            setAfterImage(originalImage);
          }
        } catch (error) {
          console.error("Error generating image:", error);
          // On error, show the original image for both sides
          setAfterImage(originalImage);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing file:", error);
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (afterImage) {
      const link = document.createElement("a");
      link.href = afterImage;
      link.download = `christmas-magic-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleNewGeneration = () => {
    setBeforeImage(null);
    setAfterImage(null);
  };

  // Mostrar vista de resultado cuando hay imagen generada
  if (afterImage && !isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#E96479] to-[#F5E6D3] relative overflow-hidden">
        {/* Decoraciones reducidas para la vista de resultado */}
        <div className="absolute left-4 top-4">
          <div className="text-4xl opacity-60 animate-pulse">❄️</div>
        </div>
        <div className="absolute right-4 top-4">
          <div className="text-4xl opacity-60 animate-pulse">🎄</div>
        </div>

        <div className="container mx-auto px-8 py-8 min-h-screen flex flex-col">
          {/* Header con título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
              ✨ Your Christmas Magic is Ready! ✨
            </h1>
            <p className="text-white text-lg md:text-xl font-medium drop-shadow-md">
              Your photo has been transformed with festive Christmas spirit
            </p>
          </div>

          {/* Imagen generada ocupando todo el espacio */}
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/30 shadow-2xl max-w-4xl w-full">
              <div className="relative aspect-square max-h-[70vh] mx-auto">
                <Image
                  src={afterImage}
                  alt="Generated Christmas Image"
                  width={800}
                  height={800}
                  className="w-full h-full object-contain rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={handleDownload}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105 flex items-center gap-3 text-lg h-auto"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Image
            </Button>
            <Button
              onClick={handleNewGeneration}
              size="lg"
              variant="destructive"
              className="font-bold py-6 px-8 rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105 flex items-center gap-3 text-lg h-auto"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Generate New Image
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E96479] to-[#F5E6D3] relative overflow-hidden">
      {/* Left decorative column */}
      <div className="absolute left-4 top-0 h-full w-40 flex flex-col justify-between py-12">
        <div className="text-6xl md:text-8xl opacity-100 animate-pulse hover:scale-125 transition-all duration-300 cursor-pointer">
          ❄️
        </div>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wreath-1SjpINKa6Yc8iKfYhEcSKogp0zfBKp.png"
          alt="Wreath"
          className="w-24 h-24 md:w-32 md:h-32 opacity-100 hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer"
        />
        <div className="text-5xl md:text-6xl opacity-100 animate-bounce hover:scale-125 transition-all duration-300 cursor-pointer">
          🎄
        </div>
        <div className="text-4xl md:text-5xl opacity-100 hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer">
          ⭐
        </div>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sled-dCQwJrAfr2YUeTNv2R0vfRdQe8ae6Y.png"
          alt="Sled"
          className="w-24 h-18 md:w-32 md:h-24 opacity-100 hover:scale-110 hover:-rotate-6 transition-all duration-300 cursor-pointer"
        />
      </div>

      {/* Right decorative column */}
      <div className="absolute right-4 top-0 h-full w-40 flex flex-col justify-between py-12">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/santa_flying_angle-hN5b3dbrnauvOrKxTe7mR9mwlQIdSb.png"
          alt="Santa"
          className="w-32 h-32 md:w-40 md:h-40 opacity-100 animate-bounce hover:scale-125 hover:rotate-6 transition-all duration-300 cursor-pointer"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="text-6xl md:text-8xl opacity-100 animate-pulse hover:scale-125 transition-all duration-300 cursor-pointer"
          style={{ animationDelay: "1s" }}
        >
          ❄️
        </div>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bell-sbTbotDAnGyOa2KDSN3CUHfuVKVhS1.png"
          alt="Bell"
          className="w-24 h-24 md:w-32 md:h-32 opacity-100 hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer"
        />
        <div className="text-4xl md:text-5xl opacity-100 hover:scale-125 hover:-rotate-12 transition-all duration-300 cursor-pointer">
          🎁
        </div>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sock-vULNSasFJrlb0VbfkL9rAJwPnb1HcQ.png"
          alt="Sock"
          className="w-20 h-28 md:w-28 md:h-40 opacity-100 hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-pointer"
        />
      </div>

      <div className="container mx-auto px-16 md:px-48 py-12 min-h-screen flex flex-col">
        {/* Hero section with title */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Christmas AI Photo Editor
          </h1>
          <p className="text-white text-xl md:text-2xl font-medium drop-shadow-md max-w-2xl mx-auto">
            Transform your photos with festive Christmas magic
          </p>
        </div>

        <div className="flex-1 grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full items-start">
          {/* Left column - Demo/Preview */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border-2 border-white/30 shadow-2xl h-full">
              {beforeImage ? (
                afterImage ? (
                  <UserResultComparison
                    beforeImage={beforeImage}
                    afterImage={afterImage}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                    <div className="text-center space-y-3">
                      <div className="animate-spin text-6xl">✨</div>
                      <p className="text-white text-2xl font-bold drop-shadow-lg">
                        Creating Christmas Magic...
                      </p>
                      <p className="text-white text-lg drop-shadow-md">
                        Your festive transformation is being generated
                      </p>
                    </div>
                    <div className="relative w-full aspect-4/3 bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={beforeImage}
                        alt="Your Original Photo"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                )
              ) : (
                <DemoBeforeAfter />
              )}
            </div>
          </div>

          {/* Right column - Upload form */}
          <div className="relative flex flex-col items-start justify-center lg:pt-12 gap-6">
            <ImageUploadForm
              onUpload={handleUpload}
              isLoading={isLoading}
              hasImage={!!beforeImage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
