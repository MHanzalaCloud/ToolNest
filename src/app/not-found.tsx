import Link from 'next/link';
import { Terminal, AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 text-[#00F0FF]">
      <div className="cyber-card max-w-lg w-full p-8 rounded-2xl text-center space-y-6 border border-[#FF5500]/40 shadow-[0_0_30px_rgba(255,85,0,0.2)]">
        <div className="w-16 h-16 rounded-xl bg-[#05050A] border border-[#FF5500] flex items-center justify-center mx-auto text-[#FF5500] shadow-[0_0_15px_#FF5500]">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-[#FF5500] uppercase tracking-widest bg-[#FF5500]/10 px-3 py-1 rounded border border-[#FF5500]/30">
            Error 404 // Route Not Instantiated
          </span>
          <h1 className="text-3xl font-black uppercase text-[#00F0FF] tracking-wide pt-2">
            Tool Page Unreachable
          </h1>
          <p className="text-sm font-mono text-[#00F0FF]/70 leading-relaxed">
            The requested utility route does not exist or has not been deployed to local runtime memory yet.
          </p>
        </div>

        <div className="pt-2">
          <Link 
            href="/" 
            className="blaze-orange-btn font-black text-xs uppercase tracking-widest px-6 py-3 rounded-lg inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Return to ToolNest Base
          </Link>
        </div>
      </div>
    </main>
  );
}