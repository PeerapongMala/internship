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
  const {
    classId,
    lessonId,
    subjectId,
  }: { classId: string; lessonId: string; subjectId: string } = useParams({
    // from: '/teacher/lesson/$classId/subject/$subjectId/$lessonId',
    strict: false,
  });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, [lessonId]);

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
        is_enabled_level: item.is_enabled_level,
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
        pagination.page,
        pagination.limit,
        undefined, // status
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
      showMessage('เปลี่ยนสถานะบทเรียนสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to toggle status:', error);
      showMessage('ไม่สามารถเปลี่ยนสถานะได้', 'error');
    }
  };
  const handleToggleLevel = async (id: number, is_enabled: boolean) => {
    try {
      await LessonRestAPI.ToggleLevel(classId, id, is_enabled);
      await fetchSubLessons();
      showMessage('เปลี่ยนสถานะด่านสำเร็จ', 'success');
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
        width: 80,
        render: (record, index) => {
          return index + 1;
        },
      },
      // { accessor: 'id', title: 'รหัสบทเรียน', width: 120, resizable: true, },
      // { accessor: 'course', title: 'หลักสูตร' },
      // { accessor: 'subject_name', title: 'วิชา' },
      // { accessor: 'seed_year_name', title: 'ชั้นปี' },
      { accessor: 'sublesson_name', title: 'บทเรียนย่อย', resizable: true },

      {
        accessor: 'is_enabled',
        title: 'เปิดใช้บทเรียน',
        resizable: true,
        width: 150,
        render: ({ id, is_enabled }) => (
          <CWButtonSwitch
            initialState={is_enabled}
            onChange={() => handleToggleStatus(id, !is_enabled)}
          />
        ),
      },
      {
        accessor: 'is_enabled_level',
        title: 'ปลดล็อคทุกด่าน',
        width: 150,
        render: ({ id, is_enabled_level }) => (
          <CWButtonSwitch
            initialState={is_enabled_level}
            onChange={() => handleToggleLevel(id, !is_enabled_level)}
          />
        ),
      },
      {
        accessor: 'edit',
        title: 'ดูรายละเอียด',
        render: ({ id }) => (
          <Link
            to="/teacher/lesson/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId"
            params={{ classId, subjectId, lessonId, sublessonId: id }}
          >
            <IconSearch />
          </Link>
        ),
      },
    ];

    return finalDefs;
  }, [statusFilter]);

  const handleSelectionChange = (selectedRows: SetStateAction<SubLesson[]>) => {
    setSelectedRecords(selectedRows);
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน' },
          { label: 'จัดการห้องเรียน' },
          { label: 'จัดการบทเรียน' },
          { label: 'จัดการบทเรียนย่อย' },
        ]}
      />
      {/* <div className="mt-5">
        <CWSchoolCard name="โรงเรียนสาธิตมัธยม" code="000000001" subCode="AA109" />
      </div> */}

      <div className="mb-5 w-full">
        <div className="my-5">
          <CWTitleBack label={`บทเรียนย่อย`} href={`/teacher/lesson/${classId}`} />
          <p className="mt-2">{records.length} บทเรียน</p>
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

        <CWWhiteBox className="">
          <div className="w-full">
            {records.length > 0 ? (
              <DataTable
                height={'calc(100vh - 350px)'}
                className="table-hover whitespace-nowrap"
                columns={columnDefs}
                records={records}
                highlightOnHover
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
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={handleSelectionChange}
                fetching={fetching}
                loaderType="oval"
                loaderBackgroundBlur={4}
              />
            ) : (
              <DataTable
                height={'calc(100vh - 350px)'}
                className="table-hover whitespace-nowrap"
                columns={columnDefs}
                records={[]}
                noRecordsText="ไม่พบข้อมูล"
                fetching={fetching}
                withTableBorder
                withColumnBorders
              />
            )}
          </div>
        </CWWhiteBox>
      </div>
    </div>
  );
};

export default DomainJSX;
