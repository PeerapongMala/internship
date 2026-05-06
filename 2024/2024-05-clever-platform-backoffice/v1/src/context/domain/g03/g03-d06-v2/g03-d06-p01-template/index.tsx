// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';

import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import CWWhiteBox from '@component/web/cw-white-box';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';

import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import { Affiliation, Subject } from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWTitleBack from '@component/web/cw-title-back';
import API from '../local/api/index';
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
  const [fetching, setFetching] = useState<boolean>(false);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { userData, targetData, isLoginAs } = StoreGlobalPersist.StateGet([
    'userData',
    'targetData',
    'isLoginAs',
  ]);
  const schoolId = isLoginAs ? targetData?.school_id : userData?.school_id;

  useEffect(() => {
    // const fetchMockData = async () => {
    //   setFetching(true);
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   setRecords(mockData);
    //   setPagination((prev) => ({ ...prev, total_count: mockData.length }));
    //   setFetching(false);
    // };
    // fetchMockData();
  }, []);

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
        title: '#',
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
        title: 'ดูรายละเอียด',
        textAlign: 'center',
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
            className="flex justify-center"
          >
            <IconSearch />
          </Link>
        ),
      },
    ];

    return finalDefs;
  }, []);

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
      <div className="mb-5 w-full">
        <div className="my-10">
          <CWTitleBack label="สร้างการบ้าน" href={'../homework'} />
          {/* <h1 className='font-bold text-[28px]'>Template</h1> */}
        </div>
        <div>
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
    </div>
  );
};

export default DomainJSX;
