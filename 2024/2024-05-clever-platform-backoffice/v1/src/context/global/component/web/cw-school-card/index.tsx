import React from 'react';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import CWImg from '../atom/wc-a-img';

export interface SchoolCardProps {
  /**
   * @deprecated These individual fields are deprecated and will be ignored. Use `school` prop instead.
   */
  name?: string;
  /**
   * @deprecated These individual fields are deprecated and will be ignored. Use `school` prop instead.
   */
  code?: string;
  /**
   * @deprecated These individual fields are deprecated and will be ignored. Use `school` prop instead.
   */
  subCode?: string;
  /**
   * @deprecated These individual fields are deprecated and will be ignored. Use `school` prop instead.
   */
  image?: string;

  /**
   * If provided, this object will override the school data from user store.
   */
  school?: {
    school_image_url?: string;
    school_name?: string;
    school_id?: string | number;
    school_code?: string;
  };
  className?: string;
}

const CWSchoolCard = ({ className = '', school }: SchoolCardProps) => {
  // Get user and target data from global store
  const { userData, targetData, isLoginAs } = StoreGlobalPersist.StateGet([
    'userData',
    'targetData',
    'isLoginAs',
  ]);

  const storeSchool = isLoginAs ? targetData : userData;

  const displaySchool = school ?? {
    school_image_url: storeSchool?.school_image_url,
    school_name: storeSchool?.school_name,
    school_id: storeSchool?.school_id,
    school_code: storeSchool?.school_code,
  };

  const {
    school_image_url: schoolImageUrl,
    school_name: schoolNameRaw,
    school_id: schoolIdRaw,
    school_code: schoolCodeRaw,
  } = displaySchool;

  const schoolName = schoolNameRaw ?? 'โรงเรียน-';
  const schoolId = schoolIdRaw != null ? String(schoolIdRaw).padStart(11, '0') : '-';
  const schoolCode = schoolCodeRaw ?? '-';

  return (
    <div
      className={`flex flex-col gap-[10px] rounded-[10px] bg-neutral-100 p-[10px] ${className}`}
    >
      <div className="flex items-center gap-[10px]">
        {schoolImageUrl && (
          <CWImg alt="school logo" src={schoolImageUrl} className="h-6 w-6 rounded" />
        )}
        <p className="text-xl font-bold">{schoolName}</p>
      </div>
      <p className="text-sm">
        รหัสโรงเรียน: {schoolId} (ตัวย่อ: {schoolCode})
      </p>
    </div>
  );
};

export default CWSchoolCard;
