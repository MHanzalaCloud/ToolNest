'use client';

import Link from "next/link";
import { Terminal, Zap } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#05050A]/85 backdrop-blur-xl border-b border-[#00F0FF]/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-[#12121F] border border-[#00F0FF]/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#FF5500] group-hover:shadow-[0_0_15px_#FF5500]">
            <Terminal className="w-5 h-5 text-[#00F0FF] group-hover:text-[#FF5500] transition-colors" />
          </div>
          <span className="text-2xl font-black tracking-wider text-[#00F0FF] uppercase">
            Tool<span className="text-[#FF5500]">Nest</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-[#00F0FF]/80">
          <Link href="/pdf" className="hover:text-[#FF5500] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FF5500] hover:after:w-full after:transition-all">PDF Suite</Link>
          <Link href="/image/resize" className="hover:text-[#FF5500] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FF5500] hover:after:w-full after:transition-all">Image Tools</Link>
          <Link href="/calculator/basic" className="hover:text-[#FF5500] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FF5500] hover:after:w-full after:transition-all">Calculators</Link>
          <Link href="/converter/unit" className="hover:text-[#FF5500] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FF5500] hover:after:w-full after:transition-all">Converters</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/#utilities" 
            className="blaze-orange-btn text-xs uppercase tracking-widest px-6 py-3 rounded-md flex items-center gap-2 group"
          >
            <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" /> Access Tools
          </Link>
        </div>
      </div>
    </header>
  );
}