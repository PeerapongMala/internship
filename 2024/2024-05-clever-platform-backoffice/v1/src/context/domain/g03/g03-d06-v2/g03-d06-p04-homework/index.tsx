// import { useTranslation } from 'react-i18next';
import MockActivityThumbnail from '@asset/mock-activity.jpg';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate } from '@tanstack/react-router';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';
import ConfigJson from './config/index.json';
import Breadcrumbs from '@core/design-system/library/component/web/Breadcrumbs';
import SchoolCard from '@core/design-system/library/component/web/SchoolCard';
import CWButton from '@component/web/cw-button';
import { Affiliation, Subject } from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWWhiteBox from '@component/web/cw-white-box';
import API from '../local/api/index';
import { IconSeries } from '@amcharts/amcharts5/.internal/charts/stock/drawing/IconSeries';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import CWSchoolCard from '@component/web/cw-school-card';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import usePagination from '@global/hooks/usePagination';
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const G03D06P04Homework = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { userData, targetData, isLoginAs } = StoreGlobalPersist.StateGet([
    'userData',
    'targetData',
    'isLoginAs',
  ]);
  const schoolId = isLoginAs ? targetData?.school_id : userData?.school_id;

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      if (isMobile && window.location.pathname !== '/line/teacher/homework/homework') {
        navigate({ to: '/line/teacher/homework/homework' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const GotoTemplate = () => {
    navigate({ to: '../template' });
  };
  const modalAdditem = useModal();

  const [fetching, setFetching] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const { pagination, setPagination, pageSizeOptions } = usePagination();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await API.teacherHomework.GetSubjectList(
          schoolId,
          pagination.page,
          pagination.limit,
        );
        if ('data' in response) {
          // Type guard to check if response has data
          setSubjects(response.data);
          setPagination((prev) => ({
            ...prev,
            total_count: response._pagination.total_count,
          }));
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [pagination.page, pagination.limit]);

  const columnDefs = useMemo<DataTableColumn<Subject>[]>(() => {
    const finalDefs: DataTableColumn<Subject>[] = [
      {
        accessor: 'index',
        title: '#ID',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'subject_id', title: 'รหัสวิชา' },
      { accessor: 'curriculum_group_name', title: 'สังกัดวิชา' },
      { accessor: 'year_name', title: 'ชั้นปี' },
      { accessor: 'subject_name', title: 'วิชา' },
      {
        accessor: 'edit',
        title: 'ดูการบ้าน',
        textAlign: 'center',
        render: ({
          subject_id,
          subject_name,
          curriculum_group_name,
          year_name,
          year_id,
        }) => (
          <Link
            to="./$subjectId"
            params={{ subjectId: subject_id }}
            search={{
              subject_name: subject_name,
              curriculum_group_name: curriculum_group_name,
              year_name: year_name || '',
              subject_id: subject_id,
              year_id: year_id,
            }}
            className="flex justify-center"
          >
            <IconSearch />
          </Link>
        ),
      },
    ];
    return finalDefs;
  }, [pagination.page, pagination.limit]);

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'การบ้าน', href: '#' },
        ]}
      />
      <CWSchoolCard
        name="โรงเรียนสาธิตมัธยม"
        code="000000001"
        subCode="AA109"
        className="mt-5"
      />
      <div className="w-full">
        <div className="my-10 flex justify-between">
          <h1 className="text-[28px] font-bold">การบ้าน</h1>
          <CWButton title="สร้างการบ้าน" onClick={GotoTemplate} />
        </div>

        <CWWhiteBox>
          <div className="w-full">
            <DataTable
              className="table-hover whitespace-nowrap"
              columns={columnDefs}
              records={subjects}
              totalRecords={pagination.total_count}
              recordsPerPage={pagination.limit}
              page={pagination.page}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              onRecordsPerPageChange={(limit) => {
                console.log('Records Per Page Changed:', limit);
                setPagination((prev) => ({ ...prev, limit, page: 1 }));
              }}
              recordsPerPageOptions={pageSizeOptions}
              paginationText={({ from, to, totalRecords }) =>
                `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
              }
              fetching={fetching}
              minHeight={200}
            />
          </div>
        </CWWhiteBox>
      </div>
    </div>
  );
};

export default G03D06P04Homework;
