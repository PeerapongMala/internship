// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import Tabs from '@component/web/cw-tabs';
import { Lesson, Status, StatusToggle } from '../local/type';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import showMessage from '@global/utils/showMessage';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';
import CWButtonSwitch from '@component/web/cw-button-switch';
import LessonRestAPI from '../local/api/group/lesson/restapi';
import CWTitleBack from '@component/web/cw-title-back';
import IconGroup from '@core/design-system/library/component/icon/IconGroup';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};
const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const modalAdditem = useModal();

  const { classId }: { classId: string } = useParams({ strict: false });

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<Lesson[]>([]);
  const [records, setRecords] = useState<Lesson[]>([]);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [courses, setCourses] = useState<{ value: string; label: string }[]>([]);
  const [subjects, setSubjects] = useState<{ value: string; label: string }[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedExtra, setSelectedExtra] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming we're working with class ID 1 for now

        const coursesData = await LessonRestAPI.GetCourses(classId);
        setCourses(
          coursesData.map((course) => ({
            value: course.id,
            label: course.name,
          })),
        );

        const subjectsData = await LessonRestAPI.GetSubjects(classId);
        setSubjects(
          subjectsData.map((subject) => ({
            value: subject.id,
            label: subject.name,
          })),
        );
      } catch (error) {
        console.error('Failed to fetch data:', error);
        showMessage('ไม่สามารถโหลดข้อมูลได้', 'error');
      }
    };

    fetchData();
  }, []);

  const fetchLessons = async () => {
    try {
      setFetching(true);

      // Add query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());

      if (statusFilter !== undefined) {
        queryParams.append('is_enabled', statusFilter.toString());
      }
      if (selectedCourse) {
        queryParams.append('curriculum_group_id', selectedCourse);
      }
      if (selectedSubject) {
        queryParams.append('subject_id', selectedSubject);
      }
      if (typeof selectedExtra !== 'undefined') {
        queryParams.append('is_extra', selectedExtra ? 'true' : 'false');
      }

      const response = await LessonRestAPI.GetLessons(
        classId,
        pagination.page,
        pagination.limit,
        statusFilter,
        selectedCourse,
        selectedSubject,
        undefined,
        undefined,
        selectedExtra,
      );

      const transformedData: Lesson[] = response.data.map((item) => ({
        id: item.lesson_id,
        subject_id: item.subject_id,
        course: item.curriculum_group,
        subject_name: item.subject,
        seed_year_name: item.year,
        lesson_name: item.lesson_name,
        is_enabled: item.is_enabled,
        is_extra: item.is_extra,
      }));

      setRecords(transformedData);
      setPagination((prev) => ({
        ...prev,
        total_count: response._pagination.total_count,
      }));
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      showMessage('ไม่สามารถโหลดข้อมูลบทเรียนได้', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [
    pagination.page,
    pagination.limit,
    statusFilter,
    selectedCourse,
    selectedSubject,
    selectedExtra,
  ]);

  const handleToggleStatus = async (id: number, is_enabled: boolean) => {
    try {
      console.log('handleToggleStatus', id);
      console.log('Before toggle:', records);

      // Update server first
      await LessonRestAPI.ToggleStatus(classId, id, is_enabled);

      // Then fetch new data

      console.log('After toggle:', records);
    } catch (error) {
      console.error('Failed to toggle status:', error);
      showMessage('ไม่สามารถเปลี่ยนสถานะได้', 'error');
      await fetchLessons();
    }
  };

  const columnDefs = useMemo<DataTableColumn<Lesson>[]>(() => {
    const finalDefs: DataTableColumn<Lesson>[] = [
      {
        accessor: 'edit',
        title: 'ดูรายละเอียด',
        textAlign: 'center',
        resizable: true,
        render: ({ id, subject_id }) => (
          <Link
            to="/teacher/lesson/$classId/subject/$subjectId/$lessonId"
            params={{ classId, subjectId: subject_id, lessonId: id }}
            className="flex items-center justify-center"
          >
            <IconEye />
          </Link>
        ),
      },
      {
        accessor: 'index',
        title: '#',
        width: 80,
        render: (record, index) => {
          return index + 1;
        },
      },
      {
        accessor: 'id',
        title: 'รหัสบทเรียน',
        width: 120,
        textAlign: 'center',
        resizable: true,
        render(record, index) {
          return (
            <div className="flex items-center justify-center">
              <p>{record.id}</p>
            </div>
          );
        },
      },
      { accessor: 'course', title: 'หลักสูตร', resizable: true },
      { accessor: 'subject_name', title: 'วิชา', resizable: true },
      { accessor: 'seed_year_name', title: 'ชั้นปี', resizable: true },
      { accessor: 'lesson_name', title: 'บทเรียนหลัก', resizable: true },
      {
        accessor: 'is_extra',
        title: 'ประเภทการเข้าถึง',
        render: ({ is_extra }) => isExtraToString(is_extra),
      },

      {
        accessor: 'is_enabled',
        title: 'เปิดใช้บทเรียน',
        render: ({ id, is_enabled }) => (
          <CWButtonSwitch
            initialState={is_enabled}
            onChange={() => handleToggleStatus(id, !is_enabled)}
          />
        ),
      },
      {
        accessor: 'viewextra',
        title: 'กลุ่มเรียน',
        render: ({ id, subject_id, is_extra }) =>
          is_extra ? (
            <Link
              to="/teacher/lesson/$classId/subject/$subjectId/extra/$extraId"
              params={{ classId, subjectId: subject_id, extraId: id }}
            >
              <IconGroup />
            </Link>
          ) : (
            <IconGroup className="cursor-not-allowed opacity-20" />
          ),
      },
    ];

    return finalDefs;
  }, [statusFilter]);

  const handleSelectionChange = (selectedRows: SetStateAction<Lesson[]>) => {
    setSelectedRecords(selectedRows);
  };

  const isExtraToString = (value: boolean) => {
    return value ? 'Extra' : 'Standard';
  };

  const filteredRecords = useMemo(() => {
    return statusFilter !== undefined
      ? records.filter((record) => record.is_enabled === statusFilter)
      : records;
  }, [statusFilter, records]);

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน' },
          { label: 'จัดการห้องเรียน' },
          { label: 'จัดการบทเรียน' },
        ]}
      />
      <div className="mt-5">
        <CWSchoolCard name="โรงเรียนสาธิตมัธยม" code="000000001" subCode="AA109" />
      </div>

      <div className="mb-5 w-full">
        <div className="my-5">
          <div>
            {/* <h1 className="text-[28px] font-bold">บทเรียนหลัก</h1> */}
            <CWTitleBack label="บทเรียนหลัก" href="../" />
          </div>

          <p className="mt-2">{records.length} บทเรียน</p>
        </div>
        <div className="flex gap-5 xl:w-[1100px]">
          <CWSelect
            title="หลักสูตร"
            className="w-[250px]"
            options={courses}
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />
          <CWSelect
            title="วิชา"
            className="w-[250px]"
            options={subjects}
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />
          <CWSelect
            title="ประเภทการเข้าถึง"
            className="w-[250px]"
            options={[
              { label: 'Extra', value: true },
              { label: 'Standard', value: false },
            ]}
            value={selectedExtra}
            onChange={(e) => {
              if (e.target.value == '') {
                setSelectedExtra(undefined);
                setPagination((prev) => ({ ...prev, page: 1 }));
              } else {
                setSelectedExtra(e.target.value == 'true');
                setPagination((prev) => ({ ...prev, page: 1 }));
              }
            }}
          />
        </div>

        <div className="my-5">
          <Tabs
            currentTab={statusFilter}
            setCurrentTab={(value) => setStatusFilter(value)}
            tabs={[
              { label: 'ทั้งหมด', value: undefined },
              { label: 'ใช้งาน', value: true },
              { label: 'ไม่ใช้งาน', value: false },
            ]}
          />
        </div>

        <CWWhiteBox>
          <div className="w-full">
            <div className="mt-5 w-full">
              {records.length > 0 || fetching ? (
                <DataTable
                  height={'calc(100vh - 350px)'}
                  className="table-hover whitespace-nowrap"
                  columns={columnDefs}
                  records={filteredRecords}
                  totalRecords={pagination.total_count}
                  recordsPerPage={pagination.limit}
                  page={pagination.page}
                  onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                  onRecordsPerPageChange={(limit) =>
                    setPagination((prev) => ({ ...prev, limit, page: 1 }))
                  }
                  recordsPerPageOptions={pageSizeOptions}
                  paginationText={({ from, to, totalRecords }) =>
                    `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
                  }
                  fetching={fetching}
                  selectedRecords={selectedRecords}
                  onSelectedRecordsChange={handleSelectionChange}
                />
              ) : (
                <DataTable
                  height={'calc(100vh - 350px)'}
                  className="table-hover whitespace-nowrap"
                  columns={columnDefs}
                  records={[]}
                  noRecordsText="ไม่พบข้อมูล"
                  withTableBorder
                  withColumnBorders
                />
              )}
            </div>
          </div>
        </CWWhiteBox>
      </div>
    </div>
  );
};

export default DomainJSX;
