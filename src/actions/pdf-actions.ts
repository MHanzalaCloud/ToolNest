'use server';

import { mergePDFBuffers } from "@/lib/pdf-tools";

export async function processPdfMergeAction(formData: FormData) {
  try {
    const files = formData.getAll("files") as File[];
    if (!files || files.length < 2) {
      return { success: false, error: "At least 2 PDF files are required to merge." };
    }

    const buffers: ArrayBuffer[] = [];
    for (const file of files) {
      buffers.push(await file.arrayBuffer());
    }

    const mergedUint8 = await mergePDFBuffers(buffers);
    const base64 = Buffer.from(mergedUint8).toString("base64");

    return {
      success: true,
      data: `data:application/pdf;base64,${base64}`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Server failed to process PDFs." };
  }
}
