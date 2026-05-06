import CWModalCustom, { ModalPopupProps } from '../cw-modal-custom';

type CWModalUploadSuccessProps = Omit<ModalPopupProps, 'title'> & {
  title?: string;
};

// million-ignore
const CWModalUploadSuccess = ({
  title = 'อัปโหลดไฟล์สำเร็จ',
  ...props
}: CWModalUploadSuccessProps) => {
  return (
    <CWModalCustom title={title} buttonName="ตกลง" {...props}>
      ไฟล์ของคุณถูกอัปโหลดสำเร็จแล้ว
    </CWModalCustom>
  );
};

export default CWModalUploadSuccess;
