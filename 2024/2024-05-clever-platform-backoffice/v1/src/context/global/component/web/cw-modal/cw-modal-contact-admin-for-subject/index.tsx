import { useNavigate } from '@tanstack/react-router';
import CWModalCustom from '../cw-modal-custom';

const ModalContactAdminForSubject = () => {
  const navigate = useNavigate();

  return (
    <CWModalCustom
      open
      title="กรุณาติดต่อแอดมิน"
      onClose={() => navigate({ to: '/bug-report' })}
    >
      <div>
        <p>คุณครูยังไม่ได้ประจำวิชาใดๆ</p>
        <p>กรุณาติดต่อแอดมินเพื่อเพิ่มครูไปยังวิชาที่ได้รับมอบหมาย</p>
      </div>
    </CWModalCustom>
  );
};

export default ModalContactAdminForSubject;
