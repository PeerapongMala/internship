import QrCodeScanner from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/atom/cw-a-qr-scanner';
import { useNavigate } from '@tanstack/react-router';

const FamilyScanQRCode = () => {
  const navigate = useNavigate();
  return (
    <div>
      <QrCodeScanner
        onResult={() => navigate({ to: '/line/parent/family/management' })}
      />
    </div>
  );
};

export default FamilyScanQRCode;
