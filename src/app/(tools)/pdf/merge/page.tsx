'use client';

import { useState } from "react";
import { FileUp, Merge, Download, CheckCircle2, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function PDFMergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setError(null);
      setMergedUrl(null);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMergedUrl(null);
  };

  const clearAll = () => {
    setFiles([]);
    setMergedUrl(null);
    setError(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save the merged PDF and create a local Blob URL
      const mergedPdfBytes = await mergedPdf.save();
      const pdfBuffer = new ArrayBuffer(mergedPdfBytes.byteLength);
      new Uint8Array(pdfBuffer).set(mergedPdfBytes);
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setMergedUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to merge PDF files.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">
          Merge PDF Documents
        </h1>
        <p className="text-gray-400">
          Combine multiple PDF files into a single structured document directly in your browser.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8">
        <div className="border-2 border-dashed border-white/10 hover:border-[#FF5500]/50 rounded-xl p-8 text-center bg-white/[0.02] cursor-pointer relative">
          <input
            type="file"
            multiple
            accept="application/pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <FileUp className="w-12 h-12 text-[#FF5500] mx-auto mb-4" />
          <p className="text-lg font-medium text-white mb-1">
            {files.length > 0 ? "Click or drag to add more PDF files" : "Drop PDF files here or click to browse"}
          </p>
          <p className="text-sm text-gray-500">Requires 2 or more files</p>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400 uppercase">
                Selected Files ({files.length})
              </h3>
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 truncate pr-4">
                    <span className="text-xs font-bold text-[#FF5500] bg-[#FF5500]/10 px-2 py-1 rounded">
                      #{i + 1}
                    </span>
                    <span className="text-sm text-gray-200 truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-1"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!mergedUrl ? (
            <button
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] disabled:opacity-50 text-white font-semibold transition-all brand-glow flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Merging...
                </>
              ) : (
                <>
                  <Merge className="w-5 h-5" /> Merge Documents
                </>
              )}
            </button>
          ) : (
            <div className="w-full flex items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5" /> Document merged successfully!
              </div>
              <a
                href={mergedUrl}
                download="merged-tool-nest.pdf"
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
