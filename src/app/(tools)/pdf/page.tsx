'use client';

import React, { useRef, useState, useEffect, type ChangeEvent, type DragEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Scissors, Archive, Layers, Upload, Download, RefreshCw, AlertCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

type ToolType = 'merge' | 'split' | 'compress';

export default function PdfToolsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ToolType>('merge');

  // Common State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Merge State
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);

  // Split State
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitPageCount, setSplitPageCount] = useState<number>(0);
  const [fromPage, setFromPage] = useState<number>(1);
  const [toPage, setToPage] = useState<number>(1);

  // Compress State
  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const resetAll = () => {
    setMergeFiles([]);
    setSplitFile(null);
    setSplitPageCount(0);
    setFromPage(1);
    setToPage(1);
    setCompressFile(null);
    setOriginalSize(0);
    setCompressedSize(null);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTabChange = (tab: ToolType) => {
    setActiveTab(tab);
    resetAll();
  };

  // --- MERGE HANDLERS ---
  const handleMergeFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter((f) => f.type === 'application/pdf');
    if (validFiles.length === 0) {
      setErrorMessage('Please select valid PDF files.');
      return;
    }
    setErrorMessage('');
    setMergeFiles((prev) => [...prev, ...validFiles]);
  };

  const removeMergeFile = (index: number) => {
    setMergeFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveMergeFile = (index: number, direction: 'up' | 'down') => {
    const updated = [...mergeFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setMergeFiles(updated);
  };

  const executeMerge = async () => {
    if (mergeFiles.length < 2) {
      setErrorMessage('Please select at least 2 PDF files to merge.');
      return;
    }
    try {
      setIsProcessing(true);
      setErrorMessage('');

      const mergedPdf = await PDFDocument.create();

      for (const file of mergeFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      downloadBlob(pdfBytes, 'merged_document.pdf');
    } catch (err) {
      console.error(err);
      setErrorMessage('An error occurred while merging PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- SPLIT HANDLERS ---
  const handleSplitFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF file.');
      return;
    }
    try {
      setIsProcessing(true);
      setErrorMessage('');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const total = pdf.getPageCount();

      if (total < 1) {
        setErrorMessage('This PDF contains no pages.');
        return;
      }

      setSplitFile(file);
      setSplitPageCount(total);
      setFromPage(1);
      setToPage(total);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to read PDF file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const executeSplit = async () => {
    if (!splitFile) return;
    if (fromPage < 1 || toPage > splitPageCount || fromPage > toPage) {
      setErrorMessage(`Please select a page range between 1 and ${splitPageCount}.`);
      return;
    }
    try {
      setIsProcessing(true);
      setErrorMessage('');

      const arrayBuffer = await splitFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();

      const pageIndices: number[] = [];
      for (let i = fromPage - 1; i <= toPage - 1; i++) {
        pageIndices.push(i);
      }

      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const pdfBytes = await newDoc.save();
      downloadBlob(pdfBytes, `split_${fromPage}-${toPage}_${splitFile.name}`);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- COMPRESS HANDLERS ---
  const handleCompressFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF file.');
      return;
    }
    setErrorMessage('');
    setCompressFile(file);
    setOriginalSize(file.size);
    setCompressedSize(null);
  };

  const executeCompress = async () => {
    if (!compressFile) return;
    try {
      setIsProcessing(true);
      setErrorMessage('');

      const arrayBuffer = await compressFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      const newPdf = await PDFDocument.create();
      const pageIndices = pdfDoc.getPageIndices();
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save({ useObjectStreams: true });
      setCompressedSize(pdfBytes.byteLength);

      downloadBlob(pdfBytes, `compressed_${compressFile.name}`);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HELPER ---
  const downloadBlob = (bytes: Uint8Array, fileName: string) => {
    const buffer = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(buffer).set(bytes);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDragDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    if (activeTab === 'merge') handleMergeFiles(e.dataTransfer.files);
    if (activeTab === 'split') handleSplitFile(e.dataTransfer.files[0]);
    if (activeTab === 'compress') handleCompressFile(e.dataTransfer.files[0]);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 mb-8">
          <button
            onClick={() => handleTabChange('merge')}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
              activeTab === 'merge' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Merge PDF
          </button>
          <button
            onClick={() => handleTabChange('split')}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
              activeTab === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4" /> Split PDF
          </button>
          <button
            onClick={() => handleTabChange('compress')}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
              activeTab === 'compress' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Archive className="w-4 h-4" /> Compress PDF
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* TAB 1: MERGE */}
        {activeTab === 'merge' && (
          <div className="space-y-6">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/50 rounded-xl p-10 text-center cursor-pointer transition"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleMergeFiles(e.target.files)}
                accept="application/pdf"
                multiple
                className="hidden"
              />
              <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
              <p className="text-slate-200 font-medium">Click or drag PDFs here to Merge</p>
              <p className="text-xs text-slate-500 mt-1">Select 2 or more PDF files</p>
            </div>

            {mergeFiles.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-semibold text-white">Selected PDFs ({mergeFiles.length})</h3>
                  <button onClick={resetAll} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Clear All
                  </button>
                </div>

                <div className="space-y-2">
                  {mergeFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-sm truncate max-w-xs">{f.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveMergeFile(i, 'up')}
                          disabled={i === 0}
                          className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => moveMergeFile(i, 'down')}
                          disabled={i === mergeFiles.length - 1}
                          className="p-1 hover:bg-slate-800 rounded disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4 text-slate-400" />
                        </button>
                        <button onClick={() => removeMergeFile(i)} className="p-1 hover:bg-slate-800 rounded text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={executeMerge}
                  disabled={isProcessing || mergeFiles.length < 2}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  {isProcessing ? 'Merging PDFs...' : 'Merge & Download PDF'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SPLIT */}
        {activeTab === 'split' && (
          <div className="space-y-6">
            {!splitFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDragDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/50 rounded-xl p-10 text-center cursor-pointer transition"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleSplitFile(e.target.files[0])}
                  accept="application/pdf"
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <p className="text-slate-200 font-medium">Click or drag PDF here to Split</p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <p className="font-medium text-white truncate max-w-xs">{splitFile.name}</p>
                    <p className="text-xs text-slate-400">Total Pages: {splitPageCount}</p>
                  </div>
                  <button onClick={resetAll} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Change File
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">From Page</label>
                    <input
                      type="number"
                      min={1}
                      max={splitPageCount}
                      value={fromPage}
                      onChange={(e) => setFromPage(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">To Page</label>
                    <input
                      type="number"
                      min={fromPage}
                      max={splitPageCount}
                      value={toPage}
                      onChange={(e) => setToPage(Math.min(splitPageCount, parseInt(e.target.value) || fromPage))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={executeSplit}
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  {isProcessing ? 'Processing PDF...' : `Download Pages ${fromPage}–${toPage}`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPRESS */}
        {activeTab === 'compress' && (
          <div className="space-y-6">
            {!compressFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDragDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-900/50 rounded-xl p-10 text-center cursor-pointer transition"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleCompressFile(e.target.files[0])}
                  accept="application/pdf"
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <p className="text-slate-200 font-medium">Click or drag PDF here to Compress</p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <p className="font-medium text-white truncate max-w-xs">{compressFile.name}</p>
                    <p className="text-xs text-slate-400">
                      Original Size: {(originalSize / (1024 * 1024)).toFixed(2)} MB
                      {compressedSize && ` → New Size: ${(compressedSize / (1024 * 1024)).toFixed(2)} MB`}
                    </p>
                  </div>
                  <button onClick={resetAll} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Change File
                  </button>
                </div>

                <button
                  onClick={executeCompress}
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  {isProcessing ? 'Compressing PDF...' : 'Compress & Download PDF'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}