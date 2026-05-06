import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TQrScannerOptions } from '@domain/g05/g05-d02/local/types/qr-scanner';

type QrCodeScannerProps = {
  className?: string;
  onResult?: (data: string, scanner: QrScanner) => void;
  onError?: (err: any) => void;
  cameraOptions?: TQrScannerOptions;
  currentCameraID?: string;
};

const QrCodeScanner = ({
  className,
  onResult,
  onError,
  cameraOptions,
  currentCameraID,
}: QrCodeScannerProps) => {
  const [scannerInstance, setScannerInstance] = useState<QrScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const createScanner = (cameraId?: string): QrScanner | null => {
    if (!videoRef.current) return null;

    const options: TQrScannerOptions = {
      returnDetailedScanResult: true,
      maxScansPerSecond: 8,
      ...cameraOptions,
    };

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        onResult?.(result.data, qrScanner);
      },
      options,
    );

    // Set the desired camera if provided
    if (cameraId) {
      qrScanner.setCamera(cameraId);
    }

    // Start the scanner
    qrScanner.start().catch((err) => {
      onError?.(err);
    });

    return qrScanner;
  };

  useEffect(() => {
    if (!videoRef.current) return;

    // Clean up the old scanner if one exists
    if (scannerInstance) {
      scannerInstance.stop();
      scannerInstance.destroy();
    }

    const newScanner = createScanner(currentCameraID);
    setScannerInstance(newScanner);

    return () => {
      if (newScanner) {
        newScanner.stop();
        newScanner.destroy();
      }
    };
  }, [currentCameraID, cameraOptions]);

  return (
    <div className={cn('qr-container item-center flex justify-center', className)}>
      <video ref={videoRef} className="qr-video" />
    </div>
  );
};

export default QrCodeScanner;
