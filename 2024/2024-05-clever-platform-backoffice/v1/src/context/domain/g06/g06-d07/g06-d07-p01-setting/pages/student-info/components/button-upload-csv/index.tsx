import IconUpload from '@component/web/atom/wc-a-icons/IconUpload';
import CWButton from '@component/web/cw-button';
import ModalUploadStudents from '../modal-upload-students';
import useModal from '@global/utils/useModal';

type ButtonUploadCSVProps = {
  className?: string;
  onUploadSuccess?: () => void;
};

const ButtonUploadCSV = ({ className, onUploadSuccess }: ButtonUploadCSVProps) => {
  const modal = useModal();

  return (
    <div>
      <CWButton
        className={className}
        title={'Upload'}
        icon={<IconUpload width={20} height={20} />}
        onClick={modal.open}
      />

      <ModalUploadStudents
        isOpen={modal.isOpen}
        onClose={modal.close}
        onUploadSuccess={onUploadSuccess}
      />
    </div>
  );
};

export default ButtonUploadCSV;
