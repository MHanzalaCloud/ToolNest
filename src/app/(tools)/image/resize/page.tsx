'use client';

import { useState } from "react";
import { Image as ImageIcon, Download, Lock, Unlock, RefreshCw, Upload } from "lucide-react";

export default function ImageResizerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<string>("image/jpeg");
  const [quality, setQuality] = useState<number>(90);
  
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResizedUrl(null);
      setResizedSize(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImagePreview(src);

        const img = new Image();
        img.src = src;
        img.onload = () => {
          setOriginalWidth(img.naturalWidth);
          setOriginalHeight(img.naturalHeight);
          setWidth(img.naturalWidth);
          setHeight(img.naturalHeight);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (val: number) => {
    const numVal = Math.max(0, val);
    setWidth(numVal);
    if (lockAspect && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(numVal * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    const numVal = Math.max(0, val);
    setHeight(numVal);
    if (lockAspect && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.round(numVal * ratio));
    }
  };

  const handleResize = () => {
    if (!imagePreview || width <= 0 || height <= 0) return;

    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imagePreview;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = Number(width);
        canvas.height = Number(height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, Number(width), Number(height));

        const qualityFactor = format === "image/png" ? 1.0 : quality / 100;
        const dataUrl = canvas.toDataURL(format, qualityFactor);

        setResizedUrl(dataUrl);

        // Approximate byte size from Base64 string length
        const head = `data:${format};base64,`;
        const sizeInBytes = Math.round((dataUrl.length - head.length) * 0.75);
        setResizedSize((sizeInBytes / 1024).toFixed(2) + " KB");
      } catch (err) {
        console.error("Resize failed:", err);
      } finally {
        setIsProcessing(false);
      }
    };

    img.onerror = () => {
      setIsProcessing(false);
    };
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
          Image Resizer
        </h1>
        <p className="text-gray-400">
          Resize and compress images directly in your browser with zero data uploads.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 space-y-8">
        {!imagePreview ? (
          <div className="border-2 border-dashed border-white/10 hover:border-[#FF5500]/50 rounded-xl p-12 text-center bg-white/[0.02] cursor-pointer relative">
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <Upload className="w-12 h-12 text-[#FF5500] mx-auto mb-4" />
            <p className="text-lg font-medium text-white mb-1">
              Select an image to resize
            </p>
            <p className="text-sm text-gray-500">Supports PNG, JPG, WebP</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Preview Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase">Original Preview</h3>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center min-h-[220px] max-h-[320px] overflow-hidden">
                <img src={imagePreview} alt="Preview" className="max-h-[280px] object-contain rounded-lg" />
              </div>
              {selectedFile && (
                <div className="text-xs text-gray-400 space-y-1">
                  <p>File: <span className="text-gray-200">{selectedFile.name}</span></p>
                  <p>Original Resolution: <span className="text-gray-200">{originalWidth} x {originalHeight} px</span></p>
                  <p>Original Size: <span className="text-gray-200">{(selectedFile.size / 1024).toFixed(2)} KB</span></p>
                </div>
              )}
              <button
                onClick={() => {
                  setImagePreview(null);
                  setSelectedFile(null);
                  setResizedUrl(null);
                }}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Choose a different image
              </button>
            </div>

            {/* Controls Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase">Resize Settings</h3>

              {/* Width & Height Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={width || ""}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={height || ""}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>

              {/* Lock Aspect Ratio Toggle */}
              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors"
              >
                {lockAspect ? <Lock className="w-4 h-4 text-[#FF5500]" /> : <Unlock className="w-4 h-4 text-gray-500" />}
                {lockAspect ? "Aspect Ratio Locked" : "Aspect Ratio Unlocked"}
              </button>

              {/* Format Selection */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Output Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-[#12131A] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF5500]"
                >
                  <option value="image/jpeg">JPG / JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>

              {/* Quality Slider */}
              {format !== "image/png" && (
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Quality</span>
                    <span>{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-[#FF5500]"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleResize}
                disabled={isProcessing || width <= 0 || height <= 0}
                className="w-full py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] disabled:opacity-50 text-white font-semibold transition-all brand-glow flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Resizing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" /> Resize Image
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Download Box */}
        {resizedUrl && (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-emerald-400">Image successfully resized!</p>
              <p className="text-xs text-gray-400">
                New Resolution: {width} x {height} px | Est. Size: {resizedSize}
              </p>
            </div>
            <a
              href={resizedUrl}
              download={`resized-tool-nest.${format.split("/")[1]}`}
              className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Resized Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
