// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import SelectItemPage from '../../g00-d00/local/components/web/organisms/SelectItemPage';
import Pagination from '../../g00-d00/local/components/web/organisms/Pagination';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import Box from '../../g00-d00/local/components/web/atom/Box';
import API from '../../g00-d00/local/api';

import {
  Checkbox,
  Input,
} from '@core/design-system/library/vristo/source/components/Input';
import Breadcrumbs from '../../g00-d00/local/components/web/atom/Breadcums';
import { ICurriculum, IPagination } from '../local/type';

import IconArrowRight from '@global/asset/icon/arrow-right.svg';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';
import CWWhiteBox from '@component/web/cw-white-box';
import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper';
import CWInputSearch from '@component/web/cw-input-search';
import { FilterQueryParams } from '../local/api/repository/curriculum';
import { useDebouncedValue } from '@mantine/hooks';
import { error } from 'console';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const navigate = useNavigate();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<ICurriculum[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [filterSearch, setFilterSearch] = useState<FilterQueryParams>({
    search_text: '',
  });
  const [debouncedSearchText] = useDebouncedValue(filterSearch.search_text, 200);
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearchText]);
  const fetchData = useCallback(() => {
    setFetching(true);

    API.curriculum
      .GetAll({
        page: pagination.page,
        limit: pagination.limit,
        search_text: debouncedSearchText || undefined,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res._pagination?.total_count || 0,
          }));
        }
      })
      .catch((error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล', error);
        showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
      })
      .finally(() => setFetching(false));
  }, [pagination.page, pagination.limit, debouncedSearchText]);

  useEffect(() => {
    if (debouncedSearchText !== filterSearch.search_text) {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
    fetchData();
  }, [fetchData]);
  const handleSearchClick = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchData();
  };

  const columnDefs = useMemo<DataTableColumn<ICurriculum>[]>(() => {
    const rowColumns: DataTableColumn<ICurriculum>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      {
        accessor: 'id',
        title: 'รหัสสังกัดวิชา',
        render: (record: any, index: number) => <>{record.id}</>,
      },
      {
        accessor: 'name',
        title: 'ชื่อสังกัดวิชา',
      },
      {
        accessor: 'short_name',
        title: 'ชื่อย่อ',
      },
      {
        accessor: 'updated_at',
        title: 'แก้ไขล่าสุด',
        render: ({ updated_at }) => {
          return updated_at ? toDateTimeTH(updated_at) : '-';
        },
      },
      {
        accessor: 'updated_by',
        title: 'แก้ไขล่าสุดโดย',
        render: ({ updated_by }) => {
          return updated_by ? updated_by : '-';
        },
      },

      {
        accessor: 'select',
        title: 'เลือกสังกัด',
        textAlign: 'center',
        render: (record: ICurriculum, index: number) => (
          <div className="flex justify-center gap-2">
            <button onClick={() => onSelectCurriculum(record)}>
              <IconArrowRight />
            </button>
          </div>
        ),
      },
    ];
    return rowColumns;
  }, []);

  const onSelectCurriculum = (data: ICurriculum) => {
    (
      StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
    ).setCurriculumData(data);

    navigate({
      to: '/content-creator/course/platform',
    });
  };

  return (
    <div className="w-full font-noto-sans-thai">
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '/' },
          { label: 'หลักสูตร', href: '' },
          {
            label: 'สังกัดวิชาของคุณ',
            href: '/content-creator/auth/affiliation',
          },
        ]}
      />

      <div className="w-full">
        <div className="my-7">
          <h1 className="text-[28px] font-bold">สังกัดวิชาของคุณ</h1>
          <p className="mt-2">
            เลือกสังกัดวิชาที่คุณต้องการจัดการหลักสูตร
            หากไม่มีสังกัดวิชาที่ต้องการในบัญชีของคุณ กรุณาติดต่อแอดมิน
          </p>
        </div>

        <CWWhiteBox className="mt-7">
          <div className="w-[350px]">
            <CWInputSearch
              onClick={handleSearchClick}
              placeholder="ค้นหา"
              value={filterSearch.search_text}
              onChange={(e) =>
                setFilterSearch((prev) => ({ ...prev, search_text: e.target.value }))
              }
            />
          </div>
          <div className="mt-5 w-full">
            <div className="datatables">
              <DataTable
                fetching={fetching}
                className="table-hover whitespace-nowrap"
                records={records}
                columns={columnDefs}
                highlightOnHover
                withTableBorder
                withColumnBorders
                minHeight={200}
                height={'calc(100vh - 350px)'}
                noRecordsText="ไม่พบข้อมูล"
                totalRecords={pagination.total_count}
                recordsPerPage={pagination.limit}
                page={pagination.page}
                onPageChange={(page) => {
                  setPagination((prev) => ({
                    ...prev,
                    page,
                  }));
                }}
                onRecordsPerPageChange={(limit: number) => {
                  setPagination((prev) => ({
                    ...prev,
                    limit,
                    page: 1,
                  }));
                }}
                recordsPerPageOptions={pageSizeOptions}
                paginationText={({ from, to, totalRecords }) =>
                  `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
                }
              />
            </div>
          </div>
        </CWWhiteBox>
      </div>
    </div>
  );
};

export default DomainJSX;
