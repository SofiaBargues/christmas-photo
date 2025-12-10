import { useState, useEffect, useRef } from "react";

export function useBackgroundMusic() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return { isMuted, toggleSound };
}
