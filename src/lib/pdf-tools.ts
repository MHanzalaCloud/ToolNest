import { PDFDocument } from "pdf-lib";

export async function mergePDFBuffers(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  
  for (const buffer of buffers) {
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
}

export async function splitPDFBuffer(buffer: ArrayBuffer, pageIndices: number[]): Promise<Uint8Array[]> {
  const srcPdf = await PDFDocument.load(buffer);
  const results: Uint8Array[] = [];

  for (const idx of pageIndices) {
    if (idx >= 0 && idx < srcPdf.getPageCount()) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(srcPdf, [idx]);
      newPdf.addPage(page);
      results.push(await newPdf.save());
    }
  }

  return results;
}
