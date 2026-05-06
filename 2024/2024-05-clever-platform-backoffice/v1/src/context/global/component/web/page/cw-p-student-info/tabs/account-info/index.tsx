import CWButton from '@component/web/cw-button';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import CWSelect from '@component/web/cw-select';
import API_g01 from '@domain/g01/g01-d04/local/api';
import { SchoolStudentList } from '@domain/g01/g01-d04/local/type.ts';
import API_g03 from '@domain/g03/g03-d04/local/api';
import { AccountStudentProfileResponse } from '@domain/g03/g03-d04/local/api/group/account-student/type.ts';
import { toDateTimeTH } from '@global/utils/date.ts';
import showMessage from '@global/utils/showMessage.ts';
import { useRouter } from '@tanstack/react-router';
import React, { useCallback, useState } from 'react';

interface AccountInfoProps {
  student: SchoolStudentList | AccountStudentProfileResponse;
}

// const useModal = (initialState = false) => {
//   const [isOpen, setIsOpen] = useState(initialState);
//   return {
//     isOpen,
//     open: () => setIsOpen(true),
//     close: () => setIsOpen(false),
//   };
// };

const AccountInfo = ({ student }: AccountInfoProps) => {
  // ตรวจสอบ path ของ URL
  const router = useRouter();
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');

  const [selectedStatus, setSelectedStatus] = useState();
  // const modalResetPassword = useModal();

  // const handleResetPassword = async (password: string) => {
  //   if (!password) return showMessage('กรุณากรอกรหัสผ่านใหม่', 'error');
  //   if (isAdminPath) {
  //     try {
  //       await API_g01.schoolStudent.UpdateUserPin({
  //         user_id: student.id,
  //         pin: password,
  //       });
  //       showMessage('เปลี่ยน PIN สำเร็จ!', 'success');
  //       modalResetPassword.close();
  //     } catch {
  //       showMessage('ไม่สามารถเปลี่ยน PIN ได้', 'error');
  //     }
  //   } else if (isTeacherPath) {
  //     try {
  //       await API_g03.accountStudent.UpdateStudentPin(student.student_id, password);
  //       showMessage('เปลี่ยน PIN สำเร็จ!', 'success');
  //       modalResetPassword.close();
  //     } catch {
  //       showMessage('ไม่สามารถเปลี่ยน PIN ได้', 'error');
  //     }
  //   }
  // };

  const saveStatus = async () => {
    try {
      const res = await API_g01.schoolStudent.Update(student.id, {
        status: selectedStatus,
      });
      if (res.status_code === 200 || res.status_code === 201) {
        showMessage('บันทึกนักเรียนสำเร็จ', 'success');
      }
    } catch {
      showMessage('เกิดข้อผิดพลาดในการบันทึก', 'error');
    }
  };

  const getOAuthData = (provider: string) => {
    const auth = student.oauth.find((auth) => auth.provider === provider);
    return { description: auth?.subject_id || '', isLinked: !!auth };
  };

  return (
    <div className="flex flex-row gap-6">
      <div className="flex w-3/4 flex-col gap-4">
        <div className="flex flex-col gap-6 rounded-md bg-white p-4 shadow dark:bg-black">
          <h1 className="text-lg font-bold">ข้อมูลบัญชี</h1>
          {/* <p className="text-base font-bold">พินนักเรียน</p>
          <CWButton
            title="เปลี่ยนพิน"
            className="w-1/5"
            onClick={modalResetPassword.open}
          /> */}
          {/* <CWModalResetPassword
            open={modalResetPassword.isOpen}
            onClose={modalResetPassword.close}
            onOk={handleResetPassword}
          /> */}
          <div className="border-b-2" />
          {['line', 'google'].map((provider) => (
            <CardItem
              key={provider}
              logo={`https://upload.wikimedia.org/wikipedia/commons/${
                provider === 'line'
                  ? '4/41/LINE_logo.svg'
                  : '7/7e/Gmail_icon_%282020%29.svg'
              }`}
              title={provider.charAt(0).toUpperCase() + provider.slice(1)}
              {...getOAuthData(provider)}
              userId={student.id}
            />
          ))}
        </div>
      </div>

      <div className="relative flex h-fit w-1/4 flex-col gap-4 rounded-md bg-white p-4 shadow dark:bg-black">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between gap-4">
            <p className="w-2/6">สถานะ</p>
            <span className="w-4/6">
              <CWSelect
                options={[
                  { value: 'draft', label: 'แบบร่าง' },
                  { value: 'enabled', label: 'ใช้งาน' },
                  { value: 'disabled', label: 'ไม่ใช้งาน' },
                ]}
                value={selectedStatus || student.status || 'draft'}
                onChange={(e) => {
                  setSelectedStatus(e.currentTarget.value);
                }}
                disabled={isTeacherPath}
              />
            </span>
          </div>
          <div className="flex flex-row items-center justify-between gap-4">
            <p className="w-2/6">แก้ไขล่าสุด</p>
            <p className="w-4/6">
              {student?.updated_at ? toDateTimeTH(student.updated_at) : '-'}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between gap-4">
            <p className="w-2/6">แก้ไขล่าสุดโดย</p>
            <p className="w-4/6">{student?.updated_by ? student.updated_by : '-'}</p>
          </div>
        </div>
        {isAdminPath && (
          <button className="btn btn-primary" type="button" onClick={() => saveStatus()}>
            บันทึก
          </button>
        )}
      </div>
    </div>
  );
};

const CardItem: React.FC<{
  logo: string;
  title: string;
  description?: string;
  isLinked: boolean;
  userId: string;
}> = ({ logo, title, description, isLinked, userId }) => {
  // ตรวจสอบ path ของ URL
  const router = useRouter();
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');

  const handleUpdateOAuth = useCallback(async () => {
    if (!isLinked) return;

    try {
      await API_g01.schoolStudent.UpdateOAuthProvider(userId, title.toLowerCase());
      showMessage('Update successful', 'success');
    } catch {
      showMessage('Update failed', 'error');
    }
  }, [isLinked, userId, title]);

  return (
    <div className="flex flex-row justify-between">
      <div className="flex items-start">
        <img src={logo} alt={`${title} Logo`} className="mr-3 h-10 w-10" />
        <div>
          <h2 className="text-sm font-bold">{title.toUpperCase()}</h2>
          {description && <p className="text-sm">{description}</p>}
        </div>
      </div>
      {isAdminPath && (
        <CWButton
          title={isLinked ? 'ยกเลิกเชื่อมต่อ' : 'เชื่อมต่อ'}
          className="w-1/5"
          variant={isLinked ? 'danger' : 'primary'}
          onClick={handleUpdateOAuth}
        />
      )}
    </div>
  );
};

export default AccountInfo;
