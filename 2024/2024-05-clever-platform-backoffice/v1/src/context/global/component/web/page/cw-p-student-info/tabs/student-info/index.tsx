import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWButton from '@component/web/cw-button';
import CWInput from '@component/web/cw-input';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import CWSelect from '@component/web/cw-select';
import API_g01 from '@domain/g01/g01-d04/local/api';
import { SchoolStudentList, StudentUpdate } from '@domain/g01/g01-d04/local/type';
import { toOptions } from '@domain/g01/g01-d05/local/utils';
import API_g03 from '@domain/g03/g03-d04/local/api';
import { AccountStudentProfileResponse } from '@domain/g03/g03-d04/local/api/group/account-student/type.ts';
import { toDateTimeTH } from '@global/utils/date';
import {
  useDistrictLocationByName,
  useProvinceLocation,
  useSubdistrictLocationByName,
} from '@global/utils/geolocation';
import showMessage from '@global/utils/showMessage';
import { useNavigate, useParams, useRouter } from '@tanstack/react-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="relative flex flex-col rounded-md bg-white p-4 shadow dark:bg-black">
    <p className="pb-6 text-lg font-bold">{title}</p>
    {children}
  </div>
);

interface StudentInfoProps {
  student: SchoolStudentList | AccountStudentProfileResponse;
  fetchStudent: (userId: string) => void;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ student, fetchStudent }) => {
  const navigate = useNavigate();
  const { schoolId } = useParams({ from: '' });
  const router = useRouter();
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');

  const [updatedStudent, setUpdatedStudent] = useState<
    StudentUpdate | AccountStudentProfileResponse
  >(() => {
    const baseStudent = isAdminPath
      ? { ...student, status: (student as StudentUpdate).status ?? 'draft' }
      : student;
    return baseStudent;
  });

  const [yearsOptions, setYearsOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const formRef = useRef<HTMLFormElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const provinces = useProvinceLocation({});
  const districts = useDistrictLocationByName({
    provinceNameTH: updatedStudent.province || '-',
  });
  const subDistricts = useSubdistrictLocationByName({
    districtNameTH: updatedStudent.district || '-',
  });

  const isFormValid = useMemo(() => {
    return (
      isAdminPath &&
      !!updatedStudent.id_number &&
      !!updatedStudent.first_name &&
      !!updatedStudent.last_name &&
      !!updatedStudent.birth_date &&
      !!updatedStudent.title &&
      !!updatedStudent.student_id
    );
  }, [isAdminPath, updatedStudent]);

  const handleInputChange = (key: keyof StudentUpdate, value: any) => {
    if (key === 'id_number') {
      const idNumberPattern = /^[0-9]{13}$/;
      if (!idNumberPattern.test(value)) {
        setUpdatedStudent((prev) => ({ ...prev, id_number: '' }));
        showMessage('เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก', 'error');
        return;
      }
    }
    setUpdatedStudent((prev) => ({ ...prev, [key]: value || '' }));
  };

  const refreshStudentData = () => fetchStudent(student.id);

  const handleFormSubmit = () => {
    if (!isAdminPath || !formRef.current?.reportValidity()) return;

    const formattedBirthDate = updatedStudent.birth_date
      ? new Date(updatedStudent.birth_date).toISOString().split('.')[0] + 'Z'
      : undefined;

    const studentData = {
      ...updatedStudent,
      birth_date: formattedBirthDate,
      status: updatedStudent.status as 'enabled' | 'disabled' | 'draft' | undefined,
    };

    const apiCall =
      student.id && isFormValid
        ? API_g01.schoolStudent.Update(student.id, studentData)
        : API_g01.schoolStudent.Create({ ...studentData, school_id: schoolId });

    apiCall
      .then((res) => {
        const success = [200, 201].includes(res.status_code);
        const message = success
          ? 'บันทึกข้อมูลสำเร็จ'
          : res.message.startsWith('Unique field')
            ? 'รหัสนักเรียนซ้ำ'
            : res.message;

        showMessage(message, success ? 'success' : 'error');
        if (success) {
          refreshStudentData();
          navigate({ to: `/admin/school/${schoolId}?tab=user-management` });
        }
      })
      .catch((error) => {
        showMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
        console.error(error);
      });
  };

  useEffect(() => {
    if (isAdminPath || isTeacherPath) {
      API_g01.schoolStudent.GetSeedYears().then((res) => {
        if (res.status_code === 200) {
          setYearsOptions(toOptions(res.data, 'short_name', 'short_name'));
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }, [isAdminPath, isTeacherPath]);

  useEffect(() => {
    const postCode =
      subDistricts.find((s) => s.subdistrictNameTh === updatedStudent.sub_district)
        ?.postalCode || '';
    if (updatedStudent.post_code !== postCode) {
      handleInputChange('post_code', postCode);
    }
  }, [updatedStudent.sub_district, subDistricts, updatedStudent.post_code]);

  const imageURL = useMemo(() => {
    if (
      'profile_image' in updatedStudent &&
      updatedStudent.profile_image instanceof File
    ) {
      return URL.createObjectURL(updatedStudent.profile_image);
    }
    return student.image_url || '';
  }, [updatedStudent, student.image_url]);

  const renderInput = (
    label: string,
    key: keyof StudentUpdate,
    required = false,
    type = 'text',
  ) => {
    if (key === 'birth_date' && type === 'date') {
      return (
        <div className="w-full">
          <WCAInputDateFlat
            label={label}
            required={required}
            value={updatedStudent.birth_date as string}
            onChange={(dates) => {
              if (dates && dates[0]) {
                const date = new Date(dates[0]);
                const formattedDate = date.toISOString().split('T')[0];
                handleInputChange(key, formattedDate);
              } else {
                handleInputChange(key, '');
              }
            }}
            options={{
              maxDate: new Date(),
            }}
          />
        </div>
      );
    }

    return (
      <CWInput
        label={label}
        required={required}
        type={type}
        className="w-full"
        value={
          type === 'date'
            ? typeof (updatedStudent as StudentUpdate)[key] === 'string'
              ? ((updatedStudent as StudentUpdate)[key] as string).split('T')[0]
              : ''
            : (updatedStudent as StudentUpdate)[key] instanceof File
              ? ''
              : String((updatedStudent as StudentUpdate)[key] ?? '')
        }
        disabled={isTeacherPath}
        onChange={(e) => handleInputChange(key, e.currentTarget.value)}
      />
    );
  };

  const renderSelect = (
    label: string,
    options: { label: string; value: string }[],
    key: keyof StudentUpdate,
    disabled = false,
    required = false,
  ) => (
    <CWSelect
      label={label}
      options={options}
      className="w-full"
      value={(updatedStudent as StudentUpdate)[key] || ''}
      disabled={disabled}
      onChange={(e) => handleInputChange(key, e.currentTarget.value)}
      required={required}
    />
  );

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    return {
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  };

  const modalResetPassword = useModal();

  const handleResetPassword = async (pin: string) => {
    if (!pin) {
      showMessage('กรุณากรอกรหัสผ่าน', 'warning');
      return;
    }
    if (pin.length < 4) {
      showMessage('กรุณากรอกรหัสให้ครบ 4 หลัก', 'warning');
      return;
    }
    if (pin.length > 4) {
      showMessage('กรุณากรอกรหัสไม่เกิน 4 หลัก', 'warning');
      return;
    }
    try {
      if (student.id) {
        if (isAdminPath) {
          await API_g01.schoolStudent.UpdateUserPin({ user_id: student.id, pin });
        } else if (isTeacherPath) {
          await API_g03.accountStudent.UpdateStudentPin(student.student_id, pin);
        }
        showMessage('เปลี่ยน PIN สำเร็จ!', 'success');
        modalResetPassword.close();
      } else {
        setUpdatedStudent((prev) => ({ ...prev, pin }));
        modalResetPassword.close();
      }
    } catch {
      showMessage('ไม่สามารถเปลี่ยน PIN ได้', 'error');
    }
  };

  return (
    <div className="flex flex-row gap-6">
      <form ref={formRef} className="flex w-3/4 flex-col gap-4">
        <Section title="ข้อมูลทั่วไป">
          <div className="flex flex-row gap-6">
            <div
              className="mx-auto max-h-60 max-w-60 cursor-pointer hover:opacity-90"
              onClick={() => imageRef.current?.click()}
            >
              <div className="mx-auto flex h-60 w-60 items-center justify-center overflow-hidden rounded-full border-2 bg-neutral-200 text-neutral-500">
                {imageURL || student.image_url ? (
                  <div
                    style={{
                      backgroundImage: `url(${imageURL || student.image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    className="h-full w-full"
                  />
                ) : (
                  <span>กดเพื่อเพิ่มรูปภาพ</span>
                )}
                <input
                  ref={imageRef}
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    const maxSize = 5 * 1024 * 1024;
                    const allowedTypes = ['image/jpeg', 'image/png'];
                    if (file) {
                      if (file.size > maxSize) {
                        showMessage('ขนาดไฟล์ต้องไม่เกิน 5 MB', 'warning');
                        return;
                      }

                      if (!allowedTypes.includes(file.type)) {
                        showMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'warning');
                        return;
                      }
                      handleInputChange('profile_image', file);
                    }
                  }}
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
              {/* {renderSelect('ชั้น', yearsOptions, 'year', isTeacherPath, true)} */}
              {renderInput('รหัสนักเรียน', 'student_id', true)}
              {renderInput('เลขประจำตัวประชาชน', 'id_number', true)}
              {renderInput('คำนำหน้า', 'title', true)}
              {renderInput('ชื่อ', 'first_name', true)}
              {renderInput('นามสกุล', 'last_name', true)}
              {renderInput('วันเกิด', 'birth_date', true, 'date')}
              {renderInput('สัญชาติ', 'nationality')}
              {renderInput('เชื้อชาติ', 'ethnicity')}
              {renderInput('ศาสนา', 'religion')}
            </div>
          </div>
        </Section>

        <Section title="ข้อมูล บิดา-มารดา">
          <div className="flex flex-col gap-2">
            <div className="w-1/4">{renderInput('คำนำหน้าบิดา', 'father_title')}</div>
            <div className="flex gap-6">
              {renderInput('ชื่อ', 'father_first_name')}
              {renderInput('นามสกุล', 'father_last_name')}
            </div>
            <div className="w-1/4">{renderInput('คำนำหน้ามารดา', 'mother_title')}</div>
            <div className="flex gap-6">
              {renderInput('ชื่อ', 'mother_first_name')}
              {renderInput('นามสกุล', 'mother_last_name')}
            </div>
            <div className="w-1/4">
              {renderInput('สถานภาพสมรสของบิดามารดา', 'parent_marital_status')}
            </div>
          </div>
        </Section>

        <Section title="ข้อมูลผู้ปกครอง">
          <div className="flex flex-col gap-2">
            <div className="flex w-1/2 gap-6">
              {renderInput('ความเกี่ยวข้องกับนักเรียน', 'parent_relationship')}
              {renderInput('คำนำหน้า', 'parent_title')}
            </div>
            <div className="flex gap-6">
              {renderInput('ชื่อ', 'parent_first_name')}
              {renderInput('นามสกุล', 'parent_last_name')}
            </div>
          </div>
        </Section>

        <Section title="ที่อยู่">
          <div className="flex flex-col gap-2">
            <div className="flex gap-6">
              {renderInput('บ้านเลขที่', 'house_number')}
              {renderInput('หมู่', 'moo')}
            </div>
            <div className="flex gap-6">
              {renderSelect(
                'จังหวัด',
                provinces.map((p) => ({
                  label: p.provinceNameTh,
                  value: p.provinceNameTh,
                })),
                'province',
                isTeacherPath,
              )}
              {renderSelect(
                'อำเภอ',
                districts.map((d) => ({
                  label: d.districtNameTh,
                  value: d.districtNameTh,
                })),
                'district',
                isTeacherPath || !updatedStudent.province,
              )}
              {renderSelect(
                'ตำบล',
                subDistricts.map((s) => ({
                  label: s.subdistrictNameTh,
                  value: s.subdistrictNameTh,
                })),
                'sub_district',
                isTeacherPath || !updatedStudent.district,
              )}
              {renderInput('รหัสไปรษณีย์', 'post_code')}
            </div>
          </div>
        </Section>
      </form>

      <div className="relative flex h-fit w-1/4 flex-col gap-4 rounded-md bg-white p-4 shadow dark:bg-black">
        <div className="flex flex-col gap-4">
          {student.id && (
            <div className="flex flex-row gap-4">
              <p className="w-2/6">uuid</p>
              <p className="w-4/6">{student.id}</p>
            </div>
          )}
          <div className="flex flex-row items-center justify-between gap-4">
            <p className="w-2/6">สถานะ</p>
            <span className="w-4/6">
              <CWSelect
                options={[
                  { value: 'draft', label: 'แบบร่าง' },
                  { value: 'enabled', label: 'ใช้งาน' },
                  { value: 'disabled', label: 'ไม่ใช้งาน' },
                ]}
                value={updatedStudent.status ?? 'draft'}
                onChange={(e) => handleInputChange('status', e.currentTarget.value)}
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
          <button
            className="btn btn-primary"
            type="button"
            disabled={!isFormValid}
            onClick={handleFormSubmit}
          >
            บันทึก
          </button>
        )}

        <CWButton
          title="เปลี่ยนพิน"
          className="w-full"
          onClick={modalResetPassword.open}
        />

        <CWModalResetPassword
          mode="pin"
          maxLength={4}
          open={modalResetPassword.isOpen}
          onClose={modalResetPassword.close}
          onOk={handleResetPassword}
        />
      </div>
    </div>
  );
};

export default StudentInfo;
