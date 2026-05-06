// blobHelper.ts หรือ fileHelper.ts

/**
 * Convert Blob to text
 * @param blob - The Blob object to convert
 * @returns Promise that resolves with the text content
 */
export const blobToText = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
};
