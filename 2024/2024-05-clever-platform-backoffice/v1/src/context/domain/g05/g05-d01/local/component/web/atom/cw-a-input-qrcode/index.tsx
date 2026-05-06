import { scanQRCodeImage } from '@core/design-system/library/vristo/source/utils/qrcode';
import { mergeRefs } from '@mantine/hooks';
import { useRef } from 'react';
import Swal from 'sweetalert2';

type InputQrCodeProps = {
  inputRef?: React.RefObject<HTMLInputElement>;
  onQrCodeResult?: (data: string) => void;
};

const InputQrCode = ({
  onQrCodeResult,
  inputRef: externalInputRef,
}: InputQrCodeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const data = await scanQRCodeImage(file, (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Image is not QR Code',
        text: 'Please click create family and upload new one',
        timer: 5000,
      });

      if (inputRef?.current) {
        inputRef.current.value = '';
      }
    });

    if (inputRef?.current) {
      inputRef.current.value = '';
    }
    onQrCodeResult?.(data);
  };

  return (
    <input
      className="hidden"
      type="file"
      ref={mergeRefs(inputRef, externalInputRef ?? null)}
      onChange={handleFileChange}
    />
  );
};

export default InputQrCode;
