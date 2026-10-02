import { ShieldCheck, Zap, Lock, Code2, HeartHandshake } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
          About <span className="text-[#FF5500]">ToolNest</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          High-performance, privacy-first web utilities designed to process your files and data directly in your browser.
        </p>
      </div>

      <div className="space-y-8">
        <div className="glass-card p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#FF5500]" />
            Privacy by Design
          </h2>
          <p className="text-gray-300 leading-relaxed">
            At <strong className="text-white">ToolNest</strong>, we believe your data should stay strictly on your device. Traditional online converters and PDF tools upload your sensitive files to remote servers. ToolNest eliminates this security risk by leveraging modern WebAssembly and browser APIs to process images, PDFs, and data client-side.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <Zap className="w-8 h-8 text-[#FF5500] mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Zero Latency</h3>
            <p className="text-sm text-gray-400">
              Without server upload or download waits, actions like PDF merging and image resizing execute instantly using your local computer hardware.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <Lock className="w-8 h-8 text-[#FF5500] mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">No Tracking or Accounts</h3>
            <p className="text-sm text-gray-400">
              No registration, no daily conversion caps, and no creepy tracking scripts. Just reliable, clean tools whenever you need them.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-2xl border border-white/10 text-center space-y-4">
          <Code2 className="w-10 h-10 text-[#FF5500] mx-auto" />
          <h2 className="text-2xl font-bold text-white">Built for Efficiency</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            ToolNest is engineered as a lightweight utility engine to keep web productivity fast, private, and accessible to everyone.
          </p>
        </div>
      </div>
    </div>
  );
}
