// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { useCallback, useEffect, useState } from 'react';

import { DataTable, DataTableColumn } from 'mantine-datatable';

import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWMTab from '@component/web/molecule/cw-m-tab';
import CWInputSearch from '@component/web/cw-input-search';
import CWSelect from '@component/web/cw-select';
import CWSchoolCard from '@component/web/cw-school-card';
import CWInput from '@component/web/cw-input';
import API from '../local/api';
import { toDateTimeTH } from '@global/utils/date';
import {
  TeacherStudentParamSearch,
  TeacherStudentResponse,
} from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import ModalAcademicYear from './component/organism/ModalAcademicYear';
import ModalClass from './component/organism/ModalClass';
import { GetAcademicYearRangesResponse } from '../local/api/group/academic-year/type';
import showMessage from '@global/utils/showMessage.ts';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { Thai } from 'flatpickr/dist/l10n/th';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import CwProgressBar from '@component/web/cw-progress-bar';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { formatTimeString } from '@global/utils/format/time';
import { SchoolResponse } from '@domain/g03/g03-d04/local/api/group/school/type.ts';
import StoreGlobalPersist from '@store/global/persist';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import CWModalSelectClass from '@component/web/organism/cw-o-modal-select-class';
import CWClassSelector from '@component/web/organism/cw-o-select-class-student';
import { getClassData } from '@global/utils/store/get-class-data';
dayjs.extend(buddhistEra);

