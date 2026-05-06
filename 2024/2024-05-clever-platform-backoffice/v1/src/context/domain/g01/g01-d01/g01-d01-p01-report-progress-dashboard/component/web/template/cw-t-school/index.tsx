import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CWWhiteBox from '@global/component/web/cw-white-box';
import IconGroup from '@core/design-system/library/component/icon/IconGroup';
import IconBook from '@core/design-system/library/component/icon/IconBook';
import IconActivity from '@core/design-system/library/component/icon/IconActivity';
import CWButton from '@component/web/cw-button';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWSelect from '@component/web/cw-select';
import BarChartTemplate from '../../../organism/cw-o-bar-chart';
import API from '@domain/g01/g01-d01/local/api';
import { ChildDataType } from '@domain/g01/g01-d01/g01-d01-p01-report-progress-dashboard';
import {
  ClassStat,
  FilterOption,
  TeacherData,
} from '@domain/g01/g01-d01/local/api/group/progress-dashboard/restapi/type';
import CWInput from '@component/web/cw-input';
import { useLoadingApiStore } from '@store/useLoadingApiStore';
import CWALoadingOverlay from '@component/web/atom/cw-a-loading-overlay';

const CHART_ID_PREFIX = 'T_STUDENT_INFOMATION_BARCHART';

type SchoolTemplateProps = {
  reportType: string;
  startDate: string;
  endDate: string;
  setChildData: Dispatch<SetStateAction<ChildDataType>>;
  selectedProgressScope: any;
  selectedSchool?: string;
  onFetchSuccess?: () => void;
};

export interface ExportSchoolDataType {
  title: string;
  progress?: number;
}

