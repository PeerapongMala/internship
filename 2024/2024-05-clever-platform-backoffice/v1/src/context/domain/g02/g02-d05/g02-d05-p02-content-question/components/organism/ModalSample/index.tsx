import IconVolumeLoud from '@core/design-system/library/vristo/source/components/Icon/IconVolumeLoud';
import { Input } from '@core/design-system/library/vristo/source/components/Input';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';

const ModalSample = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (show: boolean) => void;
}) => {
  return (
    <Modal
      title="ตัวอย่างการกรอกโจทย์"
      onClose={() => setOpen(false)}
      open={open}
      className="h-fit w-3/4"
      disableCancel
      disableOk
    >
      <div className="flex flex-col gap-2">
        <div>
          1. การกรอกโจทย์ใช้สัญลักษณ์ของกล่องคำตอบในการสร้างประโยคและจัดตำแหน่งกล่องคำตอบ
        </div>
        <div className="font-bold">สัญลักษณ์สำหรับกล่องคำตอบ:</div>
        <Input
          disabled
          className="!pointer-events-auto w-full cursor-text !bg-inherit"
          value="{Ans1},  {Ans2},  {Ans3},  {AnsN},..."
        />
        <div className="font-bold">ตัวอย่าง:</div>
        <ul className="ml-2 list-inside list-disc space-y-3">
          <li className="mb-1">
            {
              'ต้อการสร้างโจทย์: “The sun rises in the east and sets in the west” และคำว่า “in” เป็นช่องที่ต้องการให้นักเรียนกรอก'
            }
          </li>
          <li className="mb-1">{'การกรอกโจทย์จะมีลักษณะ ดังนี้'}</li>
          <li className="mb-1 ml-4 flex">
            {'The sun rises {Ans1} the east and sets {Ans2} the west.'}
          </li>
        </ul>
        <div className="mt-2">2. สร้างโจทย์เพื่อแยกการอ่านออกเสียงทีละบรรทัด เช่น</div>
        <div className="ml-8 flex justify-between">
          <div className="flex gap-2">
            <IconVolumeLoud className="h-6 w-6" />
            <div className="">{'Ann: Good Morning, {Ans1} do you do?'}</div>
          </div>
          <div className="text-gray-500">โจทย์#1</div>
        </div>
        <div className="ml-8 flex justify-between">
          <div className="flex gap-2">
            <IconVolumeLoud className="h-6 w-6" />
            <div className="">{'Mali: Good Morning, {Ans2} fine, {Ans3} about you?'}</div>
          </div>
          <div className="text-gray-500">โจทย์#2</div>
        </div>
        <div className="mt-2">
          3. ระบบจะตรวจคำตอบโดยไม่สนใจ Case Sensitive และ Double Space
        </div>
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

export default ModalSample;
