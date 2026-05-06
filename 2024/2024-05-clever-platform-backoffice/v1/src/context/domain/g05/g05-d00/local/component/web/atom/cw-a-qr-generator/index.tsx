import { HTMLAttributes } from 'react';
import QRCode, { QRCodeProps } from 'react-qr-code';

type QrCodeGeneratorProps = HTMLAttributes<SVGSVGElement> & {
  value: string;
};

const QrCodeGenerator = ({ value, ...props }: QrCodeGeneratorProps) => {
  return <QRCode {...props} value={value} />;
};

export default QrCodeGenerator;