const DomainJSX = () => {
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [open, setOpen] = useState('');
  const [isFetching, setFetching] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [records, setRecords] = useState<TeacherStudentResponse[]>([]);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [optionCurriculumGroups, setOptionCurriculumGroups] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionSubjects, setOptionSubjects] = useState<
    { label: string; value: string }[]
  >([]);
  const [optionLessons, setOptionLessons] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [optionSubLessons, setOptionSubLessons] = useState<
    { label: string; value: string }[]
  >([]);
  const { userData }: { userData: IUserData } = StoreGlobalPersist.StateGet(['userData']);
  const { targetData } = StoreGlobalPersist.StateGet(['targetData']);
  const schoolId = userData?.school_id ?? targetData?.school_id;
  const [selectedValueDateRange, setSelectedValueDateRange] =
    useState<GetAcademicYearRangesResponse>();
  const [openModalAcademicYear, setOpenModalAcademicYear] = useState(false);
  const [openModalClass, setOpenModalClass] = useState(false);
  const [schoolData, setSchoolData] = useState<SchoolResponse>();
  const [filters, setFilters] = useState<Partial<TeacherStudentParamSearch>>();
  const classDataFilter = getClassData();
  const classData = getClassData();

  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...classData }));
  }, [classData]);

  const onClose = () => {
    setOpen('');
  };

  const [dateRange, setDateRange] = useState<{ startDate: Date; endDate: Date }>();

  const handleDownload = () => {
    // console.log('Downloading data from:', startDate, 'to:', endDate);
  };

  useEffect(() => {
    if (selectedValueDateRange) {
      setDateRange({
        startDate: dayjs(selectedValueDateRange.start_date).toDate(),
        endDate: dayjs(selectedValueDateRange.end_date).toDate(),
      });
    }
  }, [selectedValueDateRange]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const res = await API.school.GetSchoolId();
        if (res.status_code === 200) {
          setSchoolData(res.data);
        }
      } catch (error) {
        showMessage(`Failed to fetch schools: ${error}`, 'error');
      }
    };

    fetchSchoolData();
  }, []);

  useEffect(() => {
    if (!schoolData?.school_id) return;
    if (!schoolId) return;
    setFetching(true);
    API.teacherStudent
      .GetListStat({
        page: page,
        limit: pageSize,
        startDate: dateRange?.startDate
          ? dayjs(dateRange.startDate).locale('th').format('YYYY-MM-DD')
          : undefined,
        endDate: dateRange?.endDate
          ? dayjs(dateRange.endDate).locale('th').format('YYYY-MM-DD')
          : undefined,
        search: filters?.search,
        curriculum_group_id: filters?.curriculum_group_id,
        subject_id: filters?.subject_id,
        lesson_id: filters?.lesson_id,
        sub_lesson_id: filters?.sub_lesson_id,
        ...classDataFilter,
        school_id: schoolData?.school_id ?? schoolId,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setTotalRecord(res._pagination.total_count);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setFetching(false);
        }, 200);
      });
  }, [page, pageSize, filters, dateRange, schoolData, classDataFilter]);

  useEffect(() => {
    API.curriculumGroups.GetDropdownCurriculumGroups().then((res) => {
      if (res.status_code === 200 && res.data && Array.isArray(res.data)) {
        setOptionCurriculumGroups(
          res.data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    if (filters?.curriculum_group_id) {
      API.curriculumGroups
        .GetDropdownSubjects(filters?.curriculum_group_id)
        .then((res) => {
          if (res.status_code === 200 && res.data && Array.isArray(res.data)) {
            setOptionSubjects(
              res.data.map((item) => ({
                label: item.name,
                value: item.id,
              })),
            );
          }
        });
    }
  }, [filters?.curriculum_group_id]);

  useEffect(() => {
    if (filters?.subject_id) {
      API.curriculumGroups.GetDropdownLessons(filters?.subject_id).then((res) => {
        if (res.status_code === 200 && res.data && Array.isArray(res.data)) {
          setOptionLessons(
            res.data.map((item) => ({
              label: item.name,
              value: item.id,
            })),
          );
        }
      });
    }
  }, [filters?.subject_id]);

  useEffect(() => {
    if (filters?.lesson_id) {
      API.curriculumGroups.GetDropdownSubLessons(filters?.lesson_id).then((res) => {
        if (res.status_code === 200 && res.data && Array.isArray(res.data)) {
          setOptionSubLessons(
            res.data.map((item) => ({
              label: item.name,
              value: item.id,
            })),
          );
        }
      });
    }
  }, [filters?.lesson_id]);

  const rowColumns: DataTableColumn<TeacherStudentResponse>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_, index) => index + 1,
    },
    {
      title: 'รหัสนักเรียน',
      accessor: 'student_id',
    },
    {
      title: 'ปีการศึกษา',
      accessor: 'academic_year',
    },
    {
      title: 'ชั้นปี',
      accessor: 'class_year',
      width: 150,
    },
    {
      title: 'ห้อง',
      accessor: 'class_name',
      width: 100,
      render: ({ class_name }) => {
        return class_name ?? '-';
      },
    },
    {
      title: 'คำนำหน้า',
      accessor: 'student_title',
    },
    {
      title: 'ชื่อ',
      accessor: 'student_first_name',
      width: 250,
    },
    {
      title: 'สกุล',
      accessor: 'student_last_name',
      width: 250,
    },
    {
      title: 'ด่านที่ผ่าน (ด่าน)',
      accessor: 'total_passed_level',
      render: (record) => {
        return (
          <div className="flex flex-col">
            <span className="text-right">
              {record.total_passed_level}/{record.total_level}
            </span>
            <div className="ml-auto w-16">
              <CwProgressBar
                score={record.total_passed_level}
                total={record.total_level}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: 'ด่านที่ผ่าน (คะแนน)',
      accessor: 'pass_score',
      render: (record) => {
        return (
          <div className="flex flex-col">
            <span className="text-right">
              {record.total_passed_star}/{record.total_star}
            </span>
            <div className="ml-auto w-16">
              <CwProgressBar score={record.total_passed_star} total={record.total_star} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'ทำข้อสอบ (ครั้ง)',
      accessor: 'total_attempt',
    },
    {
      title: 'เวลาเฉลี่ย/ข้อ',
      accessor: 'avg_time_used',
      render: ({ avg_time_used }) =>
        avg_time_used ? formatTimeString(avg_time_used) : '-',
    },
    {
      title: 'ใช้งานล่าสุด',
      accessor: 'student_last_login',
      width: 150,
      render: ({ student_last_login }) => {
        return student_last_login ? toDateTimeTH(student_last_login) : '-';
      },
    },
    {
      title: 'อัพโหลดล่าสุด',
      accessor: 'last_played',
      width: 150,
      render: ({ last_played }) => {
        return last_played ? toDateTimeTH(last_played) : '-';
      },
    },
  ];

  const searchGetListStat = useCallback(() => {
    setFetching(true);

    API.teacherStudent
      .GetListStat({
        page: page,
        limit: pageSize,
        startDate: dateRange?.startDate
          ? dayjs(dateRange?.startDate).locale('th').format('YYYY-MM-DD')
          : undefined,
        endDate: dateRange?.endDate
          ? dayjs(dateRange?.endDate).locale('th').format('YYYY-MM-DD')
          : undefined,
        ...filters,
        school_id: schoolData?.school_id,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setTotalRecord(res._pagination.total_count);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setFetching(false);
        }, 200);
      });
  }, [page, pageSize, filters, dateRange, classDataFilter]);

  const handleCloseModalAcademicYear = () => {
    setOpenModalAcademicYear(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          {
            label: 'การเรียนการสอน',
            href: '/',
            disabled: true,
          },
          {
            label: 'ข้อมูลนักเรียน',
          },
        ]}
      />
      <CWSchoolCard
        name={schoolData?.school_name || '-'}
        code={schoolData?.school_id.toString() || '-'}
        subCode={schoolData?.school_code || '-'}
        image={schoolData?.image_url || '/public/logo192.png'}
      />
      <CWMTab
        tabs={[
          // {
          //   name: 'สถิตินักเรียนรายบทเรียน',
          //   to: '/teacher/student',
          // },
          {
            name: 'สถิตินักเรียนรายคน',
            to: '/teacher/student/all-student',
          },
          {
            name: 'จัดการบัญชี & พิน',
            to: '/teacher/student/account-pin',
          },
        ]}
      />
      <div className="w-full rounded bg-white p-5 shadow">
        <div className="mb-5 flex justify-between">
          <div className="flex">
            <div className="w-fit">
              <CWInputSearch
                placeholder="ค้นหา"
                onClick={() => {
                  searchGetListStat();
                }}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                }}
                value={filters?.search}
              />
            </div>
          </div>
        </div>

        <div className="my-5 flex">
          <div className={'col-span-2 ml-2 grid grid-cols-4 gap-2'}>
            <CWClassSelector classes={classDataFilter} />
            <button
              type="button"
              className="btn btn-primary flex gap-1"
              onClick={() => setOpenModalAcademicYear(true)}
            >
              {'เลือกช่วงเวลาที่เล่น'}
            </button>
            <div className="w-60">
              <WCAInputDateFlat
                options={{
                  mode: 'range',
                  dateFormat: 'd/m/Y',
                  locale: {
                    ...Thai,
                  },
                }}
                value={
                  selectedValueDateRange
                    ? [
                        new Date(selectedValueDateRange.start_date).toISOString(),
                        new Date(selectedValueDateRange.end_date).toISOString(),
                      ]
                    : undefined
                }
                onChange={(dates) => {
                  const newStartDate = dates[0];
                  const newEndDate = dates[1];

                  setDateRange({
                    startDate: newStartDate,
                    endDate: newEndDate,
                  });

                  if (selectedValueDateRange && selectedValueDateRange.id !== undefined) {
                    setSelectedValueDateRange({
                      ...selectedValueDateRange,
                      start_date: dayjs(newStartDate).format('YYYY-MM-DD'),
                      end_date: dayjs(newEndDate).format('YYYY-MM-DD'),
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="mb-5 flex">
          <div className="col-span-4 grid w-full grid-cols-4 gap-2">
            <CWSelect
              onChange={(e) => {
                setFilters({
                  ...filters,
                  curriculum_group_id: e.target.value,
                  subject_id: undefined,
                  lesson_id: undefined,
                  sub_lesson_id: undefined,
                });
              }}
              options={optionCurriculumGroups}
              value={filters?.curriculum_group_id}
              title="สังกัดวิชา"
            />
            <CWSelect
              onChange={(e) => {
                setFilters({
                  ...filters,
                  subject_id: e.target.value,
                  lesson_id: undefined,
                  sub_lesson_id: undefined,
                });
              }}
              options={optionSubjects}
              value={filters?.subject_id}
              title="วิชา"
              disabled={!filters?.curriculum_group_id}
            />
            <CWSelect
              onChange={(e) => {
                setFilters({
                  ...filters,
                  lesson_id: e.target.value,
                  sub_lesson_id: undefined,
                });
              }}
              options={optionLessons}
              value={filters?.lesson_id}
              title="บทเรียน"
              disabled={!filters?.subject_id}
            />
            <CWSelect
              onChange={(e) => {
                setFilters({ ...filters, sub_lesson_id: e.target.value });
              }}
              options={optionSubLessons}
              value={filters?.sub_lesson_id}
              title="บทเรียนย่อย"
              disabled={!filters?.lesson_id}
            />
          </div>
        </div>

        <div className="datatables">
          <DataTable
            className="z-0"
            columns={rowColumns}
            records={records}
            styles={{
              root: { minHeight: '300px' },
            }}
            page={page}
            totalRecords={totalRecord}
            onPageChange={setPage}
            recordsPerPage={pageSize}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            paginationText={({ from, totalRecords }) => {
              const currentPage = Math.ceil(from / pageSize);
              const totalPage = Math.ceil(totalRecords / pageSize);
              return `แสดงหน้าที่ ${currentPage} จากทั้งหมด ${totalPage} หน้า`;
            }}
            fetching={isFetching}
            highlightOnHover
            withTableBorder
            withColumnBorders
            loaderType="oval"
            loaderBackgroundBlur={4}
          />
        </div>
      </div>

      <ModalAcademicYear
        open={openModalAcademicYear}
        onClose={handleCloseModalAcademicYear}
        setSelectedValueDateRange={setSelectedValueDateRange}
        setDateRange={setDateRange}
        schoolId={schoolData?.school_id ?? Number(userData?.school_id)}
      />
    </div>
  );
};

export default DomainJSX;
