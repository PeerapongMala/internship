import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import Modal from '@domain/g01/g01-d02/local/component/web/atom/wc-a-modal';
import { AffiliationContract, Subject, SeedYear } from '@domain/g01/g01-d02/local/type';
import { DataTableColumn, DataTable } from 'mantine-datatable';
import { useState, useEffect, useMemo } from 'react';
import { ModalAddSubject } from './wc-t-modal-add-subject';
import API from '@domain/g01/g01-d02/local/api';
import Select from '@core/design-system/library/component/web/Select';
import { toDateTimeTH } from '@global/utils/date';
import showMessage from '@global/utils/showMessage';
import CWInputSearch from '@component/web/cw-input-search';
import CWSelect from '@component/web/cw-select';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import usePagination from '@global/hooks/usePagination';

interface AffiliationContractAddSubjectFormTableProps {
  affiliationId: string;
  contractId?: string;
  contract?: AffiliationContract;
}

function AffiliationContractAddSubjectFormTable({
  affiliationId,
  contractId,
}: AffiliationContractAddSubjectFormTableProps) {
  const [yearList, setYearList] = useState<SeedYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>();
  const [contract, setContract] = useState<AffiliationContract>();

  const {
    page,
    pageSize,
    totalCount,
    setPage,
    setPageSize,
    setTotalCount,
    pageSizeOptions,
  } = usePagination();

  const [searchText, setSearchText] = useState('');
  const [records, setRecords] = useState<Subject[]>([]);

  const [isModalAddSubjectOpen, setModalAddSubjectOpen] = useState<boolean>(false);

  const [isModalExportVisible, setModalExportVisible] = useState<boolean>(false);
  const [fetching, setFetching] = useState(false);
  const [reload, setReload] = useState(false);

  function onReload() {
    setReload((prev) => !prev);
  }

  useEffect(() => {
    fetchRecords();
  }, [contractId, open, page, pageSize, searchText, selectedYear, reload]);

  function fetchRecords() {
    if (contractId) {
      setFetching(true);
      API.affiliationContract
        .GetSubjectsContract(contractId, {
          page: page,
          limit: pageSize,
          search_text: searchText,
          seed_year_id: selectedYear,
        })
        .then((res) => {
          if (res.status_code === 200) {
            const { data, _pagination } = res;
            setRecords(data);
            setTotalCount(_pagination.total_count);
          } else {
            showMessage(res.message, 'error');
          }
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }

  useEffect(() => {
    if (contractId) {
      API.affiliationContract.GetById(contractId).then((res) => {
        if (res.status_code == 200) {
          setContract(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }, [contractId]);

  useEffect(() => {
    API.seedYear.Get().then((res) => {
      if (res.status_code === 200) {
        const { data } = res;
        setYearList(data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, []);

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
        accessor: 'removeBtn',
        title: 'เอาออก',
        width: 80,
        titleClassName: 'text-center',
        cellsClassName: 'text-center',
        render(record) {
          return (
            <button
              type="button"
              onClick={() => {
                onRemoveSubject(+record.id);
              }}
            >
              <IconX />
            </button>
          );
        },
      },
    ];
    return finalDefs;
  }, []);

  function onRemoveSubject(subjectId: number) {
    if (contractId) {
      API.affiliationContract
        .DeleteContractSubjectGroup(+contractId, [subjectId])
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('ลบสำเร็จ', 'success');
            onReload();
          } else {
            showMessage(res.message, 'error');
          }
        });
    }
  }

  return (
    <>
      <Modal
        open={isModalExportVisible}
        onClose={() => setModalExportVisible(false)}
        className="w-[400px] font-noto-sans-thai"
        title="ส่งออกข้อมูล"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline-dark flex-1"
              onClick={() => setModalExportVisible(false)}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-primary flex-1 gap-1"
              onClick={() => setModalExportVisible(false)}
            >
              <IconDownload />
              Download
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-0.5">
            <label htmlFor="from-export-datetime-input" className="font-normal">
              ตั้งแต่วันที่:
            </label>
            <input
              type="date"
              className="form-input !font-normal"
              placeholder="วว/ดด/ปปปป"
              id="from-export-datetime-input"
            />
          </div>

          <div className="space-y-0.5">
            <label htmlFor="to-export-datetime-input" className="font-normal">
              ถึงวันที่:
            </label>
            <input
              type="date"
              className="form-input !font-normal"
              id="to-export-datetime-input"
            />
          </div>
        </div>
      </Modal>

      <div className="flex flex-col gap-5">
        <span className="text-xl font-bold leading-8">เพิ่มหลักสูตร</span>

        {/** first row */}
        <div className="flex max-h-[40px] justify-between">
          <div className="flex gap-2.5">
            <button
              type="button"
              className="btn btn-primary gap-1"
              onClick={() => {
                setModalAddSubjectOpen(true);
              }}
            >
              <IconPlus />
              เพิ่มหลักสูตร
            </button>
            <span className="h-full !w-px bg-neutral-300" />

            <CWInputSearch
              onChange={(e) => {
                const value = e.currentTarget.value;
                setSearchText(value);
              }}
            />
          </div>
        </div>
        {/** second row */}
        <div className="flex gap-6">
          <CWSelect
            options={yearList.map((record) => {
              return {
                label: record.short_name,
                value: record.id.toString(),
              };
            })}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setSelectedYear(value);
            }}
            title={'ชั้นปี'}
            value={selectedYear}
            className="w-48"
          />
        </div>
        {/** table content */}
        <div className="table-responsive">
          <DataTable
            className="table-hover whitespace-nowrap"
            columns={columnDefs}
            records={records}
            totalRecords={totalCount}
            page={page}
            onPageChange={setPage}
            fetching={fetching}
            recordsPerPage={pageSize}
            recordsPerPageOptions={pageSizeOptions}
            onRecordsPerPageChange={setPageSize}
            minHeight={200}
            paginationText={({ from, totalRecords }) => {
              const currentPage = Math.ceil(from / pageSize);
              const totalPage = Math.ceil(totalRecords / pageSize);
              return `แสดงหน้าที่ ${currentPage} จากทั้งหมด ${totalPage} หน้า`;
            }}
            height={'calc(100vh - 350px)'}
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
      <ModalAddSubject
        affiliationId={affiliationId}
        contractId={contractId}
        platformId={contract?.seed_platform_id}
        open={isModalAddSubjectOpen}
        onClose={() => {
          fetchRecords();
          setModalAddSubjectOpen(false);
        }}
      />
    </>
  );
}

export default AffiliationContractAddSubjectFormTable;
