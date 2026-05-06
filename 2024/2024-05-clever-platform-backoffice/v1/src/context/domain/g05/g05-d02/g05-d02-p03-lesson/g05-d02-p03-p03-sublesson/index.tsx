// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import { Select } from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconArrowLeft from '@core/design-system/library/vristo/source/components/Icon/IconArrowLeft';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import CWTitleBack from '@component/web/cw-title-back';
import CWTitleGroup from '@component/web/cw-title-group';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';
import { Lesson, StatusToggle, SubLesson } from '../local/type';
import CWButtonSwitch from '@component/web/cw-button-switch';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import Tabs from '@component/web/cw-tabs';
import LessonRestAPI from '../local/api/group/lesson/restapi';
import showMessage from '@global/utils/showMessage';
import { LessonResponse } from '../local/api/repository/lesson';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import ScreenTemplateWithoutHeader from '@domain/g05/local/component/web/template/cw-t-line-layout-without-text';
import CWPagination from '@component/web/cw-pagination';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
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
  const { studentId, classId, subjectId, lessonId } = useParams({
    from: '/line/parent/clever/$studentId/$classId/subject/$subjectId/$lessonId',
  });
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

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<SubLesson[]>([]);
  const [records, setRecords] = useState<SubLesson[]>([]);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [lessonDetail, setLessonDetail] = useState<LessonResponse>();

  const fetchSubLessons = async () => {
    try {
      setFetching(true);
      const response = await LessonRestAPI.GetSubLessons(
        classId,
        Number(lessonId),
        pagination.page,
        pagination.limit,
        statusFilter,
      );

      const transformedData: SubLesson[] = response.data.map((item) => ({
        id: item.sub_lesson_id,
        curriculum_group_short_name: item.curriculum_group,
        subject: item.subject,
        year: item.year,
        sublesson_name: item.sub_lesson_name,
        is_enabled: item.is_enabled,
      }));

      setRecords(transformedData);
      setPagination((prev) => ({
        ...prev,
        total_count: response._pagination.total_count,
      }));
    } catch (error) {
      console.error('Failed to fetch sub-lessons:', error);
      showMessage('ไม่สามารถโหลดข้อมูลบทเรียนย่อยได้', 'error');
    } finally {
      setFetching(false);
    }
  };

  const fetchLessonDetail = async () => {
    try {
      const response = await LessonRestAPI.GetLessons(
        classId,
        1, // page
        1, // limit
        undefined,
        undefined, // curriculumGroupId
        undefined, // subjectId
        lessonId, // lesson_id
        true,
      );

      if (response.data.length > 0) {
        setLessonDetail(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch lesson detail:', error);
      showMessage('ไม่สามารถโหลดข้อมูลบทเรียนได้', 'error');
    }
  };

  useEffect(() => {
    fetchSubLessons();
    if (lessonId) {
      fetchLessonDetail();
    }
  }, [pagination.page, pagination.limit, statusFilter, lessonId]);

  const handleToggleStatus = async (id: number, is_enabled: boolean) => {
    try {
      await LessonRestAPI.ToggleSubLessonStatus(classId, id, is_enabled);
      await fetchSubLessons();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      showMessage('ไม่สามารถเปลี่ยนสถานะได้', 'error');
    }
  };

  const columnDefs = useMemo<DataTableColumn<SubLesson>[]>(() => {
    const finalDefs: DataTableColumn<SubLesson>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสบทเรียน' },
      // { accessor: 'course', title: 'หลักสูตร' },
      // { accessor: 'subject_name', title: 'วิชา' },
      // { accessor: 'seed_year_name', title: 'ชั้นปี' },
      { accessor: 'sublesson_name', title: 'บทเรียนย่อย' },

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
        accessor: 'edit',
        title: 'ดูรายละเอียด',
        render: ({ id }) => (
          <Link
            to="/line/parent/clever/$studentId/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId"
            params={{ studentId, classId, subjectId, lessonId, sublessonId: id }}
          >
            <IconSearch />
          </Link>
        ),
      },
    ];

    return finalDefs;
  }, [statusFilter]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  return (
    <ScreenTemplateWithoutHeader>
      <div className="w-full">
        <div className="mb-5 w-full">
          <div className="relative flex w-full items-center justify-center sm:justify-start">
            <div className="absolute left-0">
              <CWTitleBack
                label=""
                href={`/line/parent/clever/${studentId}/${classId}`}
              />
            </div>

            <p className="text-center text-[26px] font-bold sm:pl-10 sm:text-left">
              บทเรียนย่อย
            </p>
          </div>

          <p className="mt-2 w-full text-center sm:text-left">{records.length} บทเรียน</p>
        </div>

        <div className="mt-5 flex w-full flex-col rounded-md bg-gray-100 pb-3">
          <CWTitleGroup listText={[lessonDetail?.lesson_name || 'กำลังโหลด...']} />
          <p className="text-md px-3">
            {lessonDetail?.curriculum_group_short_name} / {lessonDetail?.subject} /{' '}
            {lessonDetail?.year}
          </p>
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
            <DataTable
              height={'calc(100vh - 350px)'}
              className="table-hover mantine-mobile-layout whitespace-nowrap"
              columns={columnDefs}
              records={records}
              minHeight={200}
              noRecordsText="ไม่พบข้อมูล"
            />
          </div>
          <div className="mt-5">
            <CWPagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total_count / pagination.limit)}
              onPageChange={handlePageChange}
              pageSize={pagination.limit}
              setPageSize={handlePageSizeChange}
            />
          </div>
        </CWWhiteBox>
      </div>
      <div className="mt-4 flex w-full justify-center">
        <FooterMenu />
      </div>
    </ScreenTemplateWithoutHeader>
  );
};

export default DomainJSX;
