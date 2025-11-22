"use client"

import { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SnowEffect } from "@/components/snow-effect"
import { Volume2, VolumeX, Upload, Sparkles, Github, Snowflake, GripVertical, PenLine } from "lucide-react"
import Image from "next/image"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Page() {
  const [isMuted, setIsMuted] = useState(true)
  const [isSnowEnabled, setIsSnowEnabled] = useState(true)
  const [view, setView] = useState<"landing" | "upload" | "processing" | "result">("landing")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const toggleSound = () => setIsMuted(!isMuted)
  const toggleSnow = () => setIsSnowEnabled(!isSnowEnabled)

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setUploadedImage(url)
    setView("processing")
    setTimeout(() => setView("result"), 3000)
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#1a0505] text-[#F5E6D3] selection:bg-[#D4AF37] selection:text-[#1a0505]">
      <SnowEffect isEnabled={isSnowEnabled} />

      <div className="absolute top-0 left-0 w-full p-6 md:p-12 z-20 flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-xs md:text-sm font-bold tracking-widest uppercase text-[#F5E6D3]/60">Riven</h1>
          <p className="text-[10px] md:text-xs tracking-wider uppercase text-[#F5E6D3]/40 mt-1">Présente</p>
        </div>
        <a
          href="https://github.com"
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
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleSnow}
          className={`p-3 rounded-full transition-colors backdrop-blur-sm ${isSnowEnabled ? "bg-[#F5E6D3]/10 hover:bg-[#F5E6D3]/20" : "bg-[#F5E6D3]/5 hover:bg-[#F5E6D3]/10 opacity-50"}`}
          aria-label={isSnowEnabled ? "Disable Snow" : "Enable Snow"}
        >
          <Snowflake className="w-5 h-5" />
        </button>
      </div>

      <div className="relative z-10 w-full h-screen flex flex-col md:flex-row items-center justify-center p-6 md:p-12">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <LandingView key="landing" onStart={() => setView("upload")} onUpload={handleUpload} />
          )}
          {view === "upload" && <UploadView key="upload" onBack={() => setView("landing")} onUpload={handleUpload} />}
          {view === "processing" && <ProcessingView key="processing" />}
          {view === "result" && (
            <ResultView
              key="result"
              image={uploadedImage}
              onReset={() => {
                setUploadedImage(null)
                setView("upload")
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function LandingView({ onStart, onUpload }: { onStart: () => void; onUpload: (file: File) => void }) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-7xl h-full grid grid-cols-1 sm:grid-cols-2 items-center justify-items-center relative z-10 gap-0 px-[45px] py-[67px]"
    >
      <div className="order-1 w-full flex flex-col items-center md:items-start text-center md:text-left">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-balance max-w-lg"
        >
          ENVOIE LA PLUS BELLE DES CARTES DE NOËL.
        </motion.h2>
      </div>

      <div className="order-2 w-full max-w-md md:max-w-xl relative group perspective-1000">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="relative w-full aspect-[3/4] md:aspect-[4/5] z-10"
        >
          <div
            onClick={onStart}
            className="absolute -inset-10 border-2 border-dashed border-[#F5E6D3]/30 rounded-[3rem] z-0 animate-pulse group-hover:border-[#F5E6D3]/60 transition-colors cursor-pointer flex items-start justify-center pt-2 my-[-67px]"
          >
            <div className="bg-[#F5E6D3] text-[#1a0505] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg transform -translate-y-1/2">
              Try with your photo
            </div>
          </div>

          <div className="absolute inset-0 rounded-[2rem] overflow-hidden border-8 border-[#F5E6D3] shadow-2xl shadow-black/50 bg-[#1a0505] transition-transform duration-500 group-hover:scale-[1.02] px-0 mx-[-2px] my-[-51px] py-0">
            <ResizablePanelGroup direction="horizontal" className="w-full h-full rounded-[1.5rem] overflow-hidden">
              <ResizablePanel defaultSize={50}>
                <div className="relative h-full bg-[#1a0505] flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider z-20">
                    Before
                  </div>
                  <Image
                    src="/placeholder-user.jpg"
                    alt="Original Photo"
                    width={600}
                    height={800}
                    className="object-cover w-full h-full opacity-80 grayscale transition-all duration-700 group-hover:grayscale-0"
                    priority
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle className="relative w-0 bg-transparent flex items-center justify-center outline-none z-50">
                <div className="absolute inset-y-0 w-1 bg-[#F5E6D3]/20 group-hover:bg-[#F5E6D3]/40 transition-colors" />
                <div className="h-12 w-8 rounded-full bg-[#1a0505] border border-[#F5E6D3]/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,230,211,0.2)] backdrop-blur-sm transition-transform hover:scale-110 cursor-col-resize">
                  <GripVertical className="w-4 h-4 text-[#F5E6D3]" />
                </div>
              </ResizableHandle>

              <ResizablePanel defaultSize={50}>
                <div className="relative h-full bg-[#D44D5C] flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 right-4 bg-[#F5E6D3] text-[#1a0505] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-20">
                    After
                  </div>
                  <div className="relative w-full h-full bg-gradient-to-b from-[#1a4d40] to-[#D44D5C] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent" />
                    <Image
                      src="/nutcracker-toy-christmas-vintage-3d-render.jpg"
                      alt="Nutcracker Result"
                      width={600}
                      height={800}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[90%] p-6 bg-[#F5E6D3] rounded-xl text-[#1a0505] text-center shadow-xl z-20 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 px-0 flex flex-col items-center my-[-97px]"
        >
          <div className="flex flex-col items-center gap-4 w-full px-6">
            <div className="w-full bg-[#1a0505]/5 rounded-lg p-3 text-xs text-[#1a0505]/80 border border-[#1a0505]/10">
              <strong>Pro tip:</strong> Make sure all faces are clearly visible and well-lit for the best results!
            </div>

            <div
              className={`w-full aspect-[3/1] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer py-0.5 my-[-0px] ${dragActive ? "border-[#1a0505] bg-[#1a0505]/10" : "border-[#1a0505]/20 hover:border-[#1a0505]/40 hover:bg-[#1a0505]/5"}
              `}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  onUpload(e.dataTransfer.files[0])
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-10 h-10 rounded-full bg-[#1a0505] text-[#F5E6D3] flex items-center justify-center mb-2 shadow-md">
                <Upload className="w-5 h-5" />
              </div>
              <p className="font-medium text-sm text-[#1a0505]">Glisse ta photo ici</p>
              <p className="text-xs text-[#1a0505]/60">ou clique pour parcourir</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onUpload(e.target.files[0])
                  }
                }}
              />
            </div>

            <div className="w-full flex flex-col gap-2 border-[#1a0505]/10 pt-4 border-t-0 my-[-10px]">
              <div
                className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setShowPrompt(!showPrompt)}
              >
                <div className="flex items-center gap-2">
                  <PenLine className="w-4 h-4 text-[#1a0505]/60" />
                  <span className="text-sm font-medium select-none">Prompt Writer</span>
                </div>
              </div>

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
                    />
                    <p className="text-[10px] text-[#1a0505]/40 mt-1 text-left">
                      Customize how the AI transforms your photo.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function UploadView({ onBack, onUpload }: { onBack: () => void; onUpload: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false) // Added state for prompt writer

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
        ← Retour
      </button>

      <h2 className="font-serif text-3xl md:text-5xl mb-4">Ta Photo Magique</h2>

      <div className="bg-[#F5E6D3]/10 border border-[#F5E6D3]/20 rounded-lg p-4 max-w-md mx-auto mb-8 text-sm text-[#F5E6D3]/80">
        <p>
          <strong>Pro tip:</strong> Make sure all faces in your photo are clearly visible and well-lit for the best
          Christmas transformation results!
        </p>
      </div>

      <div
        className={`
          w-full max-w-xl aspect-video md:aspect-[16/9] border-2 border-dashed rounded-3xl 
          flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-pointer
          ${dragActive ? "border-[#F5E6D3] bg-[#F5E6D3]/10" : "border-[#F5E6D3]/30 hover:border-[#F5E6D3]/60 hover:bg-[#F5E6D3]/5"}
        `}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0])
          }
        }}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <div className="w-16 h-16 rounded-full bg-[#F5E6D3] text-[#1a0505] flex items-center justify-center mb-4 shadow-lg">
          <Upload className="w-8 h-8" />
        </div>
        <p className="font-medium text-lg mb-2">Glisse ta photo ici</p>
        <p className="text-sm opacity-50">ou clique pour parcourir</p>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onUpload(e.target.files[0])
            }
          }}
        />
      </div>

      <div className="w-full max-w-xl mt-8">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <PenLine className="w-4 h-4 text-[#F5E6D3]/60" />
            <Label htmlFor="prompt-mode" className="text-[#F5E6D3]/80 cursor-pointer">
              Prompt Writer
            </Label>
          </div>
          <Switch
            id="prompt-mode"
            checked={showPrompt}
            onCheckedChange={setShowPrompt}
            className="data-[state=checked]:bg-[#F5E6D3]"
          />
        </div>

        <AnimatePresence>
          {showPrompt && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Textarea
                placeholder="Describe your perfect Christmas transformation..."
                className="bg-[#1a0505]/50 border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/30 min-h-[100px] focus-visible:ring-[#F5E6D3]/50"
              />
              <p className="text-[10px] text-[#F5E6D3]/40 mt-2 text-left">
                Customize how the AI transforms your photo.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
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
      <h3 className="font-serif text-2xl md:text-3xl animate-pulse">Transformation en cours...</h3>
      <p className="mt-4 text-[#F5E6D3]/60">Les elfes travaillent sur ta photo</p>
    </motion.div>
  )
}

