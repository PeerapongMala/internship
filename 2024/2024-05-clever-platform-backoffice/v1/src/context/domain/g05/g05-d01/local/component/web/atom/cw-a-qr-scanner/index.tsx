import { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TQrScannerOptions } from '@domain/g05/g05-d02/local/types/qr-scanner';

type QrCodeScannerProps = {
  className?: string;
  onResult?: (data: string, scanner: QrScanner) => void;
  onError?: (err: any) => void;
  cameraOptions?: TQrScannerOptions;
};

const QrCodeScanner = ({
  className,
  onResult,
  onError,
  cameraOptions,
}: QrCodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

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
      { ...options },
    );

    qrScanner.start().catch((err) => {
      onError?.(err);
    });

    return () => {
      qrScanner.stop();
    };
  }, []);

  return (
    <div className={cn('qr-container item-center flex justify-center', className)}>
      <video ref={videoRef} className="qr-video" />
    </div>
  );
};

export default QrCodeScanner;
