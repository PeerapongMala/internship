import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';

import Breadcrumbs from '@core/design-system/library/component/web/Breadcrumbs';
import SchoolCard from '@core/design-system/library/component/web/SchoolCard';
import CWButton from '@component/web/cw-button';
import { Subject } from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWWhiteBox from '@component/web/cw-white-box';
import API from '../local/api/index';
import LineLiffPage from '../../local/component/web/template/cw-t-lineliff-page';
import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import CWSchoolCard from '@component/web/cw-school-card';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const G03D06P04Homework = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/teacher/homework/homework') {
        navigate({ to: '/teacher/homework/homework' });
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const GotoTemplate = () => {
    navigate({ to: '../template' });
  };

  const [fetching, setFetching] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const schoolId = globalUserData?.school_id;
        const response = await API.teacherHomework.GetSubjectList(
          schoolId || 1,
          pagination.page,
          pagination.limit,
        );
        if ('data' in response) {
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

  const columnDefs = useMemo<DataTableColumn<Subject>[]>(
    () => [
      {
        accessor: 'edit',
        title: 'ดูการบ้าน',
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
              subject_name,
              curriculum_group_name,
              year_name: year_name || '',
              subject_id,
              year_id,
            }}
          >
            <IconEye />
          </Link>
        ),
      },
      {
        accessor: 'index',
        title: '#ID',
        render: (record, index) => index + 1,
      },
      { accessor: 'subject_id', title: 'รหัสวิชา' },
      { accessor: 'curriculum_group_name', title: 'สังกัดวิชา' },
      { accessor: 'year_name', title: 'ชั้นปี' },
      { accessor: 'subject_name', title: 'วิชา' },
    ],
    [globalUserData /* add dependencies as needed */],
  );

  const paginatedRecords = useMemo(() => {
    return subjects.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit,
    );
  }, [subjects, pagination.page, pagination.limit]);

  return (
    <LineLiffPage className="mb-24 flex w-full flex-col items-center">
      <CWSchoolCard
        name="โรงเรียนสาธิตมัธยม"
        code="000000001"
        subCode="AA109"
        className="w-full"
      />
      <div className="w-full">
        <div className="my-10 flex w-full flex-col gap-3">
          <h1 className="text-center text-[28px] font-bold">การบ้าน</h1>
          <CWButton title="สร้างการบ้าน" onClick={GotoTemplate} className="w-full" />
        </div>
        <CWWhiteBox>
          <div className="w-full px-5">
            <DataTable
              className="table-hover mantine-mobile-layout w-full whitespace-nowrap"
              columns={columnDefs}
              records={paginatedRecords}
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
            />
          </div>
        </CWWhiteBox>
      </div>
      <FooterMenu />
    </LineLiffPage>
  );
};

export default G03D06P04Homework;
