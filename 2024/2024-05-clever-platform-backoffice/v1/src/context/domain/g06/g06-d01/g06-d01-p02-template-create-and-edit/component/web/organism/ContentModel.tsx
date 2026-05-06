import CWInput from '@component/web/cw-input';
import Modal, { ModalProps } from '@component/web/cw-modal/Modal';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import ExampleTable from '@domain/g06/g06-d01/local/component/web/organism/ExampleTable';

interface ContentModalProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  contents?: contents[];
}

const ContentModal = ({
  open,
  onClose,
  children,
  onOk,
  contents,
  ...rest
}: ContentModalProps) => {
  return (
    <Modal
      className="h-auto w-[1000px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={'สาระการเรียนรู้'}
      {...rest}
    >
      <div className="w-full">
        <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
          <li>
            <details className="group/sub px-4">
              <summary className="flex items-center gap-3 px-4 py-4 font-medium marker:content-none hover:cursor-pointer">
                <IconArrowDown className="transition group-open/sub:rotate-180" />
                <span className="text-[18px] font-bold">ตัวอย่างสาระการเรียนรู้</span>
              </summary>

              <article className="border-t-2 px-4 py-4">
                <ExampleTable />
              </article>
            </details>
          </li>
        </ul>
        <div className="flex w-full items-center gap-2">
          <div className="w-1/2 flex-1">
            <h1>
              <span className="text-danger">*</span>สาระการเรียนรู้ที่
            </h1>
            <CWInput
              // value={}
              placeholder={'ชื่อสาระการเรียนรู้(ดึงข้อมูลมาจาก content creator'}
              required={true}
              disabled={true}
            />
          </div>
          <div className="flex-2 w-1/2">
            <h1>
              <span className="text-danger">*</span>Weight:
            </h1>
            <CWInput
              // value={content.weight}
              placeholder={'30'}
              required={true}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface contents {
  content_name: string;
  weight: number;
}
export default ContentModal;
