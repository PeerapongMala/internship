import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { get, isNil, reduce } from 'lodash';

import SidePanel from '@domain/g03/g03-d03/local/components/organisms/Sidepanel';
import CWSelectValue from '@component/web/cw-selectValue';
import CWInput from '@component/web/cw-input';
import { toDateTimeTH } from '@global/utils/date';
import API from '@domain/g03/g03-d03/local/api';
import { StudentGroupInfo } from '@domain/g03/g03-d03/local/api/group/student-group-info/type';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';

const TeacherStudentGroupInfo = () => {
  const navigate = useNavigate();
  const { studentGroupId } = useParams({ strict: false });
  const [optionSubject, setOptionSubject] = useState<
    { id: number; name: string; seed_year_short_name: string }[]
  >([]);
  const [optionClasses, setOptionClasses] = useState<
    { id: number; name: string; year: string }[]
  >([]);
  const [isDisable, setIsDisable] = useState(false);
  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const schoolId = userData.school_id;

  let time = toDateTimeTH(new Date());
  const fullName = userData.first_name + ' ' + userData.last_name;
  const form = useForm<Partial<StudentGroupInfo>>();

  const { control, setValue, watch } = form;

  useEffect(() => {
    API.studentGroupInfo.GetDropdownSubjects().then((res) => {
      if (res.status_code == 200) {
        setOptionSubject(res.data);
      }
    });
  }, []);
  useEffect(() => {
    if (watch('class_academic_year') && watch('class_year') && watch('subject_id')) {
      API.studentGroupInfo
        .GetClassListBySubjectTeacherIdAndAcademicYearAndYear({
          academic_year: Number(watch('class_academic_year')),
          year: watch('class_year')?.toString() || '',
          subject_id: watch('subject_id') || 0,
        })
        .then((res) => {
          if (res.status_code == 200) {
            setOptionClasses(res?.data);
          }
        });
    }
  }, [watch('class_academic_year'), watch('class_year'), watch('subject_id')]);

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!studentGroupId) return;
      try {
        const res = await API.studentGroupInfo.GetStudyGroupById(studentGroupId);
        if (res.status_code === 200) {
          const data = get(res.data, 0);
          setValue('subject_id', data?.subject_id);
          setValue('class_id', Number(data?.class_id));
          setValue('study_group_name', data?.name);
          setValue('status', data?.status);
          setValue('class_academic_year', data?.class_academic_year);
          setValue('class_year', data?.class_year);
        }
      } catch (error) {
        showMessage('Failed to fetch please try again', 'error');
      }
    };

    fetchGroupData();
  }, [studentGroupId, optionSubject]);

  useEffect(() => {
    const allValuesExist = reduce(
      watch(),
      (valid, value) => valid && !isNil(value) && value !== '',
      true,
    );

    setIsDisable(allValuesExist);
  }, [watch()]);

  const handleSaveClick = useCallback(() => {
    const formValues = form.getValues();
    const payload: Partial<StudentGroupInfo> = {
      class_academic_year: formValues.class_academic_year,
      class_id: Number(formValues.class_id),
      class_year: formValues.class_year,
      status: formValues.status,
      student_group_id: Number(studentGroupId),
      study_group_name: formValues.study_group_name || '',
      subject_id: Number(formValues.subject_id) || 0,
    };

    API.studentGroupInfo
      .UpdateStudyGroupById(payload)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('แก้ไขกลุ่มเรียนสำเร็จ', 'success');
          navigate({ to: '../../' });
        } else {
          showMessage('แก้ไขกลุ่มเรียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      })
      .catch(() => {
        showMessage('แก้ไขกลุ่มเรียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      });
  }, [watch()]);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex w-full gap-10">
          <div className="w-[75%]">
            <div className="bg-white p-5 shadow-sm">
              <h1 className="text-[18px] font-bold">ข้อมูลทั่วไป</h1>

              <div className="grid-cols mt-5 grid gap-8">
                <div className="col-span-12 w-full">
                  <label htmlFor="">
                    <span className="text-red-500">*</span>ชื่อกลุ่มเรียน
                  </label>

                  <Controller
                    control={control}
                    name="study_group_name"
                    render={({ field: { onChange, value } }) => {
                      return (
                        <CWInput
                          placeholder={'โปรดกรอก'}
                          onChange={onChange}
                          required={true}
                          className="col-span-2"
                          value={value}
                        />
                      );
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-6 gap-5">
                <div className="col-span-3 w-full">
                  <label htmlFor="">
                    <span className="text-red-500">*</span>วิชา
                  </label>
                  <Controller
                    control={control}
                    name="subject_id"
                    render={({ field: { onChange, value } }) => {
                      return (
                        <CWSelectValue
                          onChange={(newValue) => {
                            onChange(newValue);
                            setValue('class_id', undefined);
                          }}
                          options={optionSubject.map((item) => ({
                            label: `${item.name} - ${item.seed_year_short_name}`,
                            value: item.id,
                          }))}
                          value={value}
                          required={true}
                          className="col-span-2 w-full"
                          disabled={watch('status') === 'disabled'}
                        />
                      );
                    }}
                  />
                </div>
                <div className="col-span-3 w-full">
                  <label htmlFor="">
                    <span className="text-red-500">*</span>ห้อง
                  </label>

                  <Controller
                    control={control}
                    name="class_id"
                    render={({ field: { onChange, value } }) => {
                      return (
                        <CWSelectValue
                          onChange={onChange}
                          options={optionClasses.map((item) => ({
                            label: `${item.year}/${item.name}`,
                            value: item.id,
                          }))}
                          value={value}
                          required={true}
                          className="col-span-2 w-full"
                          disabled={watch('status') === 'disabled'}
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <SidePanel
                userId={schoolId}
                time={time}
                byAdmin={fullName}
                onClick={handleSaveClick}
                titleName="รหัสกลุ่มเรียน"
                statusValue={value || ''}
                onChange={onChange}
                isDisable={isDisable}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default TeacherStudentGroupInfo;
