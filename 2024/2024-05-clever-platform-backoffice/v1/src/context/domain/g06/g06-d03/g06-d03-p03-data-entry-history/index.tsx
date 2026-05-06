import StoreGlobal from '@global/store/global';
import { useEffect, useMemo, useState } from 'react';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import { useParams } from '@tanstack/react-router';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import API from '../local/api';
import { IGetHistoryList } from '../local/type';
import ModalSubjectTable from './component/web/organism/cw-o-modal-subject-table';
import useModal from '@global/utils/useModal';
import usePagination from '@global/hooks/usePagination';
import { ESortOrder } from '@global/enums';
import IconSorted from '@core/design-system/library/component/icon/IconSorted';
import IconUnSorted from '@core/design-system/library/component/icon/IconUnSorted';
import HeaderHistory from './component/web/molecule/cw-m-header-history';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const params = useParams({ strict: false });
  const sheetId = Number(params.sheetId);

  const [historyList, setHistoryList] = useState<IGetHistoryList[]>([]);
  const [fetching, setFetching] = useState(false);

  const modalVersion = useModal();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IGetHistoryList>>({
    columnAccessor: 'version',
    direction: 'desc',
  });

  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    totalCount,
    setTotalCount,
    pageSizeOptions,
  } = usePagination();

  useEffect(() => {
    fetchHistoryList();
  }, [page, pageSize, sortStatus]);

  const fetchHistoryList = () => {
    setFetching(true);
    API.history
      .GetHistoryList(sheetId, {
        page: page,
        limit: pageSize,
        sort_by: sortStatus.columnAccessor as keyof IGetHistoryList,
        sort_order: sortStatus.direction == 'asc' ? ESortOrder.ASC : ESortOrder.DESC,
      })
      .then((res) => {
        if (res.status_code === 200 && Array.isArray(res.data)) {
          setHistoryList(res.data);
          setTotalCount(res._pagination.total_count);
        }
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const columns: DataTableColumn<IGetHistoryList>[] = useMemo(
    () => [
      {
        title: 'ดู',
        accessor: 'view',
        render: (record) => {
          return (
            <button
              onClick={() => {
                setIsViewOnly(true);
                modalVersion.open();
                setSelectedVersion(record.version);
              }}
            >
              <IconEye />
            </button>
          );
        },
      },
      {
        accessor: 'id',
        title: '#',
      },
      {
        title: 'Version',
        accessor: 'version',
        sortable: true,
      },
      {
        title: 'แก้ไขโดย',
        accessor: 'updated_by',
        render: (record) => {
          return (
            <span className="">
              {record.first_name} {record.last_name}
            </span>
          );
        },
      },
      {
        title: 'คำนำหน้า',
        accessor: 'title',
      },
      {
        title: 'ชื่อ',
        accessor: 'first_name',
      },
      {
        title: 'สกุล',
        accessor: 'last_name',
      },
      {
        title: 'อีเมล์',
        accessor: 'email',
      },
      {
        title: 'แก้ไขเริ่ม',
        accessor: 'start_edit_at',
        render: (record) => {
          return (
            // 20 ก.พ 2565 24:24
            <span className="">
              {new Date(record.start_edit_at).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </span>
          );
        },
      },
      {
        title: 'แก้ไขถึง',
        accessor: 'end_edit_at',
        render: (record) => {
          return (
            // 20 ก.พ 2565 24:24
            <span className="">
              {new Date(record.end_edit_at).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </span>
          );
        },
      },
      {
        title: 'ตำแหน่ง',
        accessor: 'user-roles',
        render: (record) => {
          return <span className="">{record.user_access_name?.join(', ')}</span>;
        },
      },
      {
        title: 'เปรียบเทียบ',
        accessor: 'compare-action',
        render: (record) => {
          return (
            <button
              disabled={record.is_current_version}
              onClick={() => {
                modalVersion.open();
                setIsViewOnly(false);
                setSelectedVersion(record.version);
              }}
              className={
                record.is_current_version
                  ? 'cursor-not-allowed text-neutral-300 underline decoration-neutral-300'
                  : 'cursor-pointer text-blue-500 underline'
              }
            >
              เปรียบเทียบ
            </button>
          );
        },
      },
    ],
    [],
  );

  return (
    <LayoutDefault>
      <CWBreadcrumbs
        showSchoolName
        links={[
          {
            href: '/',
            label: 'การเรียนการสอน',
            disabled: true,
          },
          {
            href: '/',
            label: 'ระบบตัดเกรด (ปพ.)',
            disabled: true,
          },
          {
            href: '/grade-system/data-entry',
            label: 'ใบตัดเกรดของฉัน',
          },
          {
            href: '/grade-system/data-entry/$sheetId',
            label: 'กรอกข้อมูลใบตัดเกรด',
          },
          {
            href: '/',
            label: 'ประวัติการกรอกข้อมูล',
          },
        ]}
      />

      <div className="my-5">
        <CWTitleBack
          href={`/grade-system/data-entry/${sheetId}`}
          label="ประวัติการกรอกข้อมูล"
        />
      </div>

      <HeaderHistory
        className="my-5"
        sheetId={sheetId}
        onSheetNotFound={() => {
          showMessage('ไม่พับใบตัดเกรดนี้', 'warning');
        }}
      />

      <div className="datatables">
        <DataTable
          className="text-nowrap"
          fetching={fetching}
          records={historyList}
          idAccessor={(record) => `history-item-${record.id}`}
          columns={columns}
          page={page}
          recordsPerPage={pageSize}
          onPageChange={setPage}
          onRecordsPerPageChange={setPageSize}
          recordsPerPageOptions={pageSizeOptions}
          totalRecords={totalCount}
          noRecordsText="ไม่พบข้อมูล"
          paginationText={({ from, totalRecords }) => {
            const currentPage = Math.ceil(from / pageSize);
            const totalPage = Math.ceil(totalRecords / pageSize);
            return `แสดงที่ ${currentPage} จาก ${totalPage} หน้า`;
          }}
          height={'calc(100vh - 350px)'}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          sortIcons={{
            sorted: <IconSorted />,
            unsorted: <IconUnSorted />,
          }}
        />
      </div>

      {selectedVersion && (
        <ModalSubjectTable
          viewOnly={isViewOnly}
          version={selectedVersion}
          sheetId={sheetId}
          isOpen={modalVersion.isOpen}
          onClose={() => {
            modalVersion.close();
            setSelectedVersion(null);
          }}
          onSaveToNewVersionSuccess={() => {
            fetchHistoryList();
          }}
          onRetrieveVersionSuccess={() => {
            fetchHistoryList();
          }}
        />
      )}
    </LayoutDefault>
  );
};

export default DomainJSX;
