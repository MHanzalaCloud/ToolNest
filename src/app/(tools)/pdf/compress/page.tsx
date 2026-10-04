'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Archive, Upload, Download, RefreshCw, AlertCircle } from 'lucide-react';

export default function CompressPdfPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid PDF file.');
      return;
    }
    setErrorMessage('');
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedSize(null);
  };

  const compressPdf = async () => {
    if (!file) return;
    try {
      setIsProcessing(true);
      setErrorMessage('');

      const arrayBuffer = await file.arrayBuffer();
      // Loading and re-saving with structural optimization
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Copy pages to a clean document to strip unused streams and metadata
      const newPdf = await PDFDocument.create();
      const pageIndices = pdfDoc.getPageIndices();
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      // Save without object streams / compressing internal dictionary overhead
      const pdfBytes = await newPdf.save({ useObjectStreams: true });
      const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(pdfBuffer).set(pdfBytes);
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

      setCompressedSize(blob.size);

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `compressed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to process PDF compression.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center my-6 flex items-center justify-center gap-2">
          <Archive className="w-8 h-8 text-indigo-400" /> Compress PDF
        </h1>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
            <AlertCircle className="w-4 h-4" /> {errorMessage}
          </div>
        )}

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/50 rounded-xl p-10 text-center cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="application/pdf"
              className="hidden"
            />
            <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
            <p className="text-slate-200 font-medium">Click or drag PDF here to Compress</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <p className="font-medium text-white truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-slate-400">
                  Original: {(originalSize / (1024 * 1024)).toFixed(2)} MB
                  {compressedSize && ` → Compressed: ${(compressedSize / (1024 * 1024)).toFixed(2)} MB`}
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-md"
              >
                <RefreshCw className="w-3 h-3" /> Change
              </button>
            </div>

            <button
              onClick={compressPdf}
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium"
            >
              <Download className="w-4 h-4" />
              {isProcessing ? 'Compressing PDF...' : 'Compress & Download PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}