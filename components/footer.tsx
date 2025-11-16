import Link from "next/link";
import { Star, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Main CTA */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white drop-shadow-md">
              Love this festive magic? ✨
            </h3>
            <p className="text-sm text-[#e63946] drop-shadow-sm">
              Help us spread the Christmas cheer by giving this project a star
              on GitHub!
            </p>
          </div>

          {/* GitHub Star Button */}
          <Link
            href="https://github.com/SofiaBargues/christmas-photo"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2 bg-white text-[#eb6f7f] font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:animate-spin" />
            <span className="text-sm">Star on GitHub</span>
            <Github className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
