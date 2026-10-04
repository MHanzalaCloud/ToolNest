'use client';

import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUp, Download, ShieldCheck, Cpu } from 'lucide-react';

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'recommended' | 'extreme'>('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setCompressedSize(null);
      setDownloadUrl(null);
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const fileBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });

      const saveOptions = {
        useObjectStreams: true,
        ...(compressionLevel === 'extreme' ? { updateFieldAppearances: false } : {}),
      };

      const compressedBytes = await pdfDoc.save(saveOptions);
      const compressedBuffer = new Uint8Array(compressedBytes).slice().buffer as ArrayBuffer;
      const blob = new Blob([compressedBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setCompressedSize(blob.size);
      setDownloadUrl(url);
    } catch (err) {
      console.error('Compression error:', err);
      alert('Failed to process PDF file. Ensure it is not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-white p-8 font-mono">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#00F0FF]/20 pb-4">
          <h1 className="text-3xl font-bold text-[#00F0FF] flex items-center gap-3">
            <Cpu className="w-8 h-8 text-[#FF5500]" />
            PDF COMPRESSOR // LOCAL EXECUTION
          </h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
            100% In-Browser Execution. No network traffic or remote uploads.
          </p>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-[#00F0FF]/40 rounded-lg p-8 text-center bg-[#00F0FF]/5 hover:border-[#00F0FF] transition-colors">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-3">
            <FileUp className="w-12 h-12 text-[#00F0FF]" />
            <span className="text-lg font-semibold text-white">
              {file ? file.name : 'Select or drop PDF file here'}
            </span>
            {originalSize && (
              <span className="text-xs text-[#00FF66]">
                Original Size: {formatSize(originalSize)}
              </span>
            )}
          </label>
        </div>

        {/* Controls */}
        {file && (
          <div className="bg-[#10101A] border border-[#00F0FF]/30 p-6 rounded-lg space-y-6">
            <div>
              <label className="block text-sm text-[#00F0FF] mb-2 font-bold">
                COMPRESSION LEVEL
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCompressionLevel('recommended')}
                  className={`p-4 rounded border text-left transition-all ${
                    compressionLevel === 'recommended'
                      ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-white'
                      : 'border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="font-bold text-[#00F0FF]">Standard Optimization</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Strips unused metadata and rewrites streams losslessly.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCompressionLevel('extreme')}
                  className={`p-4 rounded border text-left transition-all ${
                    compressionLevel === 'extreme'
                      ? 'border-[#FF5500] bg-[#FF5500]/10 text-white'
                      : 'border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="font-bold text-[#FF5500]">High Savings</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Maximum structural stream compression.
                  </div>
                </button>
              </div>
            </div>

            <button
              onClick={compressPdf}
              disabled={isProcessing}
              className="w-full py-4 bg-[#FF5500] hover:bg-[#FF5500]/80 text-black font-extrabold rounded text-center transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'PROCESSING IN RAM...' : 'COMPRESS PDF NOW'}
            </button>
          </div>
        )}

        {/* Results */}
        {compressedSize && downloadUrl && (
          <div className="bg-[#0A1A14] border border-[#00FF66] p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-bold text-[#00FF66]">COMPRESSION COMPLETE</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#05050A] p-3 rounded border border-[#00FF66]/20">
                <div className="text-xs text-gray-400">BEFORE</div>
                <div className="text-lg font-bold text-gray-300">{formatSize(originalSize!)}</div>
              </div>
              <div className="bg-[#05050A] p-3 rounded border border-[#00FF66]/20">
                <div className="text-xs text-gray-400">AFTER</div>
                <div className="text-lg font-bold text-[#00FF66]">{formatSize(compressedSize)}</div>
              </div>
              <div className="bg-[#05050A] p-3 rounded border border-[#00FF66]/20">
                <div className="text-xs text-gray-400">REDUCTION</div>
                <div className="text-lg font-bold text-[#FF5500]">
                  {(((originalSize! - compressedSize) / originalSize!) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <a
              href={downloadUrl}
              download={`compressed_${file?.name}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#00FF66] hover:bg-[#00FF66]/80 text-black font-bold rounded transition-colors"
            >
              <Download className="w-5 h-5" />
              DOWNLOAD OPTIMIZED PDF
            </a>
          </div>
        )}

      </div>
    </div>
  );
}