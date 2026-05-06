import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import QrCodeGenerator from '../../atom/cw-a-qr-generator';
import CountdownTimer from '../../atom/cw-a-countdown-timer';

const MyQrCode = () => {
  const [qrData, setQrData] = useState('');
  const [expiredAt, setExpiredAt] = useState<Date | null>(null);

  const handleNewQrCode = () => {
    setQrData(Math.random().toString());

    setExpiredAt(dayjs().add(1, 'minutes').toDate());
  };

  useEffect(() => {
    if (expiredAt !== null) return;

    handleNewQrCode();
  }, [qrData, expiredAt]);

  const onExpired = () => {
    setExpiredAt(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <QrCodeGenerator className="h-56 w-56" value={qrData} />

      {expiredAt ? (
        <CountdownTimer expiresAt={expiredAt} onExpired={onExpired} />
      ) : (
        <span>QR Code Expired</span>
      )}

      <button onClick={handleNewQrCode}>reset</button>
    </div>
  );
};

export default MyQrCode;
