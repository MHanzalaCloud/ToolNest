import { NextRequest, NextResponse } from "next/server";
import { mergePDFBuffers } from "@/lib/pdf-tools";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length < 2) {
      return NextResponse.json({ error: "Minimum two files required." }, { status: 400 });
    }

    const buffers: ArrayBuffer[] = [];
    for (const file of files) {
      buffers.push(await file.arrayBuffer());
    }

    const resultUint8 = await mergePDFBuffers(buffers);
    const resultBuffer = new ArrayBuffer(resultUint8.byteLength);
    new Uint8Array(resultBuffer).set(resultUint8);

    return new NextResponse(resultBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged-ToolNest.pdf"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
