import { Divider } from '@core/design-system/library/vristo/source/components/Divider';
import { convertIdToThreeDigit, convertTime, getStatus } from '../../../util';
import ModalConfirmPublic from '../../molecule/ModalConfirmPublic';
import { useState } from 'react';

const BaseInformation = ({
  academicLevel,
  onOkPublic,
}: {
  academicLevel?: any;
  onOkPublic?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ModalConfirmPublic
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOk={() => {
          setIsOpen(false);
          onOkPublic?.();
        }}
      >
        <div className="flex flex-col gap-4">
          {/* <div>คุณต้องการเปลี่ยนสถานะเป็นเผยแพร่ใช่หรือไม่</div> */}
          <div className="flex gap-4">
            <div>รหัสด่าน:</div>
            <div className="font-bold">{convertIdToThreeDigit(academicLevel?.id)}</div>
          </div>
        </div>
      </ModalConfirmPublic>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">ข้อมูลด่าน</h1>
        <button
          className="btn btn-danger w-32 font-bold"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          เผยแพร่
        </button>
      </div>
      <Divider />
      <div className="grid grid-cols-[20%_80%] gap-2">
        <div>รหัสด่าน:</div>
        <div>{convertIdToThreeDigit(academicLevel?.id)}</div>

        <div>สถานะ:</div>
        <div>{getStatus(academicLevel?.status)}</div>

        <div>วิชา:</div>
        <div>{academicLevel?.subject_name}</div>

        <div>ชั้นปี:</div>
        <div>{academicLevel?.year_name}</div>

        <div>บทเรียน:</div>
        <div>{academicLevel?.lesson_name}</div>

        <div>บทเรียนย่อย:</div>
        <div>{academicLevel?.sub_lesson_name}</div>

        <div>แก้ไขล่าสุด:</div>
        <div>{convertTime(academicLevel?.updated_at)}</div>

        <div>แก้ไขล่าสุดโดย:</div>
        <div>{academicLevel?.updated_by}</div>
      </div>
    </>
  );
};

export default BaseInformation;
