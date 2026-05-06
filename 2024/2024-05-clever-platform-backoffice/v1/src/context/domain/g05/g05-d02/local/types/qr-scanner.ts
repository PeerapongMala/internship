import QrScanner from 'qr-scanner';

// type for QRScanner options. Because qr-scanner does not create type for this(for now)
export type TQrScannerOptions = {
  onDecodeError?: (error: Error | string) => void;
  calculateScanRegion?: (video: HTMLVideoElement) => QrScanner.ScanRegion;
  maxScansPerSecond?: number;
  highlightScanRegion?: boolean;
  highlightCodeOutline?: boolean;
  overlay?: HTMLDivElement;
  /** just a temporary flag until we switch entirely to the new api */
  returnDetailedScanResult?: true;
};
