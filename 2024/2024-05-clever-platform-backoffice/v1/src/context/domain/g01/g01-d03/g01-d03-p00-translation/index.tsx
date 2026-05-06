import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import Box from '@global/component/web/atom/Box';
import TranslationHeader from './component/web/template/Header';
import { ICurriculum, Pagination } from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { convertIdToThreeDigit } from '../local/util';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import API from '../local/api';
import { Link } from '@tanstack/react-router';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [records, setRecords] = useState<ICurriculum[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<ICurriculum[]>([]);
  const [loadings, setLoadings] = useState<{
    getDatas: boolean;
  }>({
    getDatas: false,
  });
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [searchInput, setSearchInput] = useState<string>('');
  const [searchObject, setSearchObject] = useState<Record<string, any>>({});

  const fetchData = async () => {
    setLoadings((prev) => ({
      ...prev,
      getDatas: true,
    }));
    const query = {
      page: pagination.page,
      limit: pagination.limit,
      search_text: searchInput,
      ...searchObject,
    };

    const res = await API.adminTranslation.GetG00D00A01(query);
    if (res.status_code === 200) {
      const sorted = res.data.sort((a, b) => a.id - b.id);
      setRecords(sorted);
      setPagination((prev) => ({
        ...prev,
        total_count: res._pagination.total_count,
      }));
    }
    setLoadings((prev) => ({
      ...prev,
      getDatas: false,
    }));
  };
  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit]);
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <LayoutDefault>
      <TranslationHeader />
      <div className="w-full font-noto-sans-thai">
        <Box>
          <div className="datatables">
            <DataTable
              fetching={loadings.getDatas}
              className="table-hover whitespace-nowrap"
              records={records}
              columns={rowColumns()}
              highlightOnHover
              withTableBorder
              withColumnBorders
              height={'calc(100vh - 200px)'}
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
        </Box>
      </div>
    </LayoutDefault>
  );
};

const rowColumns = (): DataTableColumn<ICurriculum>[] => [
  {
    accessor: 'id',
    title: 'รหัสสังกัดวิชา',
    render: (record: ICurriculum, index: number) => (
      <>{convertIdToThreeDigit(record.id)}</>
    ),
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
    accessor: 'edit',
    title: 'จัดการ',
    titleClassName: 'text-center',
    render: (record: ICurriculum, index: number) => (
      <div className="flex w-full justify-center">
        <Link to={`/admin/translation/${record.id}`}>
          <IconPen className="h-5 w-5" />
        </Link>
      </div>
    ),
  },
];

export default DomainJSX;
