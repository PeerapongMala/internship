// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate } from '@tanstack/react-router';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import { Select } from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import Tabs from '@component/web/cw-tabs';
import { Lesson, Status, StatusToggle, ClassResponse } from '../local/type';
import { toDateTimeTH } from '@global/utils/date';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import showMessage from '@global/utils/showMessage';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWPagination from '@component/web/cw-pagination';
import LessonRestAPI from '../local/api/group/lesson/restapi';
import { LessonResponse } from '../local/api/repository/lesson';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';
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

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const modalAdditem = useModal();

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<Lesson[]>([]);
  const [records, setRecords] = useState<ClassResponse[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [academicYear, setAcademicYear] = useState<string>('');
  const [academicYears, setAcademicYears] = useState<number[]>([]);

  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');

  const searchDropdownOptions = [
    { value: 'name', label: 'ห้อง' },
    { value: 'id', label: 'รหัสห้องเรียน' },
    { value: 'year', label: 'ชั้นปี' },
  ];
  const dropdownPlaceholder =
    searchDropdownOptions && searchDropdownOptions.length > 0
      ? searchDropdownOptions[0].label
      : 'ฟิลด์';

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
        width: 80,
        render: (_, index) => index + 1,
      },
      { accessor: 'id', title: 'รหัสห้องเรียน', width: 140 },
      { accessor: 'academic_year', title: 'ปีการศึกษา', width: 140 },
      { accessor: 'year', title: 'ชั้นปี', width: 140 },
      { accessor: 'name', title: 'ห้อง', width: 140 },

      {
        accessor: 'edit',
        title: 'เลือก',
        render: ({ id }) => (
          <Link to="/teacher/lesson/$classId" params={{ classId: id.toString() }}>
            <IconArrowRight />
          </Link>
        ),
      },
    ];
  }, []);

  const handleSelectionChange = (selectedRows: SetStateAction<Lesson[]>) => {
    setSelectedRecords(selectedRows);
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[{ label: 'การเรียนการสอน' }, { label: 'จัดการห้องเรียน' }]}
      />

      <div className="mb-5 w-full">
        <div className="my-5">
          <h1 className="text-[28px] font-bold">ห้องเรียน</h1>
          <p className="mt-2">
            เลือกห้องเรียนที่คุณต้องการจัดการ หากไม่มีพบกรุณาติดต่อแอดมิน
          </p>
        </div>
        <CWWhiteBox>
          <div className="flex h-[38px] gap-4">
            <WCAInputDropdown
              inputPlaceholder={'ค้นหา'}
              inputValue={searchValue}
              onInputChange={(e) => setSearchValue(e.target.value)}
              onInputBtnClick={() => fetchClasses()}
              dropdownPlaceholder={dropdownPlaceholder}
              dropdownOptions={searchDropdownOptions}
              onDropdownSelect={(value) => {
                setSearchField(value.toString());
                setSearchValue('');
              }}
            />
            <CWSelect
              title="ปีการศึกษา"
              className="mb-5 w-[250px] max-w-[250px]"
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

          <div className="w-full">
            <div className="mt-5 w-full">
              {records.length > 0 ? (
                <DataTable
                  height={'calc(100vh - 350px)'}
                  className="table-hover whitespace-nowrap"
                  columns={columnDefs}
                  records={records}
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
          </div>
        </CWWhiteBox>
      </div>
    </div>
  );
};

export default DomainJSX;
