import { toDateTimeTH } from '@global/utils/date';
import CWSelectValue from '@component/web/cw-selectValue';
import { BugReportStatus } from '@domain/g04/g04-d06/local/type';
import {
  IBugReportDetailProps,
  IBugReportLogProps,
} from '@domain/g04/g04-d05/local/type';
import { useEffect, useState } from 'react';
import showMessage from '@global/utils/showMessage';
import CWModalEdit from '@component/web/cw-modal/cw-modal-edit';

interface SidePanelProps {
  isOpenModal?: boolean;
  id?: string;
  updatedAt?: string;
  updateBy?: string;
  handleOpenModalResetPassword?: () => void;
  handleCloseModalResetPassword?: () => void;
  handleClickSubmitResetPassword?: (value: string) => void;
  handleClickSubmit?: () => void;
  isEnabled?: string;
}

const SidePanel = ({
  isOpenModal = false,
  id,
  updatedAt,
  updateBy,
  handleOpenModalResetPassword,
  handleCloseModalResetPassword,
  handleClickSubmitResetPassword,
  handleClickSubmit,
  isEnabled,
}: SidePanelProps) => {
  return (
    <div className="h-fit w-full xl:w-[30%]">
      <CWModalEdit
        title="กำหนดรหัสผ่าน"
        label="รหัสผ่าน"
        placeholder="กรุณากรอกรหัสผ่านใหม่"
        okButtonText="ตกลง"
        open={isOpenModal}
        onClose={() => {
          if (handleCloseModalResetPassword) {
            handleCloseModalResetPassword();
          }
        }}
        onSave={(value) => {
          if (handleClickSubmitResetPassword) {
            handleClickSubmitResetPassword(value);
          }
        }}
      />

      <div className="flex h-fit w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
        <div className="flex items-center">
          <p className="block w-[50%] text-sm text-[#0E1726]">รหัสผู้ใช้งาน</p>
          <p className="w-full">{id || '-'}</p>
        </div>

        <div className="flex items-center">
          <p className="block w-[50%] text-sm text-[#0E1726]">สถานะ</p>
          <p className="w-full">
            {isEnabled === 'enabled' ? 'ใช้งาน' : isEnabled || '-'}
          </p>

          {/* <CWSelectValue
            options={[]}
            // value={}
            onChange={(value: string) => {}}
            required={true}
            title={'สถานะ'}
            className="col-span-2 w-full"
          /> */}
        </div>

        <div className="flex items-center">
          <p className="block w-[50%] text-sm text-[#0E1726]">แก้ไขล่าสุด</p>
          <p className="w-full">{updatedAt ? toDateTimeTH(updatedAt) : '-'}</p>
        </div>

        <div className="flex items-center">
          <p className="block w-[50%] text-sm text-[#0E1726]">แก้ไขล่าสุดโดย</p>
          <p className="w-full">{updateBy || '-'}</p>
        </div>

        {/* ปุ่มอยู่ใน div เดียวกัน */}
        <div className="flex w-full flex-col gap-3">
          <button
            className="w-full rounded-md bg-primary py-2 font-bold text-white shadow-2xl"
            onClick={(e) => {
              e?.preventDefault();
              if (handleClickSubmit) {
                handleClickSubmit();
              }
            }}
          >
            บันทึก
          </button>
          <button
            className="w-full rounded-md bg-primary py-2 font-bold text-white shadow-2xl"
            onClick={(e) => {
              e?.preventDefault();
              if (handleOpenModalResetPassword) {
                handleOpenModalResetPassword();
              }
            }}
          >
            กำหนดรหัสผ่าน
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
