// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import { DataTable, DataTableColumn } from 'mantine-datatable';

import { Lesson, ClassResponse } from '../local/type';

import showMessage from '@global/utils/showMessage';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';

import LessonRestAPI from '../local/api/group/lesson/restapi';

import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';

import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import ScreenTemplateWithoutHeader from '@domain/g05/local/component/web/template/cw-t-line-layout-without-text';
import CWInputSearch from '@component/web/cw-input-search';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWPagination from '@component/web/cw-pagination';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
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

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const modalAdditem = useModal();

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<Lesson[]>([]);
  const [records, setRecords] = useState<ClassResponse[]>([]);
  const { pagination, setPagination } = usePagination();
  const [academicYear, setAcademicYear] = useState<string>('');
  const [academicYears, setAcademicYears] = useState<number[]>([]);

  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');

  const { studentId }: { studentId: string } = useParams({
    from: '/line/parent/clever/$studentId',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming we're working with class ID 1 for now
        const classId = '1';
      } catch (error) {
        console.error('Failed to fetch data:', error);
        showMessage('ไม่สามารถโหลดข้อมูลได้', 'error');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await LessonRestAPI.GetAcademicYears(1, 10);
        setAcademicYears(response.data);
      } catch (error) {
        console.error('Failed to fetch academic years:', error);
        showMessage('ไม่สามารถโหลดข้อมูลปีการศึกษาได้', 'error');
      }
    };

    fetchAcademicYears();
  }, []);

  const fetchClasses = async () => {
    try {
      setFetching(true);
      const response = await LessonRestAPI.GetClasses(
        pagination.page,
        pagination.limit,
        academicYear,
        searchField === 'id' ? searchValue : undefined,
        searchField === 'year' ? searchValue : undefined,
        searchField === 'name' ? searchValue : undefined,
        studentId,
      );

      setRecords(response.data);
      setPagination((prev) => ({
        ...prev,
        total_count: response._pagination.total_count,
      }));
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      showMessage('ไม่สามารถโหลดข้อมูลห้องเรียนได้', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [pagination.page, pagination.limit, academicYear, searchField, searchValue]);

  const columnDefs = useMemo<DataTableColumn<ClassResponse>[]>(() => {
    return [
      {
        accessor: 'index',
        title: '#',
        render: (_, index) => index + 1,
      },
      { accessor: 'id', title: 'รหัสห้องเรียน' },
      { accessor: 'year', title: 'ชั้นปี' },
      { accessor: 'name', title: 'ห้อง' },

      {
        accessor: 'edit',
        title: '',
        render: ({ id }) => (
          <Link
            to="/line/parent/clever/$studentId/$classId"
            params={{ studentId: studentId, classId: id.toString() }}
          >
            <IconArrowRight />
          </Link>
        ),
      },
    ];
  }, []);

  const handleSelectionChange = (selectedRows: SetStateAction<Lesson[]>) => {
    setSelectedRecords(selectedRows);
  };
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  return (
    <ScreenTemplateWithoutHeader>
      <div className="w-full">
        <div className="w-full">
          <div className="mb-5 flex w-full flex-col gap-1">
            <div className="relative px-4 pt-4">
              <a href="/line/parent/choose-student" className="absolute left-4 top-5">
                <IconArrowBackward />
              </a>

              <div className="ml-8">
                <h1 className="text-center text-2xl font-bold sm:text-left">ห้องเรียน</h1>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  เลือกห้องเรียนที่คุณต้องการจัดการ หากไม่มีพบกรุณาติดต่อแอดมิน
                </p>
              </div>
            </div>
          </div>
          <CWWhiteBox>
            <div className="flex flex-col gap-4 sm:h-[38px] sm:w-full sm:flex-row sm:items-center">
              <CWInputSearch
                placeholder="ค้นหา"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onClick={() => fetchClasses()}
                inputWidth="full"
              />
              <CWSelect
                title="ปีการศึกษา"
                className="w-full sm:w-[250px]"
                value={academicYear}
                onChange={(e) => {
                  setAcademicYear(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                options={academicYears.map((year) => ({
                  value: year.toString(),
                  label: year.toString(),
                }))}
              />
            </div>

            <div className="w-full overflow-x-auto">
              <div className="mt-5 min-w-[350px]">
                <DataTable
                  height={'calc(100vh - 350px)'}
                  className="table-hover whitespace-nowrap"
                  columns={columnDefs}
                  records={records}
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
