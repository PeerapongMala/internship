import CWButton from '@component/web/cw-button';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import CWTitleBack from '@component/web/cw-title-back';
import { UseStatus } from '@domain/g01/g01-d02/local/type';
import API from '@domain/g06/g06-d07/local/api';
import { TStudent } from '@domain/g06/g06-d07/local/types/students';
import SelectClass from '@domain/g06/local/components/web/molecule/cw-m-select-class';
import SelectYear from '@domain/g06/local/components/web/molecule/cw-m-select-year';
import { toDateTimeTH } from '@global/utils/date';
import showMessage from '@global/utils/showMessage';
import { FormEvent, useEffect, useState } from 'react';

type EditStudentPanelProps = {
  selectedStudentID: number | null;
  onBack?: () => void;
  handleSuccess?: () => void;
};

const EditStudentPanel = ({
  selectedStudentID: studentID,
  onBack,
  handleSuccess,
}: EditStudentPanelProps) => {
  const [student, setStudent] = useState<TStudent | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const fetchData = async (id: number) => {
    setLoading(true);
    try {
      const result = await API.GradeSetting.GetStudentInformation(id);
      setStudent(result.data.data);
    } catch (error) {
      showMessage('พบปัญหาในการดึงข้อมูลนักเรียน', 'error');
      onBack?.();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!studentID || !student) {
      showMessage('ไม่พบไอดีและข้อมูลของนักเรียน', 'error');
      onBack?.();
      return;
    }

    try {
      await API.GradeSetting.PostStudentUpdate(studentID, student);
      showMessage('บันทึกข้อมูลสำเร็จ', 'success');
      onBack?.();
      handleSuccess?.();
    } catch (error) {
      showMessage('พบปัญหาในการบันทึกข้อมูล', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  // for dropdown
  const handleSelectChange = (name: keyof TStudent, value: string | number) => {
    setStudent((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    if (!studentID) {
      onBack?.();
      return;
    }
    fetchData(studentID);
  }, [studentID]);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <CWTitleBack onClick={onBack} label="แก้ไขข้อมูลนักเรียน" />

      <form className="flex flex-col gap-5" onSubmit={handleUpdateData}>
        <div className="grid grid-cols-2">
          <div className="grid grid-cols-2 gap-2">
            <CWInput
              required
              label="เลขประจำตัวประชาชร:"
              name="citizen_no"
              value={student?.citizen_no || ''}
              onChange={handleInputChange}
              disabled={!student}
            />
            <CWInput
              required
              label="รหัสนักเรียน:"
              name="student_id"
              value={student?.student_id || ''}
              onChange={handleInputChange}
              disabled={!student}
            />
            <CWInput
              required
              label="ชื่อ:"
              name="thai_first_name"
              value={student?.thai_first_name}
              onChange={handleInputChange}
              disabled={!student}
            />
            <CWInput
              required
              label="นามสกุล:"
              name="thai_last_name"
              value={student?.thai_last_name}
              onChange={handleInputChange}
              disabled={!student}
            />

            <CWInput disabled label="ชั้น:" value={student?.year} />
            <CWInput disabled label="ห้อง:" value={student?.school_room} />
            {/* <SelectYear
            // required
            label="ชั้น:"
            value={student?.year}
            disabled={!student}
            onChange={(value) => {
              console.log(value);
              handleSelectChange('year', value);
            }}
          />
          <SelectClass
            // required
            label="ห้อง:"
            academicYear={student?.academic_year ? Number(student?.academic_year) : null}
            year={student?.year || ''}
            value={student?.school_room ? +student?.school_room : undefined}
            onChange={(value) => handleSelectChange('school_room', value)}
            disabled={!student}
          /> */}
          </div>

          {/* this invisible due still left space to match other page design */}
          <div className="invisible h-fit flex-col gap-4 rounded-md bg-white p-4 shadow">
            <div className="items-center gap-y-4">
              <div>สถานะ</div>
              <div>
                <CWSelect
                  options={[
                    {
                      label: 'แบบร่าง',
                      value: UseStatus.DRAFT,
                    },
                    {
                      label: 'ใช้งาน',
                      value: UseStatus.IN_USE,
                    },
                    {
                      label: 'ไม่ใช้งาน',
                      value: UseStatus.NOT_IN_USE,
                    },
                  ]}
                />
              </div>
              <div>แก้ไขล่าสุด</div>
              {/* <div>{student?.updated_at ? toDateTimeTH(student.updated_at) : '-'}</div> */}
              <div>แก้ไขล่าสุดโดย</div>
              {/* <div>{student?.updated_by_user_name || 'admin'}</div> */}
            </div>
          </div>
        </div>

        <div className="w-full bg-neutral-100 p-4">
          <CWButton
            className="w-full max-w-[120px]"
            title="บันทึก"
            type="submit"
            disabled={!student}
          />
        </div>
      </form>
    </>
  );
};

export default EditStudentPanel;
