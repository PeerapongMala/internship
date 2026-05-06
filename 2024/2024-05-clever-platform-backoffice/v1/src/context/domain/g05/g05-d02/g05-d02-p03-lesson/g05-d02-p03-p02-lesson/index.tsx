// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import Tabs from '@component/web/cw-tabs';
import { Lesson } from '../local/type';

import IconEye from '@core/design-system/library/component/icon/IconEye';
import showMessage from '@global/utils/showMessage';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWPagination from '@component/web/cw-pagination';
import LessonRestAPI from '../local/api/group/lesson/restapi';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import ScreenTemplateWithoutHeader from '@domain/g05/local/component/web/template/cw-t-line-layout-without-text';
import CWTitleBack from '@component/web/cw-title-back';
import { TSchoolData } from '../../local/types';
import API from '@domain/g05/g05-d02/local/api';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};
const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      setIsMobile(false);
      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
        setIsMobile(true);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const {
    studentId,
    classId,
  }: { studentId: string; classId: string; is_parent?: boolean } = useParams({
    from: '/line/parent/clever/$studentId/$classId',
  });

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<Lesson[]>([]);
  const [records, setRecords] = useState<Lesson[]>([]);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [courses, setCourses] = useState<{ value: string; label: string }[]>([]);
  const [subjects, setSubjects] = useState<{ value: string; label: string }[]>([]);

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [schoolData, setSchoolData] = useState<TSchoolData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming we're working with class ID 1 for now

        const coursesData = await LessonRestAPI.GetCourses(classId, true);

        setCourses(
          coursesData.map((course) => ({
            value: course.id,
            label: course.name,
          })),
        );

        const subjectsData = await LessonRestAPI.GetSubjects(classId, true);
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
    fetchSchoolData();
  }, []);

  const fetchLessons = async () => {
    try {
      setFetching(true);

      const response = await LessonRestAPI.GetLessons(
        classId,
        pagination.page,
        pagination.limit,
        statusFilter,
        selectedCourse,
        selectedSubject,
        undefined,
        true,
      );

      const transformedData: Lesson[] = response.data.map((item) => ({
        id: item.lesson_id,
        subject_id: item.subject_id,
        course: item.curriculum_group,
        subject_name: item.subject,
        seed_year_name: item.year,
        lesson_name: item.lesson_name,
        is_enabled: item.is_enabled,
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
  }, [pagination.page, pagination.limit, statusFilter, selectedCourse, selectedSubject]);

  const handleToggleStatus = async (id: number, is_enabled: boolean) => {
    try {
      console.log('handleToggleStatus', id);
      console.log('Before toggle:', records);

      // Update server first
      await LessonRestAPI.ToggleStatus(classId, id, is_enabled);

      // Then fetch new data
      await fetchLessons();

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
        render: ({ id, subject_id }) => (
          <Link
            to="/line/parent/clever/$studentId/$classId/subject/$subjectId/$lessonId"
            params={{
              studentId,
              classId,
              subjectId: subject_id,
              lessonId: id,
            }}
          >
            <IconEye />
          </Link>
        ),
      },
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสบทเรียน' },
      { accessor: 'course', title: 'หลักสูตร' },
      { accessor: 'subject_name', title: 'วิชา' },
      { accessor: 'seed_year_name', title: 'ชั้นปี' },
      { accessor: 'lesson_name', title: 'บทเรียนหลัก' },

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
    ];

    return finalDefs;
  }, [statusFilter]);

  const handleSelectionChange = (selectedRows: SetStateAction<Lesson[]>) => {
    setSelectedRecords(selectedRows);
  };

  const filteredRecords = useMemo(() => {
    return statusFilter !== undefined
      ? records.filter((record) => record.is_enabled === statusFilter)
      : records;
  }, [statusFilter, records]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  const fetchSchoolData = async () => {
    try {
      const response = await API.Local.GetSchoolDetailByClassID(classId);

      if (response?.data?.length > 0) {
        setSchoolData(response.data[0]);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <ScreenTemplateWithoutHeader>
      <div className="w-full">
        <div className="mt-5">
          <CWSchoolCard school={schoolData} />
        </div>

        <div className="mb-5 w-full">
          <div className="my-5">
            <div className="mb-5 w-full">
              <div className="relative flex w-full items-center justify-center sm:justify-start">
                <div className="absolute left-0">
                  <CWTitleBack label="" href={`/line/parent/clever/${studentId}`} />
                </div>

                <p className="text-center text-[26px] font-bold sm:pl-10 sm:text-left">
                  บทเรียนหลัก
                </p>
              </div>

              <p className="mt-2 w-full text-center sm:text-left">
                {records.length} บทเรียน
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:h-[38px] sm:flex-row sm:items-center">
            <CWSelect
              title="หลักสูตร"
              className="w-full sm:w-[250px]"
              options={courses}
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
            <CWSelect
              title="วิชา"
              className="w-full sm:w-[250px]"
              options={subjects}
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
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
                <DataTable
                  height={'calc(100vh - 350px)'}
                  className="table-hover whitespace-nowrap"
                  columns={columnDefs}
                  records={filteredRecords}
                  classNames={{
                    pagination: isMobile ? 'justify-center' : '',
                  }}
                />
              </div>
            </div>
            <CWPagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total_count / pagination.limit)}
              onPageChange={handlePageChange}
              pageSize={pagination.limit}
              setPageSize={handlePageSizeChange}
            />
          </CWWhiteBox>
        </div>
      </div>
      <div className="mt-4 flex w-full justify-center">
        <FooterMenu />
      </div>
    </ScreenTemplateWithoutHeader>
  );
};

export default DomainJSX;
