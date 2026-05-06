import { Link, useNavigate } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useCallback, useEffect, useState } from 'react';

import IconArchive from '@core/design-system/library/component/icon/IconArchive.tsx';
import IconEye from '@core/design-system/library/component/icon/IconEye.tsx';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import API from '@domain/g01/g01-d08/local/api';
import { FamilyListResponse } from '@domain/g01/g01-d08/local/api/group/admin-family/type.ts';
import StoreGlobal from '@global/store/global';
import downloadCSV from '@global/utils/downloadCSV.ts';
import showMessage from '@global/utils/showMessage.ts';
import IconClose from '@core/design-system/library/component/icon/IconClose.tsx';
import ModalConfirmDelete from '@domain/g01/g01-d08/g01-d08-p00-family/component/web/template/ModalConfirmDelete';
import { useDebouncedValue } from '@mantine/hooks';
import { FilterQueryParams } from '../local/api/repository/admin-family';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import usePagination from '@global/hooks/usePagination';

const AdminFamily = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<FamilyListResponse[]>([]);
  const [fetching, setFetching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<FamilyListResponse[]>([]);
  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState(false);
  const [passwordDelete, setPasswordDelete] = useState('');
  const [familyIdForDelete, setFamilyIdForDelete] = useState<number | null>(null);
  const {
    page,
    pageSize,
    totalCount: totalRecord,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecord,
    pageSizeOptions: PAGE_SIZES,
  } = usePagination();

  // ค้นหา
  const [searchText, setSearchText] = useState({
    key: '',
    value: '',
  });
  const [debouncedFilterSearch] = useDebouncedValue(searchText, 300);
  const searchDropdownOptions = [
    { label: 'รหัสครอบครัว', value: 'family_id' },
    { label: 'LINE ID', value: 'line_id' },
    { label: 'ชื่อจริง', value: 'first_name' },
    { label: 'นามสกุล', value: 'last_name' },
    { label: 'จำนวนสมาชิก', value: 'member_count' },
  ];
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const fetchFamilyList = async () => {
    setFetching(true);
    try {
      const payload: FilterQueryParams = {
        page: debouncedFilterSearch.key ? 1 : page,
        limit: pageSize,
      };

      if (debouncedFilterSearch.key && debouncedFilterSearch.value) {
        payload[debouncedFilterSearch.key] = debouncedFilterSearch.value;
      }
      const response = await API.adminFamily.GetFamilyList(payload);
      if (response?.status_code === 200) {
        const familyList = response.data.map(
          (item: FamilyListResponse, index: number) => ({
            ...item,
            id: Date.now() + index,
          }),
        );
        setData(familyList);
        setTotalRecord(response._pagination.total_count);
      }
    } catch (err) {
      console.error('Error fetching family list:', err);
    } finally {
      setFetching(false);
    }
  };

  // action delete family
  const deleteFamily = useCallback(async () => {
    if (familyIdForDelete) {
      API.adminFamily
        .DeleteFamily(familyIdForDelete as number, passwordDelete)
        .then((res) => {
          console.log('Delete family response:', res);
          if (res.status_code === 200) {
            showMessage('ลบข้อมูลสำเร็จ', 'success');
            fetchFamilyList();
          } else {
            showMessage('ลบข้อมูลไม่สำเร็จ', 'error');
          }
          setOpenModalConfirmDelete(false);
          setPasswordDelete('');
        });
    }
  }, [familyIdForDelete, passwordDelete]);

  const onDownload = (dateFrom: string, dateTo: string) => {
    API.adminFamily
      .DownloadFamilyList('0', {
        start_date: dateFrom,
        end_date: dateTo,
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, `family_list.csv`);
        } else {
          showMessage('Download failed!', 'error');
        }
      })
      .catch(() => {
        showMessage('Download failed!', 'error');
      });
  };

  const onBulkEdit = async (records: FamilyListResponse[]): Promise<void> => {
    if (records.length === 0) {
      return;
    }

    const data = records.map((record) => record.family_id);
    API.adminFamily.BulkEditFamilyList(data).then((res) => {
      if (res.status_code === 200) {
        showMessage('ลบข้อมูลสำเร็จ', 'success');
        fetchFamilyList();
      } else {
        showMessage('ลบข้อมูลไม่สำเร็จ', 'error');
      }
    });
  };

  useEffect(() => {
    fetchFamilyList();
  }, [page, pageSize, debouncedFilterSearch]);

  const rowColumns: DataTableColumn<FamilyListResponse>[] = [
    {
      accessor: 'view',
      title: 'ดู',
      render: (row: FamilyListResponse) => (
        <div className="flex w-full justify-items-start">
          <Link to={`/admin/family/${row.family_id}/info`}>
            <IconEye />
          </Link>
        </div>
      ),
    },
    {
      accessor: 'index',
      title: '#',
      render: (_, index) => (page - 1) * pageSize + index + 1,
    },
    {
      accessor: 'family_id',
      title: 'รหัสครอบครัว',
      render: (row: FamilyListResponse) => (
        <div className="flex w-full justify-items-end">
          {row.family_id ? <span> {row.family_id}</span> : <span>-</span>}
        </div>
      ),
    },
    {
      accessor: 'line_id',
      title: 'LINE ID เจ้าของ',
      render: (row: FamilyListResponse) => (
        <div className="flex w-full justify-items-start">
          {row.line_id ? <span> {row.line_id}</span> : <span>-</span>}
        </div>
      ),
    },
    { accessor: 'first_name', title: 'ชื่อจริง' },
    { accessor: 'last_name', title: 'สกุล' },
    { accessor: 'member_count', title: 'จำนวนสมาชิก' },
    {
      accessor: 'created_at',
      title: 'วันที่สร้าง',
      render: ({ created_at }) =>
        new Date(created_at).toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        }),
    },

    {
      accessor: 'deletle',
      title: 'ลบครอบครัว',
      render: (row: FamilyListResponse) => (
        <button
          className="w-2 !px-2"
          onClick={() => {
            setFamilyIdForDelete(row.family_id);
            setOpenModalConfirmDelete(true);
          }}
        >
          <IconClose />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '/', disabled: true },
          { label: 'จัดการครอบครัว' },
        ]}
      />
      <header>
        <h1 className="text-2xl font-bold">จัดการครอบครัว</h1>
        <h2 className="text-sm">
          จัดการกลุ่มครอบครัว เพื่อควบคุมการเข้าถึงข้อมูลนักเรียนผ่านระบบ LINE CLMS
        </h2>
      </header>
      <div className="panel flex flex-col gap-5">
        <CWOHeaderTableButton
          // bulkEditDisabled={selectedRecords.length === 0}
          // bulkEditActions={[
          //   {
          //     label: (
          //       <div className="flex gap-2">
          //         <IconClose />
          //         <div>ลบครอบครัว</div>
          //       </div>
          //     ),
          //     onClick: () => onBulkEdit(selectedRecords),
          //   },
          // ]}
          showBulkEditButton={false}
          btnIcon={<IconPlus />}
          btnLabel="เพิ่มครอบครัว"
          onBtnClick={() => navigate({ to: '/admin/family/add' })}
          onSearchChange={(evt) => {
            const value = evt.currentTarget.value;
            setSearchText((prev) => ({
              ...prev,
              value,
            }));
          }}
          onSearchDropdownSelect={(value) => {
            setSearchText((prev) => ({
              ...prev,
              key: `${value}`,
            }));
          }}
          inputSearchType="input-dropdown"
          searchDropdownOptions={searchDropdownOptions}
          onDownload={(data) => onDownload(data.dateFrom, data.dateTo)}
          showUploadButton={false}
        />

        <div className="datatables">
          <DataTable
            className="z-0"
            records={data}
            columns={rowColumns}
            // selectedRecords={selectedRecords}
            // onSelectedRecordsChange={setSelectedRecords}
            highlightOnHover
            withTableBorder
            withColumnBorders
            idAccessor="id"
            height={'calc(100vh - 350px)'}
            noRecordsText="ไม่พบข้อมูล"
            styles={{
              root: { minHeight: '300px' },
            }}
            page={page}
            totalRecords={totalRecord}
            onPageChange={setPage}
            recordsPerPage={pageSize}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            paginationText={({ from, totalRecords }) => {
              const currentPage = Math.ceil(from / pageSize);
              const totalPage = Math.ceil(totalRecords / pageSize);
              return `แสดงหน้าที่ ${currentPage} จากทั้งหมด ${totalPage} หน้า`;
            }}
            fetching={fetching}
            loaderType="oval"
            loaderBackgroundBlur={4}
          />
        </div>
        <ModalConfirmDelete
          isOpen={openModalConfirmDelete}
          onClose={() => {
            setFamilyIdForDelete(null);
            setPasswordDelete('');
            setOpenModalConfirmDelete(false);
          }}
          onOk={() => {
            deleteFamily();
          }}
          passwordDelete={passwordDelete}
          setPasswordDelete={setPasswordDelete}
        />
      </div>
    </div>
  );
};

export default AdminFamily;