function ResultView({ image, onReset }: { image: string | null; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-20 md:pt-0"
    >
      <div className="flex-1 text-center md:text-left">
        <h2 className="font-serif text-3xl md:text-5xl mb-6">Voici ta carte !</h2>
        <p className="text-[#F5E6D3]/70 mb-8 max-w-md">Partage la magie de Noël avec tes proches.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
          <button className="bg-[#F5E6D3] text-[#1a0505] px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform">
            Télécharger
          </button>
          <button
            onClick={onReset}
            className="border border-[#F5E6D3]/30 px-8 py-3 rounded-full font-medium hover:bg-[#F5E6D3]/10 transition-colors"
          >
            Recommencer
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
          {image && (
            <>
              <div className="absolute inset-0 bg-[url('/winter-snowfall.png')] opacity-20 mix-blend-overlay z-10 pointer-events-none" />

              <img
                src={image || "/placeholder.svg"}
                alt="Result"
                className="w-full h-full object-cover mix-blend-luminosity opacity-90"
              />

              <div className="absolute inset-0 border-[20px] border-[#D4AF37]/20 z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#1a0505] to-transparent z-20" />

              <div className="absolute bottom-8 left-0 w-full text-center z-30">
                <div className="font-serif text-3xl text-[#F5E6D3] drop-shadow-md">Merry Christmas</div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
