import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../config/index.json';
import CWTCreateLayout from '@domain/g04/g04-d02/local/component/web/template/cw-t-create-layout';
import CWFormInput from '@domain/g04/g04-d01/local/component/web/cw-form-input';
import { Classroom, School } from '@domain/g01/g01-d05/local/api/type';
import { useEffect, useRef, useState } from 'react';
import { toDateTimeTH } from '@global/utils/date';
import API from '@domain/g01/g01-d05/local/api';
import showMessage from '@global/utils/showMessage';
import { toOptions } from '@domain/g01/g01-d05/local/utils';
import CWAcademicYearModalButton from '../../cw-academic-year-modal-button';

type Option = { label: string; value: string };

interface CWTClassroomFormProps {
  schoolId: number;
  backTo: string;
  onSubmit: (data: Record<string, any>) => void;
  classroom?: Classroom;
}

const CWTClassroomForm = function ({
  schoolId,
  backTo,
  onSubmit,
  classroom,
}: CWTClassroomFormProps) {
  const { t } = useTranslation([ConfigJson.key]);

  const [formData, setFormData] = useState<Record<string, any>>(
    classroom || {
      status: 'draft',
    },
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [updatedBy, setUpdatedBy] = useState<string>();
  const [school, setSchool] = useState<School>();
  const [yearOptions, setYearOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (classroom) {
      setFormData((prev) => ({
        ...prev,
        ...classroom,
      }));
      if (classroom.updated_by) {
        API.other.User.GetById(classroom.updated_by).then((res) => {
          if (res.status_code == 200) {
            setUpdatedBy(`${res.data.first_name} ${res.data.last_name}`);
          } else {
            setUpdatedBy('-');
          }
        });
      }
    }
  }, [classroom]);

  useEffect(() => {
    API.other.School.GetById(schoolId.toString()).then((res) => {
      if (res.status_code == 200) {
        setSchool(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
    API.other.SchoolAffiliation.GetSeedYears().then((res) => {
      if (res.status_code == 200) {
        setYearOptions(toOptions(res.data, 'short_name', 'short_name'));
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, [schoolId]);

  return (
    <CWTCreateLayout
      {...classroom}
      status={classroom?.status ?? 'draft'}
      breadcrumbs={[
        { text: 'สำหรับแอดมิน', href: '/', disabled: true },
        { text: 'จัดการโรงเรียน', href: '/admin/school' },
        {
          text: school?.name ?? schoolId.toString(),
          href: `/admin/school/${schoolId}`,
        },
        {
          text: 'จัดการห้องเรียน',
          href: `/admin/school/${schoolId}?tab=classroom-management`,
        },
        { text: 'เพิ่มห้องเรียน', href: '/' },
      ]}
      navigateLabel={classroom ? 'แก้ไขห้องเรียน' : 'เพิ่มห้องเรียน'}
      navigateTo={backTo}
      onDataChange={(data) => {
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
      }}
      onSubmit={() => {
        if (formData && formRef.current?.reportValidity()) {
          if (formData.academic_year) {
            onSubmit?.(formData);
          } else {
            showMessage('กรุณาเลือกปีการศึกษา', 'warning');
          }
        }
      }}
      sideItems={[
        {
          key: 'school_id',
          type: 'label',
          label: 'รหัสโรงเรียน',
          value: schoolId ?? '-',
          hidden: classroom != undefined,
        },
        {
          key: 'id',
          type: 'label',
          label: 'รหัสห้องเรียน',
          value: classroom ? classroom.id : '-',
          hidden: classroom == undefined,
        },
        {
          key: 'status',
          type: 'select',
          options: [
            { label: 'แบบร่าง', value: 'draft' },
            { label: 'ใช้งาน', value: 'enabled' },
            { label: 'ไม่ใช้งาน', value: 'disabled' },
          ],
          label: 'สถานะ',
          value: classroom?.status,
        },
        {
          key: 'updated_at',
          type: 'label',
          label: 'แก้ไขล่าสุด',
          render() {
            return classroom?.updated_at ? toDateTimeTH(classroom.updated_at) : '-';
          },
        },
        {
          key: 'updated_by',
          type: 'label',
          label: 'แก้ไขล่าสุดโดย',
          render() {
            if (classroom) {
              return updatedBy;
            } else {
              return '-';
            }
          },
        },
      ]}
    >
      <form ref={formRef}>
        <CWFormInput
          onDataChange={setFormData}
          data={formData}
          fields={[
            [
              {
                key: 'academic_year',
                type: 'component',
                component: (
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <span className="text-danger">*</span>ปีการศึกษา
                    </div>
                    <CWAcademicYearModalButton
                      type="button"
                      className="w-full"
                      schoolId={schoolId}
                      onDataChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          academic_year: value?.name,
                        }));
                      }}
                      academicYear={classroom?.academic_year}
                    />
                  </div>
                ),
              },
              {
                key: 'year',
                label: 'ชั้นปี',
                placeholder: 'ชั้นปี',
                type: 'select',
                options: yearOptions,
                required: true,
                value: classroom?.year,
              },
              {
                key: 'name',
                label: 'ห้อง',
                type: 'text',
                required: true,
                value: classroom?.name,
              },
            ],
          ]}
        />
      </form>
    </CWTCreateLayout>
  );
};

export default CWTClassroomForm;
