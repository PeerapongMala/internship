// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import showMessage from '@global/utils/showMessage';

import AffiliationHeader from './component/web/template/wc-t-header';
import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';

import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { UseStatus, AffiliationGroupType, Affiliation } from '../local/type';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import Tabs from '../local/component/web/molecule/wc-m-tabs';
import Modal from '../local/component/web/atom/wc-a-modal';
import API from '../local/api';
import { useDebouncedValue } from '@mantine/hooks';
import { AffiliationFilterQueryParams } from '../local/api/repository/affiliation';
import FilterSearchDOE from './component/web/template/wc-t-filter-doe';
import FilterSearchDefault from './component/web/template/wc-t-filter-default';
import FilterSearchLAO from './component/web/template/wc-t-filter-lao';
import FilterSearchOBEC from './component/web/template/wc-t-filter-obec';
import { toDateTimeTH } from '@global/utils/date';
import ModalAction from '../local/component/web/organism/wc-o-modal-action';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [filterSearch, setFilterSearch] = useState<AffiliationFilterQueryParams>({
    school_affiliation_group: AffiliationGroupType.OBEC,
  });

  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText] = useDebouncedValue(searchText, 200);

  const {
    page,
    pageSize,
    totalCount: totalRecord,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecord,
    pageSizeOptions,
  } = usePagination();

  const [isFetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<Affiliation[]>([]);
  const [records, setRecords] = useState<Affiliation[]>([
    {
      id: 1,
      school_affiliation_group: AffiliationGroupType.OTHER,
      type: 'เอกชน',
      name: 'สำนักงานเขตการศึกษาเขต 1',
      short_name: 'กก',
      status: UseStatus.IN_USE,
      created_at: '2024-11-18T17:25:19.821779Z',
      created_by: '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10',
    },
  ]);

  const [targetAffiliation, setTargetAffiliation] = useState<Affiliation>();
  const [isModalExportVisible, setModalExportVisible] = useState<boolean>(false);
  const [isModalOpenAllAffiliationVisible, setModalOpenAllAffiliationVisible] =
    useState<boolean>(false);
  const [isModalOpenAffiliationVisible, setModalOpenAffiliationVisible] =
    useState<boolean>(false);
  const [isModalCloseAllAffiliationVisible, setModalCloseAllAffiliationVisible] =
    useState<boolean>(false);
  const [isModalCloseAffiliationVisible, setModalCloseAffiliationVisible] =
    useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []); // Make sure to provide an appropriate dependency array

  useEffect(() => {
    fetchAffiliation();
  }, [filterSearch, page, pageSize]);

  const fetchAffiliation = async () => {
    try {
      setFetching(true);
      const res = await API.affiliation.Gets({
        page,
        limit: pageSize,
        ...filterSearch,
      });
      if (res.status_code === 200) {
        setRecords(res.data);
        setTotalRecord(res._pagination.total_count);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setFilterSearch((prev) => {
      return { ...prev, search_text: debouncedSearchText };
    });
  }, [debouncedSearchText]);

  const filterRowRender = () => {
    if (filterSearch.school_affiliation_group === AffiliationGroupType.DOE) {
      return <FilterSearchDOE filter={filterSearch} setFilter={setFilterSearch} />;
    } else if (filterSearch.school_affiliation_group === AffiliationGroupType.LAO) {
      return <FilterSearchLAO filter={filterSearch} setFilter={setFilterSearch} />;
    } else if (filterSearch.school_affiliation_group === AffiliationGroupType.OBEC) {
      return <FilterSearchOBEC filter={filterSearch} setFilter={setFilterSearch} />;
    } else if (filterSearch.school_affiliation_group === AffiliationGroupType.OPEC) {
      return <FilterSearchDefault filter={filterSearch} setFilter={setFilterSearch} />;
    }
    // other group type doesn't have type
    return;
  };

  const columnDefs = useMemo<DataTableColumn<Affiliation>[]>(() => {
    let groupTypeDefs: DataTableColumn<Affiliation>[] = [];

    switch (filterSearch.school_affiliation_group) {
      case AffiliationGroupType.OBEC: {
        groupTypeDefs = [
          { accessor: 'inspection_area', title: 'เขตตรวจราชการ' },
          { accessor: 'area_office', title: 'เขตพื้นที่' },
          { accessor: 'type', title: 'ประเภท' },
        ];
        break;
      }
      case AffiliationGroupType.DOE: {
        groupTypeDefs = [
          { accessor: 'district_zone', title: 'กลุ่มเขต' },
          { accessor: 'district', title: 'เขตพื้นที่' },
          { accessor: 'type', title: 'ประเภท' },
        ];
        break;
      }
      case AffiliationGroupType.LAO: {
        groupTypeDefs = [
          { accessor: 'lao_type', title: 'ประเภท' },
          { accessor: 'province', title: 'จังหวัด' },
          { accessor: 'district', title: 'อำเภอ' },
          { accessor: 'sub_district', title: 'ตำบล' },
        ];
        break;
      }
      case AffiliationGroupType.OPEC: {
        groupTypeDefs = [{ accessor: 'type', title: 'ประเภท' }];
        break;
      }
    }

    const finalDefs: DataTableColumn<Affiliation>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสสังกัด' },
      { accessor: 'name', title: 'ชื่อสังกัด' },
      { accessor: 'short_name', title: 'ตัวย่อ' },
      ...groupTypeDefs,
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
        // this column has custom cell data rendering
        render: ({ id }) => (
          <Link to="./$affiliationId" params={{ affiliationId: id }}>
            <IconPen />
          </Link>
        ),
      },
      {
        accessor: 'archive',
        title: 'ปิดสังกัด',
        // this column has custom cell data rendering
        render: (record) => {
          const { status } = record;
          return status === UseStatus.NOT_IN_USE ? (
            <button
              type="button"
              onClick={() => {
                setTargetAffiliation(record);
                setModalOpenAffiliationVisible(true);
              }}
            >
              <IconCornerUpLeft />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTargetAffiliation(record);
                setModalCloseAffiliationVisible(true);
              }}
            >
              <IconArchive />
            </button>
          );
        },
      },
    ];

    return finalDefs;
  }, [filterSearch]);

  const handleDownload = async () => {
    const fromDate = document.getElementById(
      'from-export-datetime-input',
    ) as HTMLInputElement;
    const toDate = document.getElementById(
      'to-export-datetime-input',
    ) as HTMLInputElement;

    if (!fromDate.value || !toDate.value) {
      // TODO: แสดง error message
      showMessage('กรุณาเลือกวันที่', 'error');
      return;
    }

    try {
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        // สร้างเวลาที่มีความละเอียดถึง microseconds
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const microseconds = String(Math.floor(Math.random() * 999999)).padStart(6, '0');

        return `${date.toISOString().split('T')[0]}T${hours}:${minutes}:${seconds}.${microseconds}Z`;
      };

      const startDate = formatDate(fromDate.value);
      const endDate = formatDate(toDate.value);

      const blob = await API.affiliation.Download(startDate, endDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `affiliations-${fromDate.value}-to-${toDate.value}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showMessage('ดาวน์โหลดสำเร็จ');
      setModalExportVisible(false);
    } catch (error) {
      console.error('Download failed:', error);
      // TODO: แสดง error message
      showMessage('ดาวน์โหลดล้มเหลว', 'error');
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await API.affiliation.Upload(file);
      if (response.status_code === 200 || response.status_code === 201) {
        // TODO: แสดง success message
        showMessage('อัพโหลดสำเร็จ');
        fetchAffiliation(); // refresh data
      } else {
        // TODO: แสดง error message
      }
    } catch (error) {
      showMessage('อัพโหลดล้มเหลว', 'error');
      console.error('Upload failed:', error);
      // TODO: แสดง error message
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <LayoutDefault>
      <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
        {/** header */}
        <AffiliationHeader />
        {/** tabs */}
        <Tabs
          currentTab={filterSearch.school_affiliation_group}
          setCurrentTab={(value) => {
            setFilterSearch((prev) => {
              return { ...prev, school_affiliation_group: value as AffiliationGroupType };
            });
          }}
          tabs={[
            { label: AffiliationGroupType.OBEC, value: AffiliationGroupType.OBEC },
            { label: AffiliationGroupType.DOE, value: AffiliationGroupType.DOE },
            { label: AffiliationGroupType.LAO, value: AffiliationGroupType.LAO },
            { label: AffiliationGroupType.OPEC, value: AffiliationGroupType.OPEC },
            { label: AffiliationGroupType.OTHER, value: AffiliationGroupType.OTHER },
          ]}
        />
        {/** content container */}
        <div className="flex flex-col gap-5 rounded-md bg-white p-5 shadow">
          {/** first row */}
          <div className="flex max-h-[40px] justify-between">
            <div className="flex gap-2.5">
              <div className="dropdown">
                <Dropdown
                  placement={'bottom-start'}
                  btnClassName="btn btn-primary dropdown-toggle gap-1"
                  button={
                    <>
                      Bulk Edit
                      <IconCaretDown />
                    </>
                  }
                  disabled={selectedRecords.length === 0}
                >
                  <ul className="!min-w-[170px]">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setModalOpenAllAffiliationVisible(true);
                        }}
                      >
                        เปิดสังกัด
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setModalCloseAllAffiliationVisible(true);
                        }}
                      >
                        ปิดสังกัด
                      </button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
              <Link
                to="./create"
                search={() => {
                  return {
                    group:
                      filterSearch.school_affiliation_group ?? AffiliationGroupType.OBEC,
                  };
                }}
              >
                <button type="button" className="btn btn-primary gap-1">
                  <IconPlus />
                  เพิ่มสังกัด
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
                onClick={() => setModalExportVisible(true)}
              >
                <IconDownload />
                Download
              </button>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleUpload}
                ref={fileInputRef}
              />
              <button
                type="button"
                className="btn btn-primary flex gap-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <IconUpload />
                Upload
              </button>
            </div>
          </div>
          {/** second row */}
          <div className="flex max-h-[40px] gap-6">{filterRowRender()}</div>
          {/** table tabs */}
          <Tabs
            currentTab={filterSearch.status}
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
              fetching={isFetching}
              loaderType="oval"
              loaderBackgroundBlur={4}
              height={'calc(100vh - 350px)'}
              noRecordsText="ไม่พบข้อมูล"
            />
          </div>
        </div>
      </div>

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
              onClick={handleDownload}
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

      <ModalAction
        open={isModalCloseAffiliationVisible}
        onClose={() => {
          setTargetAffiliation(undefined);
          setModalCloseAffiliationVisible(false);
        }}
        title="ปิดสังกัด"
        cancelButtonText="ยกเลิก"
        cancelButtonVariant="dark"
        acceptButtonText="จัดเก็บข้อมูลถาวร"
        acceptButtonVariant="danger"
        onAccept={() => {
          API.affiliation
            .Update({
              ...targetAffiliation,
              status: UseStatus.NOT_IN_USE,
            })
            .then((res) => {
              if (res.status_code === 200) {
                setModalCloseAffiliationVisible(false);
                fetchAffiliation();
              }
            });
        }}
      >
        <div className="flex flex-col gap-4">
          ข้อมูลที่คุณเลือกจะถูกซ่อนจากหน้านี้ถาวร และสำรองไว้ในฐานข้อมูล
          คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
        </div>
      </ModalAction>

      <ModalAction
        open={isModalCloseAllAffiliationVisible}
        onClose={() => {
          setSelectedRecords([]);
          setModalCloseAllAffiliationVisible(false);
        }}
        title="ปิดสังกัดทั้งหมดที่เลือก"
        cancelButtonText="ยกเลิก"
        cancelButtonVariant="dark"
        acceptButtonText="จัดเก็บข้อมูลถาวร"
        acceptButtonVariant="danger"
        onAccept={() => {
          Promise.all(
            selectedRecords.map((record) =>
              API.affiliation.Update({
                ...record,
                status: UseStatus.NOT_IN_USE,
              }),
            ),
          )
            .then(() => {
              setModalCloseAllAffiliationVisible(false);
              fetchAffiliation();
            })
            .catch((error) => {
              console.error('Error updating affiliations:', error);
            });
        }}
      >
        <div className="flex flex-col gap-4">
          ข้อมูลจะถูกซ่อนจากหน้านี้ถาวร และสำรองไว้ในฐานข้อมูล
          คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
        </div>
      </ModalAction>

      <ModalAction
        open={isModalOpenAffiliationVisible}
        onClose={() => {
          setTargetAffiliation(undefined);
          setModalOpenAffiliationVisible(false);
        }}
        title="เปิดสังกัด"
        cancelButtonText="ยกเลิก"
        cancelButtonVariant="dark"
        acceptButtonText="ยืนยัน"
        acceptButtonVariant="danger"
        onAccept={() => {
          API.affiliation
            .Update({
              ...targetAffiliation,
              status: UseStatus.IN_USE,
            })
            .then((res) => {
              if (res.status_code === 200) {
                setModalOpenAffiliationVisible(false);
                fetchAffiliation();
              }
            });
        }}
      >
        <div className="flex flex-col gap-4">
          ข้อมูลที่คุณเลือกจะเปิดใช้งานอีกครั้ง คุณยืนยันที่จะเปิดใช้งานหรือไม่
        </div>
      </ModalAction>

      <ModalAction
        open={isModalOpenAllAffiliationVisible}
        onClose={() => {
          setSelectedRecords([]);
          setModalOpenAllAffiliationVisible(false);
        }}
        title="เปิดสังกัดทั้งหมดที่เลือก"
        cancelButtonText="ยกเลิก"
        cancelButtonVariant="dark"
        acceptButtonText="ยืนยัน"
        acceptButtonVariant="danger"
        onAccept={() => {
          Promise.all(
            selectedRecords.map((record) =>
              API.affiliation.Update({
                ...record,
                status: UseStatus.IN_USE,
              }),
            ),
          )
            .then(() => {
              setModalOpenAffiliationVisible(false);
              fetchAffiliation();
            })
            .catch((error) => {
              console.error('Error updating affiliations:', error);
            });
        }}
      >
        <div className="flex flex-col gap-4">
          ข้อมูลที่คุณเลือกทั้งหมดจะเปิดใช้งานอีกครั้ง คุณยืนยันที่จะเปิดใช้งานหรือไม่
        </div>
      </ModalAction>
    </LayoutDefault>
  );
};

export default DomainJSX;
