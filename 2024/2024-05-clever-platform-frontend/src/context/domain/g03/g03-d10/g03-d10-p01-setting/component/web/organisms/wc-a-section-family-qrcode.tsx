import { Icon } from '@component/web/atom/wc-a-icon';
import { Avatar } from '@component/web/molecule/wc-m-avatar';
import { UserData } from '@domain/g02/g02-d01/local/type';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import ImageIconChange from '../../../assets/icon-change.svg';
import ImageLineLogo from '../../../assets/line-logo.svg';
import ConfigJson from '../../../config/index.json';
import { IconSmall } from '../atoms/wc-a-icon';
import { TextHeader, TextNormal } from '../atoms/wc-a-text';

interface SectionFamilyQRCodeProps {
  account?: UserData;
}

function SectionFamilyQRCode({ account }: SectionFamilyQRCodeProps) {
  const { t } = useTranslation([ConfigJson.key]);
  const [familyQRCodeValue, setFamilyQRCodeValue] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);

  const qrCodeLiveTime = 60 * 1000; // 1 minute

  const generateQRCode = useCallback(() => {
    const newExpiredAtDate = new Date(Date.now() + qrCodeLiveTime);
    setExpiryTime(newExpiredAtDate);
    setTimeLeft(qrCodeLiveTime);

    const newExpiredAtIsoString = newExpiredAtDate.toISOString();
    const newFamilyQRCodeValue = `${import.meta.env.VITE_CLMS_BASE_URL}/line/parent/family/add/member?user_id=${account?.id}&expired_at=${newExpiredAtIsoString}`;
    setFamilyQRCodeValue(newFamilyQRCodeValue);
  }, [account?.id, qrCodeLiveTime]);

  // Handle countdown timer
  useEffect(() => {
    if (!expiryTime) return;

    const initialDifference = expiryTime.getTime() - new Date().getTime();
    setTimeLeft(initialDifference > 0 ? initialDifference : 0);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = expiryTime.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        generateQRCode();
      } else {
        setTimeLeft(difference);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime, generateQRCode]);

  // Initial QR code generation
  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  // Format time as MM:SS
  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="flex justify-between p-6 gap-4 bg-white bg-opacity-80 w-full">
        <div className="flex gap-2">
          <Avatar
            user={account}
            className="w-[48px] h-[48px] border-1 border-white border-solid"
          />
          <div className="flex flex-col">
            <TextHeader>{t('student_uuid', { id: account?.id ?? '-' })}</TextHeader>
            <span className="text-xl">
              {t('family_id', { id: account?.family_id ?? '-' })}{' '}
              {account?.family_owner &&
                `(${t('family_owner', { name: account?.family_owner })})`}
            </span>
          </div>
        </div>
      </div>
      <div className="grow flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col items-center gap-2 mt-5">
          <div className="bg-white rounded-xl p-6 relative">
            <QRCode size={192} value={familyQRCodeValue} />
          </div>

          <div
            className="flex justify-center items-center w-28 gap-3 bg-white border-2 border-neutral-200 rounded-xl px-3 hover:cursor-pointer hover:border-neutral-400"
            onClick={generateQRCode}
          >
            <div
              className="w-full rotate-90"
            >
              <Icon src={ImageIconChange} />
            </div>
            <div className="font-extrabold">
              {formatTime(timeLeft)}
            </div>
          </div>

        </div>
        <div className="flex gap-2">
          <IconSmall src={ImageLineLogo} />
          <TextNormal>{t('family_line_description')}</TextNormal>
        </div>
      </div>
    </>
  );
}

export default SectionFamilyQRCode;