"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ProcessingView() {
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
