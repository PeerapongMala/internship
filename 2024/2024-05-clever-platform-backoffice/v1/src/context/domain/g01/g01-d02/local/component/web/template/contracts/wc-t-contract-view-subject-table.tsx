import { Subject, UseStatus } from '@domain/g01/g01-d02/local/type';
import { DataTableColumn, DataTable } from 'mantine-datatable';
import { useState, useEffect, useMemo } from 'react';
import API from '@domain/g01/g01-d02/local/api';
import { toDateTimeTH } from '@global/utils/date';
import CWButtonSwitch from '@component/web/cw-button-switch';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

interface AffiliationContractViewSubjectTableProps {
  affiliationId: string;
  contractId?: string;
}

function AffiliationContractViewSubjectTable({
  affiliationId,
  contractId,
}: AffiliationContractViewSubjectTableProps) {
  const {
    page,
    pageSize,
    totalCount,
    setPage,
    setPageSize,
    setTotalCount,
    pageSizeOptions,
  } = usePagination();

  const [records, setRecords] = useState<Subject[]>([]);

  useEffect(() => {
    if (contractId) {
      API.affiliationContract
        .GetSubjectsContract(contractId, { page, limit: pageSize })
        .then((res) => {
          if (res.status_code === 200) {
            const { data, _pagination } = res;
            setRecords(data);
            setTotalCount(_pagination.total_count);
          }
        });
    }
  }, [contractId, open, page, pageSize]);

  function onSubjectToggle(id: number, is_enabled: boolean) {
    if (contractId) {
      API.affiliationContract
        .ToggleContractSubjectGroup({
          contractId: +contractId,
          subjectGroupId: id,
          is_enabled,
        })
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('ปรับเปลี่ยนสำเร็จ', 'success');
          } else {
            showMessage(res.message, 'error');
          }
        });
    }
  }

  const columnDefs = useMemo<DataTableColumn<Subject>[]>(() => {
    const finalDefs: DataTableColumn<Subject>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสวิชา' },
      { accessor: 'curriculum_group', title: 'สังกัดวิชา' },
      { accessor: 'platform_name', title: 'แพลตฟอร์ม' },
      { accessor: 'subject_group', title: 'กลุ่มวิชา' },
      { accessor: 'year', title: 'ชั้นปี' },
      {
        accessor: 'subjects',
        title: 'วิชา',
        render: ({ subjects }) => {
          return subjects && subjects.length > 0 ? (
            <span className="truncate">{subjects.join(', ')}</span>
          ) : (
            '-'
          );
        },
      },
      {
        accessor: 'updated_at',
        title: 'แก้ไขล่าสุด',
        render: ({ updated_at }) => {
          return updated_at ? toDateTimeTH(updated_at) : '-';
        },
      },
      { accessor: 'updated_by', title: 'แก้ไขล่าสุดโดย' },
      {
        accessor: 'status',
        title: 'เปิดใช้งาน',
        render: (record) => {
          return (
            <CWButtonSwitch
              initialState={record.is_enabled}
              onToggle={() => {
                onSubjectToggle(+record.id, !record.is_enabled);
              }}
            />
          );
        },
      },
    ];
    return finalDefs;
  }, []);

  return (
    <>
      <div className="flex flex-col gap-5">
        {/** table content */}
        <div className="table-responsive">
          <DataTable
            className="table-hover whitespace-nowrap"
            columns={columnDefs}
            records={records}
            totalRecords={totalCount}
            page={page}
            onPageChange={setPage}
            recordsPerPage={pageSize}
            recordsPerPageOptions={pageSizeOptions}
            onRecordsPerPageChange={setPageSize}
            minHeight={200}
            paginationText={({ from, totalRecords }) => {
              const currentPage = Math.ceil(from / pageSize);
              const totalPage = Math.ceil(totalRecords / pageSize);
              return `แสดงหน้าที่ ${currentPage} จากทั้งหมด ${totalPage} หน้า`;
            }}
            noRecordsText="ไม่พบข้อมูล"
            defaultColumnRender={(record, index, accessor) => {
              let key = accessor as keyof typeof record;
              return key in record
                ? record[key] == null || record[key] == undefined
                  ? '-'
                  : record[key]
                : '-';
            }}
          />
        </div>
      </div>
    </>
  );
}

export default AffiliationContractViewSubjectTable;
