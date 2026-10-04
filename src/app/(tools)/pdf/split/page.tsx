'use client';

import React, { useRef, useState, useEffect, type ChangeEvent, type DragEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, FileText, Download, Scissors, RefreshCw, AlertCircle } from 'lucide-react';

export default function SplitPdfPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [fromPage, setFromPage] = useState<number>(1);
  const [toPage, setToPage] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent hydration mismatches on static hosting (Cloudflare Pages)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFile = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setErrorMessage('Please upload a valid PDF file.');
      return;
    }

    try {
      setErrorMessage('');
      setIsProcessing(true);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      if (totalPages < 1) {
        setErrorMessage('The uploaded PDF has no pages.');
        setIsProcessing(false);
        return;
      }

      setFile(selectedFile);
      setPageCount(totalPages);
      setFromPage(1);
      setToPage(totalPages);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to read the PDF file. It might be corrupted or password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSplitAndDownload = async () => {
    if (!file) return;

    if (fromPage < 1 || toPage > pageCount || fromPage > toPage) {
      setErrorMessage(`Please enter a valid page range between 1 and ${pageCount}.`);
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage('');

      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();

      // Convert 1-based UI range to 0-based array index
      const pageIndices: number[] = [];
      for (let i = fromPage - 1; i <= toPage - 1; i++) {
        pageIndices.push(i);
      }

      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      const pdfBuffer = new Uint8Array(pdfBytes).slice().buffer as ArrayBuffer;
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `split_${fromPage}-${toPage}_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      setErrorMessage('An error occurred while splitting the PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setPageCount(0);
    setFromPage(1);
    setToPage(1);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Loading PDF Splitter Tool...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="text-center my-8">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <Scissors className="w-8 h-8 text-indigo-400" /> PDF Splitter
          </h1>
          <p className="text-slate-400 mt-2">Extract specific page ranges from your PDF files client-side.</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-950/20'
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="hidden"
            />
            <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-200">
              Drag & drop your PDF here, or <span className="text-indigo-400 underline">browse</span>
            </p>
            <p className="text-sm text-slate-500 mt-2">Files are processed entirely inside your browser for full privacy.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-indigo-400" />
                <div>
                  <p className="font-medium text-slate-100 truncate max-w-md">{file.name}</p>
                  <p className="text-xs text-slate-400">Total Pages: {pageCount}</p>
                </div>
              </div>
              <button
                onClick={resetState}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-md transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Change File
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300">Select Page Range to Extract</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">From Page</label>
                  <input
                    type="number"
                    min={1}
                    max={pageCount}
                    value={fromPage}
                    onChange={(e) => setFromPage(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">To Page</label>
                  <input
                    type="number"
                    min={fromPage}
                    max={pageCount}
                    value={toPage}
                    onChange={(e) => setToPage(Math.min(pageCount, parseInt(e.target.value) || fromPage))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSplitAndDownload}
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isProcessing ? 'Processing PDF...' : `Download Split PDF (Pages ${fromPage}–${toPage})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}