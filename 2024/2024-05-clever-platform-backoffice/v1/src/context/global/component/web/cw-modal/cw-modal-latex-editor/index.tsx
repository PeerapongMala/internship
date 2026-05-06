import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import CWMLatexEditor from '@component/web/molecule/cw-m-latex-editor';

interface CWModalLatexEditor extends ModalProps {
  open: boolean;
  onClose: () => void;
  value?: string;
  setValue?: (value: string) => void;
}

const CWModalLatexEditor = ({
  open,
  onClose,
  children,
  onOk,
  value,
  setValue,
  ...rest
}: CWModalLatexEditor) => {
  return (
    <Modal
      className="w-[40rem]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="กรอกคำตอบ"
      {...rest}
    >
      <CWMLatexEditor
        value={value}
        setValue={(value) => {
          setValue?.(value);
          onClose?.();
        }}
        onClose={onClose}
      />
    </Modal>
  );
};

export default CWModalLatexEditor;
