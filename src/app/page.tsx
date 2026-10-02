import Link from "next/link";
import { FileText, Calculator, RefreshCw, Image as ImageIcon, ShieldCheck, Cpu, Lock, ArrowRight, Terminal, CheckCircle2 } from "lucide-react";

const tools = [
  { name: "PDF Suite", href: "/pdf/merge", icon: FileText, desc: "Merge, split, and re-order PDF documents client-side instantly." },
  { name: "Image Tools", href: "/image/resize", icon: ImageIcon, desc: "Compress, scale, and convert image formats locally in-browser." },
  { name: "Calculators", href: "/calculator/basic", icon: Calculator, desc: "Execute complex financial, developer, and scientific calculations." },
  { name: "Converters", href: "/converter/unit", icon: RefreshCw, desc: "Convert measurements, data bytes, and numeric formats with zero latency." },
];

export default function HomePage() {
  return (
    <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-20 text-[#00F0FF]">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F0FF]/30 bg-[#12121F] text-xs font-bold tracking-widest text-[#00F0FF] uppercase shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
          <Terminal className="w-4 h-4 text-[#FF5500]" /> High-Velocity Browser Utilities
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#00F0FF] leading-tight drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          LOCAL PROCESSING.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] via-[#00F0FF] to-[#00FF66]">
            ZERO SERVER DELAY.
          </span>
        </h1>
        
        <p className="text-[#00F0FF]/80 text-base md:text-lg font-mono leading-relaxed max-w-2xl mx-auto">
          ToolNest runs 100% inside your WebAssembly & JavaScript execution stack. Files never touch an external server.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <Link 
            href="#utilities" 
            className="blaze-orange-btn font-black text-sm uppercase tracking-wider px-8 py-4 rounded-lg flex items-center gap-3 group"
          >
            Launch Utilities <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Feature Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: ShieldCheck, title: "100% Private", desc: "No remote API uploads. Operations remain in local RAM memory." },
          { icon: Cpu, title: "Zero Latency", desc: "Native execution speed leveraging client hardware." },
          { icon: Lock, title: "Zero Tracking", desc: "No registration, cookies, or telemetry analytics." },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="cyber-card p-6 rounded-xl flex items-start gap-4 group">
              <div className="p-3 rounded-lg bg-[#05050A] text-[#FF5500] border border-[#FF5500]/40 group-hover:shadow-[0_0_15px_#FF5500] transition-all">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-[#00F0FF] text-lg uppercase tracking-wide">{item.title}</h2>
                <p className="text-[#00F0FF]/70 text-sm mt-1 font-mono leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Drop Zone */}
      <section className="cyber-card p-8 rounded-2xl border-dashed border-2 border-[#00F0FF]/40 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-[#00FF66] font-mono text-xs uppercase tracking-widest bg-[#00FF66]/10 px-3 py-1 rounded border border-[#00FF66]/30">
          <CheckCircle2 className="w-4 h-4 text-[#00FF66]" /> System Active
        </div>
        <h3 className="text-xl font-bold text-[#00F0FF]">Client File Execution Zone</h3>
        <p className="text-sm font-mono text-[#00F0FF]/60 max-w-lg mx-auto">Drop any PDF or Image file here for immediate local processing.</p>
        <div className="pt-2">
          <Link href="/pdf/merge" className="blaze-orange-btn inline-block px-6 py-2.5 rounded text-xs uppercase tracking-widest">
            Select Local File
          </Link>
        </div>
      </section>

      {/* Utility Grid */}
      <section id="utilities" className="space-y-8 pt-6">
        <div className="border-b border-[#00F0FF]/20 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#00F0FF] tracking-widest uppercase flex items-center gap-2">
            <Terminal className="w-6 h-6 text-[#FF5500]" /> Core Utility Stack
          </h2>
          <span className="text-xs text-[#00FF66] font-mono bg-[#12121F] px-3 py-1 rounded border border-[#00FF66]/30">BUILD v1.0.4 [ONLINE]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <Link 
                key={idx} 
                href={t.href} 
                className="cyber-card p-8 rounded-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-lg bg-[#05050A] border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] mb-6 group-hover:border-[#FF5500] group-hover:text-[#FF5500] group-hover:shadow-[0_0_20px_rgba(255,85,0,0.4)] transition-all">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#00F0FF] group-hover:text-[#FF5500] transition-colors mb-2 uppercase tracking-wide">{t.name}</h3>
                  <p className="text-[#00F0FF]/70 text-sm font-mono leading-relaxed">{t.desc}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF5500] uppercase tracking-widest mt-8 pt-4 border-t border-[#00F0FF]/10">
                  Execute Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}