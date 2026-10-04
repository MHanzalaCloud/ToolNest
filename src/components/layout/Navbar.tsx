'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Image as ImageIcon, FileText, Lock, Terminal, Menu, X, ChevronDown, Coffee } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#00F0FF]/20 bg-[#05050A]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-[#12121F] border border-[#00F0FF]/30 group-hover:border-[#00F0FF] transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <Terminal className="w-5 h-5 text-[#FF5500]" />
            </div>
            <span className="font-black text-lg tracking-wider text-[#00F0FF] uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
              Tool<span className="text-[#FF5500]">Nest</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider font-mono">
            <Link 
              href="/" 
              className="text-[#00F0FF]/80 hover:text-[#00F0FF] transition-colors"
            >
              Home
            </Link>

            {/* Tools Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                onMouseEnter={() => setIsToolsDropdownOpen(true)}
                className="flex items-center gap-1 text-[#00F0FF]/80 hover:text-[#00F0FF] transition-colors py-2"
              >
                <span>Utilities</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#FF5500]" />
              </button>

              {isToolsDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsToolsDropdownOpen(false)}
                  className="absolute top-full left-0 w-48 bg-[#12121F] border border-[#00F0FF]/30 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)] py-2 mt-1 space-y-1"
                >
                  {/* Fixed Route: /pdf/ */}
                  <Link
                    href="/pdf"
                    onClick={() => setIsToolsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[#00F0FF]/80 hover:text-[#00F0FF] hover:bg-[#05050A] transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#FF5500]" />
                    <span>PDF Suite</span>
                  </Link>

                  <Link
                    href="/image"
                    onClick={() => setIsToolsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[#00F0FF]/80 hover:text-[#00F0FF] hover:bg-[#05050A] transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-[#FF5500]" />
                    <span>Image Tools</span>
                  </Link>

                  <Link
                    href="/hash"
                    onClick={() => setIsToolsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[#00F0FF]/80 hover:text-[#00F0FF] hover:bg-[#05050A] transition-colors"
                  >
                    <Lock className="w-4 h-4 text-[#FF5500]" />
                    <span>Hash Generator</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Fixed Direct PDF Link */}
            <Link 
              href="/pdf" 
              className="flex items-center gap-1.5 text-[#00F0FF]/80 hover:text-[#00F0FF] transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>PDF Tools</span>
            </Link>
          </nav>

          {/* Header Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://www.buymeacoffee.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FFDD00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#ffe536] transition-all shadow-[0_0_12px_rgba(255,221,0,0.3)]"
            >
              <Coffee className="w-3.5 h-3.5 text-black" />
              <span>Buy me a coffee</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#00F0FF] hover:text-[#FF5500] focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#12121F] border-b border-[#00F0FF]/20 px-4 pt-2 pb-6 space-y-3 font-mono text-xs uppercase">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-[#00F0FF]/80 hover:text-[#00F0FF]"
          >
            Home
          </Link>
          
          {/* Mobile Direct PDF Link */}
          <Link
            href="/pdf"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-[#00F0FF]/80 hover:text-[#00F0FF]"
          >
            <FileText className="w-4 h-4 text-[#FF5500]" />
            <span>PDF Utility Suite</span>
          </Link>

          <Link
            href="/image"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-[#00F0FF]/80 hover:text-[#00F0FF]"
          >
            <ImageIcon className="w-4 h-4 text-[#FF5500]" />
            <span>Image Tools</span>
          </Link>

          <a
            href="https://www.buymeacoffee.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-lg bg-[#FFDD00] text-black font-extrabold"
          >
            <Coffee className="w-4 h-4" />
            <span>Buy me a coffee</span>
          </a>
        </div>
      )}
    </header>
  );
}