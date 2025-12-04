"use client";

import { Github, Volume2, VolumeX, Snowflake, PenLine } from "lucide-react";

interface HeaderProps {
  isMuted: boolean;
  isSnowEnabled: boolean;
  showPrompt: boolean;
  showPromptButton: boolean;
  onToggleSound: () => void;
  onToggleSnow: () => void;
  onTogglePrompt: () => void;
}

export function Header({
  isMuted,
  isSnowEnabled,
  showPrompt,
  showPromptButton,
  onToggleSound,
  onToggleSnow,
  onTogglePrompt,
}: HeaderProps) {
  return (
    <header className="h-20 shrink-0 w-full px-6 md:px-12 flex justify-between items-center z-20">
      <div className="flex gap-3">
        <button
          onClick={onToggleSound}
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
          onClick={onToggleSnow}
          className={`p-3 rounded-full transition-colors backdrop-blur-sm ${
            isSnowEnabled
              ? "bg-[#F5E6D3]/10 hover:bg-[#F5E6D3]/20"
              : "bg-[#F5E6D3]/5 hover:bg-[#F5E6D3]/10 opacity-50"
          }`}
          aria-label={isSnowEnabled ? "Disable Snow" : "Enable Snow"}
        >
          <Snowflake className="w-5 h-5" />
        </button>

        {showPromptButton && (
          <button
            onClick={onTogglePrompt}
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

      <a
        href="https://github.com/SofiaBargues/christmas-photo"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#F5E6D3]/10 hover:bg-[#F5E6D3]/20 px-3 py-3 rounded-full transition-colors text-xs md:text-sm font-medium"
      >
        <Github className="w-5 h-5" />
        <span className="sr-only">Star on GitHub</span>
      </a>
    </header>
  );
}
