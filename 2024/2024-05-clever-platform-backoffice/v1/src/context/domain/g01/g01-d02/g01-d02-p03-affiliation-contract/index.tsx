// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';

import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import IconArchive from '@core/design-system/library/vristo/source/components/Icon/IconArchive';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { UseStatus, Affiliation, AffiliationContract } from '../local/type';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import Tabs from '../local/component/web/molecule/wc-m-tabs';
import Modal from '../local/component/web/atom/wc-a-modal';
import Breadcrumbs from '../local/component/web/atom/wc-a-breadcrumbs';
import LinkTabs from '../local/component/web/molecule/wc-m-link-tabs';
import API from '../local/api';
import { toDateTimeTH } from '@global/utils/date';
import { AffiliationContractFilterQueryParams } from '../local/api/repository/affiliation-contract';
import { useDebouncedValue } from '@mantine/hooks';
import showMessage from '@global/utils/showMessage';
import downloadCSV from '@global/utils/downloadCSV';
import IconTask from '@core/design-system/library/component/icon/IconTask';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  // get path variables
  const { affiliationId } = useParams({ strict: false });

  const [affiliation, setAffiliation] = useState<Affiliation>();

  const [filterSearch, setFilterSearch] =
    useState<AffiliationContractFilterQueryParams>();
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText] = useDebouncedValue(searchText, 200);

  const [records, setRecords] = useState<AffiliationContract[]>([]);
  const {
    page,
    pageSize,
    totalCount: totalRecord,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecord,
    pageSizeOptions,
  } = usePagination();

  const [fetching, setFetching] = useState(false);

  const [isModalDownloadVisible, setModalDownloadVisible] = useState<boolean>(false);
  const [isModalOpenAllAffiliationVisible, setModalOpenAllAffiliationVisible] =
    useState<boolean>(false);
  const [isModalCloseAllAffiliationVisible, setModalCloseAllAffiliationVisible] =
    useState<boolean>(false);
  const [isModalCloseAffiliationVisible, setModalCloseAffiliationVisible] =
    useState<boolean>(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reload, setReload] = useState(false);

  function onReload() {
    setReload((prev) => !prev);
  }

  function closeModalExport() {
    setModalDownloadVisible(false);
    setStartDate('');
    setEndDate('');
  }

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []); // Make sure to provide an appropriate dependency array

  useEffect(() => {
    if (affiliationId) {
      API.affiliation.GetById(affiliationId).then((res) => {
        if (res.status_code === 200) {
          setAffiliation(res.data);
        }
      });
    }
  }, [affiliationId]);

  useEffect(() => {
    setFetching(true);
    API.affiliationContract
      .Gets(affiliationId, { page: page, limit: pageSize, ...filterSearch })
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
  }, [affiliationId, filterSearch, page, pageSize, reload]);

  useEffect(() => {
    setFilterSearch((prev) => {
      return { ...prev, search_text: debouncedSearchText };
    });
  }, [debouncedSearchText]);

  function onDownload(query: { start_date: string; end_date: string }) {
    API.affiliationContract
      .DownloadCSV(affiliationId, {
        start_date: query.start_date ? query.start_date + 'T00:00:00Z' : undefined,
        end_date: query.end_date ? query.end_date + 'T00:00:00Z' : undefined,
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, 'affiliation_contracts.csv');
          closeModalExport();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onRefresh(contractId: number) {
    API.affiliationContract.Refresh(contractId).then((res) => {
      if (res.status_code == 200) {
        showMessage('อัพเดตสัญญาสำเร็จ', 'success');
        onReload();
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  const columnDefs = useMemo<DataTableColumn<AffiliationContract>[]>(() => {
    const finalDefs: DataTableColumn<AffiliationContract>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสสัญญา' },
      { accessor: 'name', title: 'ชื่อสัญญา' },
      { accessor: 'school_count', title: 'จำนวนโรงเรียน' },
      {
        accessor: 'start_date',
        title: 'วันที่เริ่มต้นสัญญา',
        render: ({ start_date }) => {
          return toDateTimeTH(start_date);
        },
      },
      {
        accessor: 'end_date',
        title: 'วันที่สิ้นสุดสัญญา',
        render: ({ end_date }) => {
          return toDateTimeTH(end_date);
        },
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
          return updated_by ?? '-';
        },
      },
      {
        accessor: 'status',
        title: 'เปิดใช้งาน',
        render: ({ status }) => {
          if (status === UseStatus.IN_USE)
            return <span className="badge badge-outline-success">ใช้งาน</span>;
          else if (status === UseStatus.DRAFT)
            return <span className="badge badge-outline-dark">แบบร่าง</span>;
          return <span className="badge badge-outline-danger">ไม่ใช้งาน</span>;
        },
      },
      {
        accessor: 'edit',
        title: 'แก้ไข',
        width: 80,
        titleClassName: 'text-center',
        cellsClassName: 'flex justify-center',
        // this column has custom cell data rendering
        render: ({ id }) => (
          <Link
            to="./$contractId"
            params={{ affiliationId: affiliation?.id, contractId: id }}
          >
            <IconPen />
          </Link>
        ),
      },
      {
        accessor: 'refresh',
        title: 'อัพเดตสัญญา',
        width: 180,
        titleClassName: 'text-center',
        cellsClassName: 'text-center',
        // this column has custom cell data rendering
        render: ({ id }) => (
          <button
            onClick={() => {
              if (id) {
                onRefresh(+id);
              }
            }}
          >
            <IconTask />
          </button>
        ),
      },
    ];
    return finalDefs;
  }, [affiliation]);

  return (
    <LayoutDefault>
      <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
        {/** header */}
        <>
          {/** breadcrumbs */}
          <CWBreadcrumbs
            links={[
              { label: 'สำหรับแอดมิน', href: '/', disabled: true },
              { label: 'สังกัดโรงเรียน', href: '/admin/affiliation' },
              {
                label: `${affiliation?.id}: ${affiliation?.name}`,
                href: '#',
              },
            ]}
          />
          {/** back button */}
          <div className="flex items-center gap-2.5">
            <Link to="../">
              <IconArrowBackward className="h-8 w-8 p-1" />
            </Link>
            <span className="text-2xl font-bold leading-8">แก้ไขสังกัด</span>
          </div>
          {/** affiliation title */}
          <div className="rounded-md bg-neutral-100 p-2.5">
            <span className="text-2xl font-bold leading-8">{affiliation?.name}</span>
          </div>
        </>

        {/** tabs */}
        <LinkTabs
          tabs={[
            { label: 'ข้อมูลสังกัด', href: `../` },
            {
              label: 'สัญญาสังกัด',
              href: `#`,
              active: true,
            },
          ]}
        />

        <div>
          สัญญาเป็นข้อกำหนดระยะเวลาการเข้าถึงแอป CLEVER
          โรงเรียนที่อยู่ภายใต้สังกัดนี้จะใช้สัญญานี้เป็นค่าเริ่มต้น
        </div>

        {/** content container */}
        <div className="flex flex-col gap-5 rounded-md bg-white p-5 shadow">
          {/** first row */}
          <div className="flex max-h-[40px] justify-between">
            <div className="flex gap-2.5">
              {/* <div className="dropdown">
                <Dropdown
                  placement={'bottom-start'}
                  btnClassName="btn btn-primary dropdown-toggle gap-1"
                  button={
                    <>
                      Bulk Edit
                      <IconCaretDown />
                    </>
                  }
                >
                  <ul className="!min-w-[170px]">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setModalOpenAllAffiliationVisible(true);
                        }}
                      >
                        เปิดสัญญา
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setModalCloseAllAffiliationVisible(true);
                        }}
                      >
                        ปิดสัญญา
                      </button>
                    </li>
                  </ul>
                </Dropdown>
              </div> */}
              <Link to="./create">
                <button type="button" className="btn btn-primary gap-1">
                  <IconPlus />
                  เพิ่มสัญญา
                </button>
              </Link>
              <span className="h-full !w-px bg-neutral-300" />

              <div className="relative">
                <input
                  type="text"
                  placeholder="ค้นหา"
                  className="form-input !pr-8"
                  value={searchText}
                  onChange={(evt) => setSearchText(evt.target.value)}
                />
                <button type="button" className="!absolute right-0 top-0 mr-2 h-full">
                  <IconSearch className="!h-5 !w-5" />
                </button>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                className="btn btn-primary flex gap-1"
                onClick={() => setModalDownloadVisible(true)}
              >
                <IconDownload />
                Download
              </button>
            </div>
          </div>
          {/** table tabs */}
          <Tabs
            currentTab={filterSearch?.status}
            setCurrentTab={(value) => {
              setFilterSearch((prev) => {
                return {
                  ...prev,
                  status: value as UseStatus,
                };
              });
            }}
            tabs={[
              { label: 'ทั้งหมด', value: undefined },
              { label: 'แบบร่าง', value: UseStatus.DRAFT },
              { label: 'ใช้งาน', value: UseStatus.IN_USE },
              {
                label: 'ไม่ใช้งาน',
                value: UseStatus.NOT_IN_USE,
              },
            ]}
          />
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
              minHeight={200}
              paginationText={({ from, totalRecords }) => {
                const currentPage = Math.ceil(from / pageSize);
                const totalPage = Math.ceil(totalRecords / pageSize);
                return `แสดงหน้าที่ ${currentPage} จากทั้งหมด ${totalPage} หน้า`;
              }}
              height={'calc(100vh - 350px)'}
              noRecordsText="ไม่พบข้อมูล"
            />
          </div>
        </div>
      </div>

      <Modal
        open={isModalDownloadVisible}
        onClose={closeModalExport}
        className="w-[400px] font-noto-sans-thai"
        title="ส่งออกข้อมูล"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline-dark flex-1"
              onClick={closeModalExport}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-primary flex-1 gap-1"
              onClick={() => onDownload({ start_date: startDate, end_date: endDate })}
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
              onChange={(e) => {
                const value = e.currentTarget.value;
                setStartDate(value);
              }}
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
              onChange={(e) => {
                const value = e.currentTarget.value;
                setEndDate(value);
              }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={isModalCloseAffiliationVisible}
        onClose={() => setModalCloseAffiliationVisible(false)}
        className="w-[400px] font-noto-sans-thai"
        title="ปิดสัญญา"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline-dark flex-1"
              onClick={() => setModalCloseAffiliationVisible(false)}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-danger flex-1 gap-1"
              onClick={() => setModalCloseAffiliationVisible(false)}
            >
              จัดเก็บข้อมูลถาวร
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          ข้อมูลจะถูกซ่อนจากหน้านี้ถาวร และสำรองไว้ในฐานข้อมูล
          คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
        </div>
      </Modal>

      <Modal
        open={isModalCloseAllAffiliationVisible}
        onClose={() => setModalCloseAllAffiliationVisible(false)}
        className="w-[400px] font-noto-sans-thai"
        title="ปิดสัญญาทั้งหมดที่เลือก"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline-dark flex-1"
              onClick={() => setModalCloseAllAffiliationVisible(false)}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-danger flex-1 gap-1"
              onClick={() => setModalCloseAllAffiliationVisible(false)}
            >
              จัดเก็บข้อมูลถาวร
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          ข้อมูลจะถูกซ่อนจากหน้านี้ถาวร และสำรองไว้ในฐานข้อมูล
          คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
        </div>
      </Modal>

      <Modal
        open={isModalOpenAllAffiliationVisible}
        onClose={() => setModalOpenAllAffiliationVisible(false)}
        className="w-[400px] font-noto-sans-thai"
        title="เปิดสัญญา"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline-dark flex-1"
              onClick={() => setModalOpenAllAffiliationVisible(false)}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-danger flex-1 gap-1"
              onClick={() => setModalOpenAllAffiliationVisible(false)}
            >
              เปิดสัญญา
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">เปิดสัญญา</div>
      </Modal>
    </LayoutDefault>
  );
};

export default DomainJSX;
