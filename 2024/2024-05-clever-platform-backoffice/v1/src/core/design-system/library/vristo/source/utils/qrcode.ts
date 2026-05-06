import QrScanner from 'qr-scanner';

export async function scanQRCodeImage(
  imageOrFileOrBlobOrUrl:
    | HTMLImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | OffscreenCanvas
    | ImageBitmap
    | SVGImageElement
    | File
    | Blob
    | URL
    | String,
  onNoQRCode?: (error: unknown) => void,
  onError?: (error: unknown) => void,
): Promise<string> {
  try {
    const result = await QrScanner.scanImage(imageOrFileOrBlobOrUrl, {
      returnDetailedScanResult: true,
    });

    if (result.data) return result.data;

    throw 'No QR Code found';
  } catch (error) {
    if (typeof error === 'string') {
      onNoQRCode?.(error);
    }

    onError?.(error);
    throw error;
  }
}
