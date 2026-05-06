import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import CWWhiteBox from '@component/web/cw-white-box';
import StoreGlobal from '@global/store/global';
import StoreGlobalPersist from '@global/store/global/persist';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWTitleBack from '@component/web/cw-title-back';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import API from '../local/api/index';
import showMessage from '@global/utils/showMessage';
import { Subject } from '../local/type';
import LineLiffPage from '../../local/component/web/template/cw-t-lineliff-page';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

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

  const [fetching, setFetching] = useState<boolean>(false);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const schoolId = globalUserData?.school_id || 1;
        const response = await API.teacherHomework.GetSubjectList(
          schoolId,
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
  }, [pagination.page, pagination.limit, globalUserData]);

  const columnDefs = useMemo<DataTableColumn<Subject>[]>(
    () => [
      {
        accessor: 'edit',
        title: 'ดูรายละเอียด',
        render: ({
          subject_id,
          year_id,
          curriculum_group_name,
          subject_name,
          year_name,
        }) => (
          <Link
            to="./$subjectId"
            params={{ subjectId: subject_id }}
            search={{ year_id, curriculum_group_name, subject_name, year_name }}
          >
            <IconEye />
          </Link>
        ),
      },
      {
        accessor: 'index',
        title: '#',
        render: (_record, index) => index + 1,
      },
      { accessor: 'subject_id', title: 'รหัสวิชา' },
      { accessor: 'curriculum_group_name', title: 'สังกัดวิชา' },
      { accessor: 'subject_name', title: 'วิชา' },
    ],
    [],
  );

  return (
    <LineLiffPage className="flex w-full flex-col items-center p-5">
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '#' },
          { label: 'การบ้าน', href: '#' },
        ]}
      />
      <CWSchoolCard
        name="โรงเรียนสาธิตมัธยม"
        code="000000001"
        subCode="AA109"
        className="mt-5 w-full"
      />
      <div className="mb-5 w-full">
        <div className="my-10 w-full">
          <CWTitleBack label="สร้างการบ้าน" href="../homework" />
        </div>
        <CWWhiteBox className="w-full">
          <DataTable
            className="table-hover w-full whitespace-nowrap"
            columns={columnDefs}
            records={subjects}
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
        </CWWhiteBox>
        <div className="mt-4 flex justify-center">
          <FooterMenu />
        </div>
      </div>
    </LineLiffPage>
  );
};

export default DomainJSX;
