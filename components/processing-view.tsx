"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function ProcessingView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center text-center px-6"
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

      {/* Loading Bar */}
      <div className="w-full max-w-md mt-8">
        <div className="h-2 bg-[#F5E6D3]/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F5E6D3] to-[#D4AF37] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 50,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#F5E6D3]/40">
          <span>Processing</span>
          <span>Almost there...</span>
        </div>
      </div>
    </motion.div>
  );
}
