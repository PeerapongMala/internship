import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { get, isNil, reduce } from 'lodash';
import SidePanel from '@domain/g03/g03-d03/local/components/organisms/Sidepanel';
import CWSelectValue from '@component/web/cw-selectValue';
import CWInput from '@component/web/cw-input';
import API from '@domain/g03/g03-d03/local/api';
import { StudentGroupInfo } from '@domain/g03/g03-d03/local/api/group/student-group-info/type';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';
import { getUserSubjectData } from '@global/utils/store/user-subject';
import { getClassData } from '@global/utils/store/get-class-data';

const TeacherStudentGroupInfo = () => {
  const navigate = useNavigate();
  const subjectData = getUserSubjectData();
  const classData = getClassData();

  const initialSubjectId = subjectData?.id;
  const initialYear = subjectData?.year_name ? String(subjectData.year_name) : undefined;
  const initialClassId = classData?.class_id;

  const [optionYear, setOptionYear] = useState<{ value: string; label: string }[]>([]);
  const [optionSubject, setOptionSubject] = useState<
    { id: number; name: string; seed_year_short_name: string }[]
  >([]);
  const [optionClasses, setOptionClasses] = useState<
    { id: number; name: string; year: string }[]
  >([]);
  const [isDisable, setIsDisable] = useState(false);
  const [academicYear, setAcademicYear] = useState<number>();

  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const schoolId = userData.school_id;

  const form = useForm<Partial<StudentGroupInfo>>({
    defaultValues: {
      subject_id: initialSubjectId,
      year: initialYear,
      class_id: initialClassId,
      study_group_name: '',
      status: 'enabled',
    },
  });

  const { control, watch, setValue, getValues } = form;

  useEffect(() => {
    const fetchOptionDropdown = async () => {
      API.other.GetAcademicYears().then((res) => {
        if (res.status_code == 200) {
          setAcademicYear(res?.data[0]);
          API.other.GetYears(res?.data[0]).then((res) => {
            if (res.status_code == 200) {
              const years = res?.data?.map((item) => ({ value: item, label: item }));
              setOptionYear(years);

              if (initialYear && years.some((y) => y.value === initialYear)) {
                setValue('year', initialYear, { shouldValidate: true });
              } else if (years.length > 0) {
                setValue('year', years[0].value, { shouldValidate: true });
              }
            }
          });
        }
      });
    };
    fetchOptionDropdown();
  }, []);

  useEffect(() => {
    if (academicYear && watch('year')) {
      API.studentGroupInfo
        .GetSubjectListByTeacherIdAndAcademicYearAndYear({
          academic_year: Number(academicYear),
          year: watch('year') || '',
        })
        .then((res) => {
          if (res.status_code == 200) {
            const subjects = res?.data;
            setOptionSubject(subjects);

            const subjectToSelect = subjects.find((s) => s.id === initialSubjectId);
            if (subjectToSelect) {
              setValue('subject_id', subjectToSelect.id, { shouldValidate: true });
            } else if (subjects.length > 0) {
              setValue('subject_id', subjects[0].id, { shouldValidate: true });
            }
          }
        });
    }
  }, [academicYear, watch('year')]);

  useEffect(() => {
    if (academicYear && watch('year') && watch('subject_id')) {
      API.studentGroupInfo
        .GetClassListBySubjectTeacherIdAndAcademicYearAndYear({
          academic_year: Number(academicYear),
          year: watch('year') || '',
          subject_id: watch('subject_id') || 0,
        })
        .then((res) => {
          if (res.status_code == 200) {
            const classes = res?.data;
            setOptionClasses(classes);
            const classToSelect = classes.find((c) => c.id === initialClassId);
            if (classToSelect) {
              setValue('class_id', classToSelect.id, { shouldValidate: true });
            } else if (classes.length > 0) {
              setValue('class_id', classes[0].id, { shouldValidate: true });
            }
          }
        });
    }
  }, [academicYear, watch('year'), watch('subject_id')]);

  useEffect(() => {
    const allValuesExist = reduce(
      watch(),
      (valid, value) => valid && !isNil(value),
      true,
    );

    setIsDisable(allValuesExist);
  }, [watch()]);

  const handleSaveClick = useCallback(() => {
    API.studentGroupInfo
      .CreateStudyGroup({
        ...(form.getValues() as StudentGroupInfo),
        class_id: Number(form.getValues('class_id')),
        subject_id: Number(form.getValues('subject_id')),
      })
      .then((res) => {
        if (res.status_code === 201) {
          showMessage('สร้างกลุ่มเรียนสำเร็จ', 'success');
          navigate({ to: '/teacher/student-group' });
        } else {
          showMessage('สร้างกลุ่มเรียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      })
      .catch(() => {
        showMessage('สร้างกลุ่มเรียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
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

              <div className="mt-5 grid grid-cols-9 gap-5">
                <div className="col-span-3 w-full">
                  <label htmlFor="">
                    <span className="text-red-500">*</span>ชั้น
                  </label>
                  <Controller
                    control={control}
                    name="year"
                    render={({ field: { onChange, value } }) => {
                      // map ชื่อไปก่อน เพราะ api ไม่ได้ส่ง id มา
                      const selectedValue = optionYear.find(
                        (opt) => opt.label === String(value),
                      )?.label;
                      return (
                        <CWSelectValue
                          onChange={onChange}
                          options={optionYear}
                          value={selectedValue || ''}
                          required={true}
                          className="col-span-2 w-full"
                        />
                      );
                    }}
                  />
                </div>
                <div className="col-span-3 w-full">
                  <label htmlFor="">
                    <span className="text-red-500">*</span>วิชา
                  </label>
                  <Controller
                    control={control}
                    name="subject_id"
                    render={({ field: { onChange, value } }) => {
                      const selectedValue = optionSubject.find(
                        (opt) => opt.id === Number(value),
                      )?.id;
                      return (
                        <CWSelectValue
                          onChange={onChange}
                          options={optionSubject.map((item) => ({
                            label: `${item.name}`,
                            value: item.id,
                          }))}
                          value={selectedValue || ''}
                          required={true}
                          className="col-span-2 w-full"
                          disabled={optionSubject.length === 0}
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
                      const selectedValue = optionClasses.find(
                        (opt) => opt.id === Number(value),
                      )?.id;
                      return (
                        <CWSelectValue
                          onChange={onChange}
                          options={optionClasses.map((item) => ({
                            label: `${item.year}/${item.name}`,
                            value: item.id,
                          }))}
                          value={selectedValue || ''}
                          required={true}
                          className="col-span-2 w-full"
                          disabled={optionClasses.length === 0}
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
                onClick={handleSaveClick}
                titleName="รหัสกลุ่มเรียน"
                statusValue="enabled"
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
