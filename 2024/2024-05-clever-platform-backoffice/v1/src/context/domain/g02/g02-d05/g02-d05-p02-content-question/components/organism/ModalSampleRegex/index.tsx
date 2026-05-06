import { Modal } from '@core/design-system/library/vristo/source/components/Modal';

const ModalSampleRegex = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (show: boolean) => void;
}) => {
  return (
    <Modal
      title="ตัวอย่างการใช้ Regular expression"
      onClose={() => setOpen(false)}
      open={open}
      className="h-fit w-3/4"
      disableOk
      disableCancel
    >
      <div>
        Lorem ipsum dolor sit amet consectetur. Et urna tellus odio magna sit. Eget non
        aenean adipiscing mi. Odio id pellentesque lectus blandit laoreet hendrerit.
      </div>
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          className="btn btn-outline-primary w-32 ltr:mr-4 rtl:ml-4"
          onClick={() => setOpen(false)}
        >
          ย้อนกลับ
        </button>
        <button type="button" className="btn btn-primary w-32 ltr:ml-4 rtl:mr-4">
          ตกลง
        </button>
      </div>
    </Modal>
  );
};

export default ModalSampleRegex;
