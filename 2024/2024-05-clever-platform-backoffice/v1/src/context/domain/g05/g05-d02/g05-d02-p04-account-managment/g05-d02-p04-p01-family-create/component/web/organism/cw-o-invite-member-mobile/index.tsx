import QrCodeScanner from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/atom/cw-a-qr-scanner';
import { useNavigate } from '@tanstack/react-router';

const InviteMemberMobile = () => {
  const navigate = useNavigate();

  const handleAddFamilyMember = (memberCode: string) => {
    navigate({ to: '/line/parent/management' });
  };

  const handleScanQrCode = (data: string) => {
    handleAddFamilyMember(data);
  };

  return <QrCodeScanner onResult={handleScanQrCode} />;
};

export default InviteMemberMobile;
