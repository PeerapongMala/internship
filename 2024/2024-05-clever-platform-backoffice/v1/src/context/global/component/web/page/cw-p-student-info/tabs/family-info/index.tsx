import CWWhiteBox from '@component/web/cw-white-box';
import API_g01 from '@domain/g01/g01-d04/local/api';
import { FamilyInfoResponse } from '@domain/g01/g01-d04/local/type.ts';
import API_g03 from '@domain/g03/g03-d04/local/api';
import { FamilyResponse } from '@domain/g03/g03-d04/local/api/group/account-student/type.ts';
import showMessage from '@global/utils/showMessage.ts';
import { useRouter } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';

const FamilyInfo = ({ userId }: { userId: string }) => {
  // ตรวจสอบ path ของ URL
  const router = useRouter();
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');

  const [familyInfo, setFamilyInfo] = useState<FamilyInfoResponse[]>([]);
  const [familyInfoByTeacher, setFamilyInfoByTeacher] = useState<FamilyResponse[]>([]);

  useEffect(() => {
    const fetchFamilyInfo = async () => {
      if (isAdminPath) {
        const response = await API_g01.schoolStudent.GetFamilyInfo(userId);
        if (response.status_code === 200 && response.data) {
          setFamilyInfo(response.data);
        } else {
          showMessage('ไม่สามารถดึงข้อมูลครอบครัวได้', 'success');
        }
      }
      if (isTeacherPath) {
        const response = await API_g03.accountStudent.GetFamily(userId);
        if (response.status_code === 200 && response.data) {
          setFamilyInfoByTeacher(response.data);
        } else {
          showMessage('ไม่สามารถดึงข้อมูลครอบครัวได้', 'success');
        }
      }
    };

    fetchFamilyInfo();
  }, [userId]);

  if (familyInfo.length === 0 && familyInfoByTeacher.length === 0) {
    return <CWWhiteBox>ไม่มีข้อมูลครอบครัว</CWWhiteBox>;
  }

  if (isAdminPath) {
    return familyInfo.map((info: any) => (
      <CWWhiteBox className="flex flex-col gap-5">
        <h1 className="text-xl font-bold">ข้อมูลครอบครัว</h1>
        <div className="flex items-center text-sm">
          <span className="w-[150px]">รหัสครอบครัว:</span>
          <span>{info.id}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="w-[150px]">เจ้าของ:</span>
          <span>{info.owner}</span>
        </div>
      </CWWhiteBox>
    ));
  }

  if (isTeacherPath) {
    return familyInfoByTeacher.map((info: any) => (
      <CWWhiteBox className="flex flex-col gap-5">
        <h1 className="text-xl font-bold">ข้อมูลครอบครัว</h1>
        <div className="flex items-center text-sm">
          <span className="w-[150px]">รหัสครอบครัว:</span>
          <span>{info.family_id}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="w-[150px]">เจ้าของ:</span>
          <span>
            {info.title} {info.first_name} {info.last_name}
          </span>
        </div>
      </CWWhiteBox>
    ));
  }
};

export default FamilyInfo;