const SchoolTemplate = ({
  setChildData,
  startDate,
  endDate,
  reportType,
  selectedSchool: selectedSchoolLabel,
  selectedProgressScope,
  onFetchSuccess,
}: SchoolTemplateProps) => {
  const loadingApiStore = useLoadingApiStore();
  const [selectedSchool, setSelectedSchool] = useState<FilterOption | undefined>();
  const [schoolStaticData, setSchoolStaticData] = useState<any>([]);

  const [teacherStaticData, setTeacherStaticData] = useState<TeacherData[]>([]);
  const [teacherStaticDataLoading, setTeacherStaticDataLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState<string>();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number>();

  const [allClassLevel, setAllClassLevel] = useState<any>([]);
  const [allAcademicYear, setAllAcademicYear] = useState<any>([]);

  // Filter from Progress Component
  const [scopeFilter, setScopeFilter] = useState<any>();

  const [isFetching, setIsFetching] = useState(false);

  // Class Level
  useEffect(() => {
    getAllClassLevel();
  }, []);

  const getAllClassLevel = async () => {
    const resLevel = await API.progressDashboard.GetClassLevel();
    if (resLevel.status_code === 200) {
      setAllClassLevel(
        resLevel.data.map((d) => ({ label: d.short_name, value: d.short_name })),
      );
    }
  };

  // Selected School
  useEffect(() => {
    if (!selectedProgressScope) {
      return;
    }
    const filter = {};
    selectedProgressScope.scopeList.forEach((s: any, i: number) => {
      if (['school', 'lao-school', 'doe-school', 'etc-school'].includes(s)) {
        Object.assign(filter, {
          school: selectedProgressScope.selectedValues[i],
        });
      } else {
        Object.assign(filter, {
          [s]: selectedProgressScope.selectedValues[i],
        });
      }
    });
    setScopeFilter(filter);
  }, [selectedProgressScope]);

  useEffect(() => {
    if (scopeFilter?.school) {
      getSchoolList();
    }
  }, [scopeFilter?.school]);

  const getSchoolList = async () => {
    const resSchool = await API.progressDashboard.GetFilterSchool({
      type: reportType,
      page: 1,
      limit: -1,
    });

    if (resSchool.status_code !== 200) {
      console.error('Get School Error!');
      return;
    }

    const filterArrayData = resSchool.data as unknown as FilterOption[];
    const matchSchool = filterArrayData.find(
      (sc: FilterOption) => sc.name == scopeFilter?.school,
    );
    setSelectedSchool(matchSchool);

    if (!matchSchool) {
      console.log('No selected School!');
      return;
    }

    const resAcademicYear = await API.progressDashboard.GetAcademicYearRange({
      school_id: matchSchool.id,
      page: 1,
      limit: -1,
    });

    if (resAcademicYear.status_code !== 200) {
      console.error('Get AcademicYear Error!');
      return;
    }
    setAllAcademicYear(
      resAcademicYear.data.map((ay) => ({
        value: ay.name,
        label: ay.name,
      })),
    );
  };

  const getTeacherStudentData = async () => {
    const matchData: Array<ExportSchoolDataType> = [];
    let tData: TeacherData[] | undefined = undefined;
    let sData: ClassStat[] | undefined = undefined;

    try {
      setIsFetching(true);

      const fetchDataSchool = async () => {
        if (!selectedSchool || !selectedClass || !selectedAcademicYear) return;

        const resSS = await API.progressDashboard.GetSchoolClassStat({
          schoolId: selectedSchool.id,
          'start-date': startDate,
          'end-date': endDate,
          page: 1,
          limit: -1,
          'academic-year': selectedAcademicYear,
          year: selectedClass,
        });

        if (resSS.status_code === 200) {
          sData = resSS.data as unknown as ClassStat[];
          setSchoolStaticData(sData);
        }
      };

      const fetchDataTeacher = async () => {
        if (!selectedSchool) return;

        try {
          setTeacherStaticDataLoading(true);

          const resTeacher = await API.progressDashboard.GetTeacher({
            schoolId: selectedSchool.id,
            'start-date': startDate,
            'end-date': endDate,
            page: 1,
            limit: -1,
          });

          if (resTeacher.status_code === 200) {
            tData = resTeacher.data as unknown as TeacherData[];

            const allResult = await Promise.all(
              resTeacher.data.map((v: any) =>
                API.progressDashboard.GetTeacherClassStat({
                  schoolId: selectedSchool.id,
                  teacherId: v.teacher_id,
                  'start-date': startDate,
                  'end-date': endDate,
                  page: 1,
                  limit: -1,
                }),
              ),
            );

            allResult.forEach((r, i) => {
              if ('data' in r) {
                tData![i].classData = r.data;
              }
            });

            setTeacherStaticData(tData);
          }
        } catch (err) {
          console.error('fetchDataTeacher error', err);
          throw err;
        } finally {
          setTeacherStaticDataLoading(false);
          onFetchSuccess?.();
        }
      };

      await fetchDataSchool();
      await fetchDataTeacher();

      setChildData((prev) => ({
        ...prev,
        SchoolTemplateData: matchData,
        TeacherData: tData,
        StudentData: {
          selectedClass,
          year: selectedAcademicYear,
          studentData: sData,
          chartID: CHART_ID_PREFIX,
        },
        StudentChartImg: undefined,
      }));
    } catch (err) {
      console.error('getTeacherStudentData error', err);
      throw err; // จะโยน error ต่อถ้าอยาก handle ด้านนอก
    } finally {
      setIsFetching(false);
      onFetchSuccess?.();
    }
  };

  useEffect(() => {
    getTeacherStudentData();
  }, [selectedSchool, selectedClass, selectedAcademicYear, reportType]);

  return (
    <CWWhiteBox className="">
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-bold">ข้อมูลโรงเรียน </h2>
        <CWInput
          className="w-64 text-gray-400"
          value={selectedSchoolLabel ?? '-'}
          disabled
        />
        <h2 className="text-base font-bold">ข้อมูลครู</h2>
        {teacherStaticData.map((teacher: any, i: number) => (
          <div key={`teachertab-${i}`} className="relative">
            <CWALoadingOverlay
              visible={
                loadingApiStore.apiLoadingList.length > 0 || teacherStaticDataLoading
              }
            />
            <h2 className="mb-4 text-base font-bold">{teacher.teacher_name}</h2>
            <div className="flex flex-row gap-5">
              <div className="flex w-2/6 flex-row items-center gap-5 rounded-md border bg-white px-3 py-5">
                <IconGroup />
                <div>
                  <p>จำนวนห้องเรียนที่ดูแล</p>
                  <p>{teacher.class_room_count} ห้อง</p>
                </div>
              </div>
              <div className="flex w-2/6 flex-row items-center gap-5 rounded-md border bg-white px-3 py-5">
                <IconActivity />
                <div>
                  <p>ความก้าวหน้าเฉลี่ยของห้องที่ดูแล</p>
                  <p>{teacher.progress} %</p>
                </div>
              </div>
              <div className="flex w-2/6 flex-row items-center gap-5 rounded-md border bg-white px-3 py-5">
                <IconBook />
                <div>
                  <p>จำนวนการบ้านที่ส่ง</p>
                  <p>{teacher.homework_count} ข้อ</p>
                </div>
              </div>

              <div className="flex w-1/6 flex-row items-center gap-5">
                <CWButton
                  className="flex w-36 flex-row-reverse"
                  onClick={() => {
                    const contentElement = document.getElementById(
                      `content-${teacher.teacher_id}`,
                    );
                    if (contentElement) {
                      contentElement.style.display =
                        contentElement.style.display === 'none' ? 'block' : 'none';
                    }
                  }}
                  icon={<IconEye />}
                  title={'แสดงข้อมูล'}
                />
              </div>
            </div>
            <div id={`content-${teacher.teacher_id}`} style={{ display: 'none' }}>
              <br />

              <br />
              <p className="mb-5 mt-5 font-bold">{teacher.teacher_name}</p>

              <div className="mt-2 flex flex-row items-center">
                <div
                  style={{
                    left: '-40px',
                    transform: 'rotate(-90deg)',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    width: '5%',
                  }}
                >
                  - ความก้าวหน้า -
                </div>
                <div className="w-full flex-1">
                  <BarChartTemplate
                    data={teacher.classData.map((c: ClassStat) => c.progress)}
                    categories={teacher.classData.map((c: ClassStat) => c.scope)}
                    height={300}
                  />
                </div>
              </div>
            </div>
            <br />
          </div>
        ))}
        {/*!selectedSchool && <p className="mb-5 mt-5 text-center">กรุณาเลือกโรงเรียน</p>*/}
        {teacherStaticData.length == 0 && (
          <p className="mb-5 mt-5 text-center">ไม่พบข้อมูล</p>
        )}

        <h2 className="text-xl font-bold">ข้อมูลห้องเรียน</h2>

        <div className="gap-5 rounded-md border bg-white px-3 py-5 shadow-md">
          <div className="flex flex-row gap-3">
            <div className="w-[200px]">
              <p>ปีการศึกษา</p>
              <CWSelect
                className="w-30 pt-4"
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                options={allAcademicYear}
              />
            </div>
            <div className="w-[200px]">
              <p>ระดับชั้น</p>
              <CWSelect
                className="w-30 pt-4"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={allClassLevel}
              />
            </div>
          </div>
          {schoolStaticData && (
            <>
              <div className="flex flex-row">
                <div style={{ width: '5%' }}></div>
                <p className="mb-5 mt-5 font-bold">{selectedSchool?.name}</p>
              </div>
              <div className="flex flex-row">
                <div style={{ width: '5%' }}></div>
                {/* <div className="w-full">
                  <div className="mb-5 flex w-2/6 flex-row items-center gap-5 rounded-md border bg-white px-3 py-5 shadow-md">
                    <IconActivity />
                    <div>
                      <p>ความก้าวหน้าเฉลี่ยของห้องที่ดูแล</p>
                      <p>{schoolStaticData.progress || 0}%</p>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="flex flex-row items-center">
                <div
                  style={{
                    left: '-40px',
                    transform: 'rotate(-90deg)',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    width: '5%',
                  }}
                >
                  - ความก้าวหน้า -
                </div>
                <div className="relative w-full flex-1">
                  <CWALoadingOverlay visible={isFetching} />
                  <BarChartTemplate
                    id={CHART_ID_PREFIX}
                    data={schoolStaticData.map((c: ClassStat) => c.progress)}
                    categories={schoolStaticData.map((c: ClassStat) => c.scope)}
                    height={300}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CWWhiteBox>
  );
};

export default SchoolTemplate;
