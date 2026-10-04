'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { PDFDocument } from 'pdf-lib';
import {
  AlertCircle,
  CheckSquare,
  FileDown,
  FileText,
  Layers,
  RefreshCw,
  Scissors,
  Square,
  Trash2,
  Upload,
} from 'lucide-react';

interface PageItem {
  pageIndex: number;
  pageNumber: number;
  selected: boolean;
}

export default function PdfSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [rangeInput, setRangeInput] = useState('');
  const [splitMode, setSplitMode] = useState<'selected' | 'individual'>('selected');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processPdfFile = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Invalid file type. Please upload a valid PDF file.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const loadedPdf = await PDFDocument.load(await selectedFile.arrayBuffer());
      const pageCount = loadedPdf.getPageCount();
      if (pageCount === 0) {
        throw new Error('The selected PDF does not contain any pages.');
      }

      setFile(selectedFile);
      setPdfDoc(loadedPdf);
      setTotalPages(pageCount);
      setRangeInput('');
      setPages(
        Array.from({ length: pageCount }, (_, pageIndex) => ({
          pageIndex,
          pageNumber: pageIndex + 1,
          selected: true,
        })),
      );
    } catch (error) {
      console.error('PDF load error:', error);
      setErrorMsg('Failed to parse the PDF. It may be encrypted or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      void processPdfFile(selectedFile);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      void processPdfFile(droppedFile);
    }
  };

  const togglePageSelection = (index: number) => {
    setPages((currentPages) =>
      currentPages.map((page, pageIndex) =>
        pageIndex === index ? { ...page, selected: !page.selected } : page,
      ),
    );
  };

  const selectAll = () => setPages((currentPages) => currentPages.map((page) => ({ ...page, selected: true })));
  const deselectAll = () => setPages((currentPages) => currentPages.map((page) => ({ ...page, selected: false })));

  const applyRangeSelection = () => {
    if (!rangeInput.trim() || totalPages === 0) {
      return;
    }

    const selectedIndices = new Set<number>();
    const parts = rangeInput.split(',').map((part) => part.trim());

    for (const part of parts) {
      const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
      if (!match) {
        setErrorMsg(`Invalid page range: "${part}". Use values like 1-3, 5, 8-10.`);
        return;
      }

      const start = Number(match[1]);
      const end = Number(match[2] ?? match[1]);
      if (start < 1 || end < 1 || start > totalPages || end > totalPages) {
        setErrorMsg(`Page numbers must be between 1 and ${totalPages}.`);
        return;
      }

      for (let pageNumber = Math.min(start, end); pageNumber <= Math.max(start, end); pageNumber++) {
        selectedIndices.add(pageNumber - 1);
      }
    }

    setErrorMsg(null);
    setPages((currentPages) =>
      currentPages.map((page) => ({ ...page, selected: selectedIndices.has(page.pageIndex) })),
    );
  };

  const resetState = () => {
    setFile(null);
    setPdfDoc(null);
    setPages([]);
    setTotalPages(0);
    setRangeInput('');
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadBlob = (bytes: Uint8Array, filename: string) => {
    const blobBytes = new Uint8Array(bytes).slice().buffer as ArrayBuffer;
    const blob = new Blob([blobBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleSplitPdf = async () => {
    if (!pdfDoc || !file) {
      return;
    }

    const selectedPages = pages.filter((page) => page.selected);
    if (selectedPages.length === 0) {
      setErrorMsg('Please select at least one page to extract.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const baseFileName = file.name.replace(/\.[^/.]+$/, '');

      if (splitMode === 'selected') {
        const extractedPdf = await PDFDocument.create();
        const copiedPages = await extractedPdf.copyPages(
          pdfDoc,
          selectedPages.map((page) => page.pageIndex),
        );
        copiedPages.forEach((page) => extractedPdf.addPage(page));
        downloadBlob(await extractedPdf.save(), `${baseFileName}_extracted.pdf`);
      } else {
        for (const page of selectedPages) {
          const singlePagePdf = await PDFDocument.create();
          const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [page.pageIndex]);
          singlePagePdf.addPage(copiedPage);
          downloadBlob(await singlePagePdf.save(), `${baseFileName}_page_${page.pageNumber}.pdf`);
        }
      }
    } catch (error) {
      console.error('PDF split error:', error);
      setErrorMsg('An error occurred while splitting the PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedCount = pages.filter((page) => page.selected).length;

  return (
    <div className="min-h-screen bg-slate-950 p-4 font-sans text-slate-100 selection:bg-cyan-500 selection:text-black sm:p-8">
      <div className="mx-auto mb-8 max-w-6xl text-center sm:text-left">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyan-400">
          <Scissors className="h-3.5 w-3.5" />
          Client-Side Operations
        </div>
        <h1 className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
          PDF Splitter &amp; Page Extractor
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
          Extract or isolate pages locally in your browser. Fast, private, and no server upload required.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 sm:p-16 ${
                dragActive
                  ? 'scale-[1.01] border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-cyan-400 shadow-inner">
                <Upload className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-semibold text-slate-200">
                Drop your PDF file here, or <span className="text-cyan-400 underline decoration-cyan-500/40">browse</span>
              </h2>
              <p className="mt-2 text-xs text-slate-500">Supports standard PDF files up to browser memory limits.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/60 p-3 text-cyan-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="max-w-xs truncate text-sm font-semibold text-slate-200 sm:max-w-md">{file.name}</h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Total Pages: <span className="font-mono font-bold text-cyan-400">{totalPages}</span>
                      {' | '}Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetState}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 font-mono text-xs text-slate-400 transition-all hover:border-rose-800/50 hover:bg-rose-950/30 hover:text-rose-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear File
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700"
                  >
                    <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={deselectAll}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700"
                  >
                    <Square className="h-3.5 w-3.5 text-slate-400" />
                    Clear Selection
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-400">
                  Selected: <span className="font-bold text-cyan-400">{selectedCount}</span> / {totalPages}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 1-3, 5, 8-10"
                  value={rangeInput}
                  onChange={(event) => setRangeInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      applyRangeSelection();
                    }
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
                  aria-label="Page numbers or ranges to select"
                />
                <button
                  type="button"
                  onClick={applyRangeSelection}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-mono text-xs font-medium text-cyan-400 transition hover:bg-slate-700"
                >
                  Select Range
                </button>
              </div>

              <div className="mt-6 grid max-h-[420px] grid-cols-2 gap-3 overflow-y-auto rounded-xl border border-slate-900 bg-slate-950/60 p-2 sm:grid-cols-4 md:grid-cols-5">
                {pages.map((page, index) => (
                  <button
                    key={page.pageNumber}
                    type="button"
                    onClick={() => togglePageSelection(index)}
                    aria-pressed={page.selected}
                    className={`relative flex cursor-pointer select-none flex-col items-center justify-center rounded-xl border p-4 transition-all duration-200 ${
                      page.selected
                        ? 'border-cyan-500/80 bg-cyan-950/30 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'border-slate-800/80 bg-slate-900/40 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                    }`}
                  >
                    <span className="absolute left-2 top-2">
                      {page.selected ? (
                        <CheckSquare className="h-4 w-4 text-cyan-400" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-600" />
                      )}
                    </span>
                    <FileText className={`mb-2 h-8 w-8 ${page.selected ? 'text-cyan-400' : 'text-slate-600'}`} />
                    <span className="font-mono text-xs font-bold">Page {page.pageNumber}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="sticky top-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-200">
              <Layers className="h-5 w-5 text-cyan-400" />
              Extraction Options
            </h2>

            <div className="mb-6 space-y-3">
              <p className="mb-2 block font-mono text-xs uppercase tracking-wider text-slate-400">Output Format</p>
              <button
                type="button"
                onClick={() => setSplitMode('selected')}
                aria-pressed={splitMode === 'selected'}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                  splitMode === 'selected'
                    ? 'border-cyan-500 bg-cyan-950/30 text-slate-200'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${splitMode === 'selected' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`}>
                  {splitMode === 'selected' && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                </span>
                <span>
                  <span className="block text-xs font-bold text-slate-200">Merge into One PDF</span>
                  <span className="mt-0.5 block text-[11px] text-slate-400">Combine selected pages into one extracted document.</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode('individual')}
                aria-pressed={splitMode === 'individual'}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                  splitMode === 'individual'
                    ? 'border-cyan-500 bg-cyan-950/30 text-slate-200'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${splitMode === 'individual' ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`}>
                  {splitMode === 'individual' && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                </span>
                <span>
                  <span className="block text-xs font-bold text-slate-200">Separate Files</span>
                  <span className="mt-0.5 block text-[11px] text-slate-400">Save each selected page as an individual PDF.</span>
                </span>
              </button>
            </div>

            {errorMsg && (
              <div role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleSplitPdf()}
              disabled={!file || selectedCount === 0 || isProcessing}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-wider shadow-lg transition-all ${
                !file || selectedCount === 0 || isProcessing
                  ? 'cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-500'
                  : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:from-cyan-400 hover:to-teal-400 active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing PDF...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  {splitMode === 'selected' ? 'Extract Selected Pages' : `Export ${selectedCount} Files`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
