import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08090D] mt-24 py-12 text-sm text-gray-400">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-white font-bold text-base">ToolNest</span>
          <p className="text-xs text-gray-500 mt-1">
            © {new Date().getFullYear()} ToolNest Utility Engine. All processing is 100% client-side.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-xs font-semibold"
          >
            <Heart className="w-3.5 h-3.5 fill-current" /> Support ToolNest
          </a>
        </div>
      </div>
    </footer>
  );
}
