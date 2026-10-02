export async function processImageCanvas(
  file: File,
  options: { width?: number; height?: number; quality?: number; format?: string }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const targetWidth = options.width || img.width;
      const targetHeight = options.height || img.height;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (ctx) {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const format = options.format || file.type;
        const quality = options.quality || 0.9;

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas blob conversion failed"));
          },
          format,
          quality
        );
      } else {
        reject(new Error("Canvas context unavailable"));
      }
    };
    img.onerror = (err) => reject(err);
  });
}
