import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import QrCodeGenerator from '../../atom/cw-a-qr-generator';
import CountdownTimer from '../../atom/cw-a-countdown-timer';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';

type MyQrCodeProps = {};

const MyQrCode = ({}: MyQrCodeProps) => {
  const { userData }: { userData: IUserData } = StoreGlobalPersist.StateGet(['userData']);

  const [qrData, setQrData] = useState('');
  const [expiredAt, setExpiredAt] = useState<Date | null>(null);

  const handleNewQrCode = () => {
    const hostname = window.location.origin;
    const expiredAt = dayjs().add(1, 'minutes').toDate();

    setQrData(
      `${hostname}/line/parent/family/add/member?expired_at=${expiredAt.toISOString()}&user_id=${userData.id}`,
    );

    setExpiredAt(expiredAt);
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
