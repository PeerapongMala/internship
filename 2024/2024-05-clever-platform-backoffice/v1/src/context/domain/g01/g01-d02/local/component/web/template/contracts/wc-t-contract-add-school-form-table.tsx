import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import Modal from '@domain/g01/g01-d02/local/component/web/atom/wc-a-modal';
import { School, AffiliationContract } from '@domain/g01/g01-d02/local/type';
import { Link } from '@tanstack/react-router';
import { DataTableColumn, DataTable } from 'mantine-datatable';
import { useState, useEffect, useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { ModalAddSchool } from './wc-t-modal-add-school';
import API from '@domain/g01/g01-d02/local/api';
import { useDebouncedValue } from '@mantine/hooks';
import showMessage from '@global/utils/showMessage';
import CWMDropdown from '@component/web/molecule/cw-m-dropdown';
import CWInputSearch from '@component/web/cw-input-search';
import usePagination from '@global/hooks/usePagination';

interface AffiliationContractAddSchoolFormTableProps {
  affiliationId: string;
  contractId?: string;
}

function AffiliationContractAddSchoolFormTable({
  affiliationId,
  contractId,
}: AffiliationContractAddSchoolFormTableProps) {
  const [isModalAddSchoolOpen, setModalAddSchoolOpen] = useState<boolean>(false);

  const {
    page,
    pageSize,
    totalCount: totalRecord,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecord,
    pageSizeOptions,
  } = usePagination();

  const [selectedRecords, setSelectedRecords] = useState<School[]>([]);
  const [records, setRecords] = useState<School[]>([]);

  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText] = useDebouncedValue(searchText, 200);

  const [targetSchool, setTargetSchool] = useState<School>();
  const [isModalExportVisible, setModalExportVisible] = useState<boolean>(false);
  const [isModalRemoveSchoolVisible, setModalRemoveSchoolVisible] =
    useState<boolean>(false);
  const [isModalRemoveAllSchoolVisible, setModalRemoveAllSchoolVisible] =
    useState<boolean>(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [contractId, debouncedSearchText, page, pageSize]);

  function fetchRecords() {
    if (contractId) {
      setFetching(true);
      API.affiliationContract
        .GetSchoolsContract(contractId, {
          page,
          limit: pageSize,
          search_text: debouncedSearchText,
        })
        .then((res) => {
          if (res.status_code === 200) {
            setRecords(res.data);
            setTotalRecord(res._pagination.total_count);
          } else {
            showMessage(res.message, 'error');
          }
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }

  const columnDefs = useMemo<DataTableColumn<School>[]>(() => {
    const finalDefs: DataTableColumn<School>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสโรงเรียน' },
      { accessor: 'school_code', title: 'รหัสย่อโรงเรียน' },
      { accessor: 'school_name', title: 'ชื่อโรงเรียน' },
      {
        accessor: 'remove',
        title: 'เอาออก',
        // this column has custom cell data rendering
        render: (record) => (
          <div
            onClick={() => {
              setTargetSchool(record);
              setModalRemoveSchoolVisible(true);
            }}
          >
            <IconX className="cursor-pointer" />
          </div>
        ),
      },
    ];
    return finalDefs;
  }, []);

  function handleRemoveSingleSchool() {
    if (targetSchool && contractId) {
      API.affiliationContract
        .DeleteContractSchool(+contractId, [+targetSchool.id])
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('นำออกสำเร็จ', 'success');
            fetchRecords();
          } else {
            showMessage(res.message, 'error');
          }
        });
    } else {
      showMessage('กรุณาเลือกโรงเรียน', 'error');
    }
  }

  function handleRemoveSelectedSchool() {
    if (contractId) {
      API.affiliationContract
        .DeleteContractSchool(
          +contractId,
          selectedRecords.map((record) => +record.id),
        )
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            showMessage('นำออกสำเร็จ', 'success');
            fetchRecords();
          } else {
            showMessage(res.message, 'error');
          }
        });
    } else {
      showMessage('กรุณาเลือกโรงเรียน', 'error');
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
              CSV
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

      <Modal
        open={isModalRemoveAllSchoolVisible}
        onClose={() => setModalRemoveAllSchoolVisible(false)}
        className="w-[400px] font-noto-sans-thai"
        title="เอาโรงเรียนทั้งหมดที่เลือกออก"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline-dark flex-1"
              onClick={() => setModalRemoveAllSchoolVisible(false)}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-danger flex-1 gap-1"
              onClick={() => {
                handleRemoveSelectedSchool();
                setSelectedRecords([]);
                setModalRemoveAllSchoolVisible(false);
              }}
            >
              ยืนยัน
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          โรงเรียนที่คุณเลือกจะถูกเอาออกจากในสัญญา
        </div>
      </Modal>

      <Modal
        open={isModalRemoveSchoolVisible}
        onClose={() => {
          setTargetSchool(undefined);
          setModalRemoveSchoolVisible(false);
        }}
        className="w-[400px] font-noto-sans-thai"
        title="เอาโรงเรียนที่เลือกออก"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline-dark flex-1"
              onClick={() => {
                setTargetSchool(undefined);
                setModalRemoveSchoolVisible(false);
              }}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-danger flex-1 gap-1"
              onClick={() => {
                handleRemoveSingleSchool();
                setTargetSchool(undefined);
                setModalRemoveSchoolVisible(false);
              }}
            >
              ยืนยัน
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          โรงเรียนที่คุณเลือกจะถูกเอาออกจากในสัญญา
        </div>
      </Modal>

      <div className="flex flex-col gap-5">
        <span className="text-xl font-bold leading-8">เพิ่มโรงเรียน</span>

        {/** first row */}
        <div className="flex max-h-[40px] justify-between">
          <div className="flex gap-2.5">
            <div className="dropdown">
              <CWMDropdown
                disabled={!selectedRecords.length}
                items={[
                  {
                    label: (
                      <div className="flex items-center gap-3">
                        <IconX />
                        เอาออก
                      </div>
                    ),
                    onClick: () => {
                      setModalRemoveAllSchoolVisible(true);
                    },
                  },
                ]}
                label={
                  <>
                    Bulk Edit
                    <IconCaretDown />
                  </>
                }
              />
            </div>
            <button
              type="button"
              className="btn btn-primary gap-1"
              onClick={() => {
                setModalAddSchoolOpen(true);
              }}
            >
              <IconPlus />
              เพิ่มโรงเรียน
            </button>
            <span className="h-full !w-px bg-neutral-300" />

            <CWInputSearch
              placeholder="รหัสโรงเรียน, ชื่อโรงเรียน..."
              onChange={(evt) => {
                const value = evt.currentTarget.value;
                setSearchText(value);
              }}
            />
          </div>
        </div>
        {/** table content */}
        <div className="table-responsive">
          <DataTable
            className="table-hover whitespace-nowrap"
            columns={columnDefs}
            records={records}
            totalRecords={totalRecord}
            page={page}
            fetching={fetching}
            onPageChange={setPage}
            recordsPerPage={pageSize}
            recordsPerPageOptions={pageSizeOptions}
            onRecordsPerPageChange={setPageSize}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            minHeight={200}
            paginationText={({ from, totalRecords }) => {
              const currentPage = Math.ceil(from / pageSize);
              const totalPage = Math.ceil(totalRecords / pageSize);
              return `แสดงหน้าที่ ${currentPage} จากทั้งหมด ${totalPage} หน้า`;
            }}
            noRecordsText="ไม่พบข้อมูล"
          />
        </div>
      </div>
      <ModalAddSchool
        affiliationId={affiliationId}
        contractId={contractId}
        open={isModalAddSchoolOpen}
        onClose={() => {
          fetchRecords();
          setModalAddSchoolOpen(false);
        }}
      />
    </>
  );
}

export default AffiliationContractAddSchoolFormTable;
