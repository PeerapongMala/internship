import React, { useEffect, useRef, useState } from 'react';
import InputQrCode from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/atom/cw-a-input-qrcode';
import IconScan from '@core/design-system/library/component/icon/IconScan';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconInputText from '@core/design-system/library/component/icon/IconInputText';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import InputText from '@domain/g01/g01-d06/local/component/web/atom/wc-a-text-input';
import CWInput from '@component/web/cw-input';
import CWButton from '@component/web/cw-button';
import { AxiosError, AxiosResponse } from 'axios';
import API from '@domain/g05/g05-d02/local/api';
import { TPostAddFamilyRes } from '@domain/g05/g05-d02/local/api/helper/family';
import showMessage from '@global/utils/showMessage';
import { TBaseResponse } from '@domain/g06/g06-d02/local/types';

type DropdownScanMethodProps = {
  isOpen: boolean;
  onQrCodeResult?: (data: string) => void;
  handleCloseDropdown: () => void;
  onSelectCameraClick?: () => void;
  familyID: number;
  onAddMemberSuccess?: () => void;
};

type TScanMethodMenu = {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
};

const DropdownScanMethod = ({
  isOpen,
  handleCloseDropdown,
  onSelectCameraClick,
  onQrCodeResult,
  familyID,
  onAddMemberSuccess,
}: DropdownScanMethodProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showInputUUID, setShowInputUUID] = useState(false);
  const [inputUserID, setInputUserID] = useState('');

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleCloseDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, handleCloseDropdown]);

  const menus: TScanMethodMenu[] = [
    {
      icon: <IconScan />,
      label: 'แสกนคิวอาร์',
      onClick: () => {
        handleCloseDropdown();
        onSelectCameraClick?.();
      },
    },
  ];

  const handleAddMember = async () => {
    let response: AxiosResponse<TPostAddFamilyRes>;

    try {
      response = await API.Family.AddFamilyMember({
        family_id: familyID,
        user_id: inputUserID,
      });
    } catch (error) {
      const err = error as AxiosError<Omit<TBaseResponse, 'data'>>;

      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        showMessage(err.response?.data?.message, 'warning');
        throw error;
      }

      showMessage(err.response?.data?.message, 'error');

      throw error;
    }

    onAddMemberSuccess?.();
    showMessage('เพิ่มสมาชิกสำเร็จ');
    setShowInputUUID(false);
  };

  return (
    <>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-16 rounded-md bg-neutral-50 drop-shadow-lg"
        >
          {menus.map((menu, index) => (
            <button
              key={index}
              className="flex w-[164px] items-center gap-2 px-[15px] py-[10px] text-left"
              onClick={menu.onClick}
            >
              {menu.icon}
              <span>{menu.label}</span>
            </button>
          ))}

          <label
            className="flex w-[164px] cursor-pointer items-center gap-2 px-[15px] py-[5px] font-normal"
            htmlFor="qr-code-upload"
          >
            <IconUpload />
            <span>เลือกรูปภาพคิวอาร์</span>
            <InputQrCode onQrCodeResult={onQrCodeResult} />
          </label>

          <button
            className="flex w-[164px] items-center gap-2 px-[15px] py-[5px] font-normal"
            onClick={() => {
              handleCloseDropdown();
              setShowInputUUID(true);
            }}
          >
            <IconInputText />
            <span>กรอกรหัส</span>
          </button>
        </div>
      )}

      {/* Modal กรอกรหัส */}
      {showInputUUID && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="relative flex items-center justify-between border-b px-4 py-2">
            <div className="pointer-events-none absolute left-0 right-0 flex justify-center">
              <span className="text-[16px] font-bold">จัดการครอบครัว</span>
            </div>

            <button
              className="z-10 ml-auto text-gray-500 hover:text-black"
              onClick={() => setShowInputUUID(false)}
            >
              <IconClose />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center px-4">
            <div className="w-full max-w-md">
              <CWInput
                type="text"
                label="เพิ่มสมาชิกครอบครัว:"
                placeholder="กรอกรหัสนักเรียน"
                required
                onChange={(e) => setInputUserID(e.target.value)}
              />
              <CWButton
                className="mt-3 w-full"
                variant="primary"
                title="เพิ่มสมาชิก"
                onClick={handleAddMember}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DropdownScanMethod;
