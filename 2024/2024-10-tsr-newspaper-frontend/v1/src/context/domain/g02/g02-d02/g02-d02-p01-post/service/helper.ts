export function imageToFile(canvas: HTMLCanvasElement, fileName: string): Promise<File> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], fileName, { type: blob.type });
        resolve(file);
      }
    }, 'image/png');
  });
}
