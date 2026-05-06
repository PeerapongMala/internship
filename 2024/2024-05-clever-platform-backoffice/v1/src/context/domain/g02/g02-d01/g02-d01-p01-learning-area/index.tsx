import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import MainLayout from '../local/components/template/MainLayout';
import { BulkEditItem, Curriculum, Learning, LearningStatus, Year } from '../local/type';
import Tabs from '../local/components/organism/Tabs';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';

import CreateContent from './components/web/template/CreateContent';
import CWSelect from '@component/web/cw-select';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWInputSearch from '@component/web/cw-input-search';
import CWButton from '@component/web/cw-button';
import API from '../local/api';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { Link, useNavigate } from '@tanstack/react-router';
import { LearningFilterQueryParams } from '../local/api/repository';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobalPersist from '@store/global/persist';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import showMessage from '@global/utils/showMessage';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWSelectValue from '@component/web/cw-selectValue';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import usePagination from '@global/hooks/usePagination';
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const curriculumId = curriculumData?.id;

  useEffect(() => {
    if (!curriculumData) {
      navigate({
        to: '/curriculum',
      });
    } else if (!accessToken) {
      navigate({ to: '/' });
    }
  }, []);

  const [user, setUser] = useState({ id: '', first_name: '' });
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);

  useEffect(() => {
    if (globalUserData) {
      setUser({
        id: globalUserData.id || '',
        first_name: globalUserData.first_name || '',
      });
    }
  }, []);

  const [currentPage, setCurrentPage] = useState<'main' | 'create'>('main');
  const modalDownload = useModal();
  const modalArchive = useModal();
  const modalRecall = useModal();
  const [selectArchive, setSelectArchive] = useState<Learning>({
    id: 0,
    status: LearningStatus.IN_USE,
    name: '',
  });

  const confirmArchive = () => {
    modalArchive.close();
    modalRecall.close();
    API.LearningArea.Update(selectArchive.id as number, {
      ...selectArchive,
    })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ', 'success');
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((error) => showMessage(error.message, 'error'))
      .finally(() => {
        fetchLearning();
      });
  };

  const [filterSearch, setFilterSearch] = useState<LearningFilterQueryParams>({
    search_text: '',
    year_id: undefined,
    status: undefined,
  });

  const [fetching, setFetching] = useState<boolean>(false);
  const {
    page,
    pageSize,
    totalCount: totalRecord,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecord,
    pageSizeOptions,
  } = usePagination();

  const [selectedRecords, setSelectedRecords] = useState<Learning[]>([]);
  const [records, setRecords] = useState<Learning[]>([]);
  const [yearData, setYearData] = useState<Year[]>([]);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const refUpload = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFetching(true);
    API.Year.Gets(Number(curriculumId), {})
      .then((res) => {
        if (res.status_code === 200) {
          setYearData(res.data);
        } else if (res.status_code === 401) {
          navigate({ to: '/' });
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:');
        showMessage(error, 'error');
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const yearOptions = yearData.map((year) => ({
    label: year.seed_year_name || '',
    value: year.id,
  }));

  useEffect(() => {
    fetchLearning();
  }, [page, pageSize, filterSearch, curriculumId, currentPage]);

  const fetchLearning = () => {
    setFetching(true);
    API.LearningArea.Gets(Number(curriculumId), {
      page: page,
      limit: pageSize,
      ...filterSearch,
    })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setTotalRecord(res._pagination.total_count);
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((error: any) => {
        showMessage(`เกิดข้อผิดพลาดในการดึงข้อมูล ${error}`, 'error');
      })
      .finally(() => {
        setFetching(false);
      });
  };

  // todo bulk edit
  const handleBulkEdit = (status: LearningStatus) => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }

    const updatedRecords = selectedRecords.map((record) => ({
      learning_area_id: record.id,
      status,
    }));

    setFetching(true);
    API.LearningArea.BulkEdit({ bulk_edit_list: updatedRecords as BulkEditItem[] })
      .then((res) => {
        console.log(res.message);
        if (res.status_code === 200) {
          showMessage('อัปเดตสถานะสำเร็จ');
        } else {
          showMessage('การอัปเดตล้มเหลว', 'error');
        }
      })
      .catch((error: any) => {
        showMessage(`เกิดข้อผิดพลาดในการอัปเดตข้อมูล ${error}`, 'error');
      })
      .finally(() => {
        setFetching(false);
        fetchLearning();
      });
  };

  const columnDefs = useMemo<DataTableColumn<Learning>[]>(() => {
    const finalDefs: DataTableColumn<Learning>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสกลุ่มสาระ' },
      { accessor: 'name', title: 'ชื่อกลุ่มสาระการเรียนรู้' },
      { accessor: 'seed_year_name', title: 'ชั้นปี' },
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
          if (status === LearningStatus.IN_USE)
            return <span className="badge badge-outline-success">ใช้งาน</span>;
          else if (status === LearningStatus.DRAFT)
            return <span className="badge badge-outline-dark">แบบร่าง</span>;
          else if (status === LearningStatus.NOT_IN_USE)
            return <span className="badge badge-outline-danger">ไม่ใช้งาน</span>;
        },
      },
      {
        accessor: 'edit',
        title: 'แก้ไข',
        // this column has custom cell data rendering
        render: ({ id }) => (
          <Link to="./$learningAreaId/edit" params={{ learningAreaId: id }}>
            <IconPen />
          </Link>
        ),
      },
      {
        accessor: 'archive',
        title: 'จัดเก็บ',
        // this column has custom cell data rendering
        render: (record) => {
          const { status } = record;
          return status === LearningStatus.NOT_IN_USE ? (
            <button
              type="button"
              onClick={() => {
                setSelectArchive({
                  ...record,
                  status: LearningStatus.IN_USE,
                });
                modalRecall.open();
              }}
            >
              <IconCornerUpLeft />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectArchive({
                  ...record,
                  status: LearningStatus.NOT_IN_USE,
                });
                modalArchive.open();
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

  const handleSelectionChange = (selectedRows: SetStateAction<Learning[]>) => {
    setSelectedRecords(selectedRows);
  };

  const onConfirmDownload = () => {
    API.LearningArea.DownloadCSV({
      curriculum_group_id: Number(curriculumId),
      start_date: startDate,
      end_date: endDate,
    }).then((res) => {
      modalDownload.close();
    });
  };

  return (
    <div className="w-full">
      {currentPage === 'main' ? (
        <MainLayout
          title="มาตรฐานหลัก"
          breadcrumbItems={[
            { label: 'เกี่ยวกับหลักสูตร', href: '#' },
            { label: 'มาตรฐานหลัก' },
          ]}
          tabIndex={0}
        >
          <div className="w-full">
            {/* filter */}
            <div className="flex justify-between">
              <div className="flex">
                <div className="flex gap-x-[10px]">
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
                            className="w-full"
                            onClick={() => handleBulkEdit(LearningStatus.IN_USE)}
                          >
                            <div className="flex w-full justify-between">
                              <span>เปิดใช้งาน</span>
                              <IconCornerUpLeft />
                            </div>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="w-full"
                            onClick={() => handleBulkEdit(LearningStatus.NOT_IN_USE)}
                          >
                            <div className="flex w-full justify-between">
                              <span>จัดเก็บ</span>
                              <IconArchive />
                            </div>
                          </button>
                        </li>
                      </ul>
                    </Dropdown>
                  </div>

                  <CWButton
                    onClick={() => setCurrentPage('create')}
                    icon={<IconPlus />}
                    title={'เพิ่มกลุ่มสาระการเรียนรู้'}
                    variant={'primary'}
                  />
                  <p className="border-0 border-l border-neutral-300" />
                  <CWInputSearch
                    onClick={fetchLearning}
                    placeholder="ค้นหา"
                    value={filterSearch.search_text}
                    onChange={(e) =>
                      setFilterSearch((prev) => ({
                        ...prev,
                        search_text: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {/* Download , Upload */}
              {/* Todo Download , Upload */}
              <div className="flex gap-x-[10px]">
                <button
                  className="btn btn-primary flex gap-1"
                  onClick={modalDownload.open}
                >
                  {' '}
                  <IconDownload /> Download
                </button>
                <CWModalDownload
                  onDownload={onConfirmDownload}
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  open={modalDownload.isOpen}
                  onClose={modalDownload.close}
                />
                <button
                  className="btn btn-primary flex gap-1"
                  onClick={() => refUpload.current?.click()}
                >
                  {' '}
                  <IconUpload /> Upload
                </button>
                <input
                  ref={refUpload}
                  value={''}
                  accept=".csv"
                  onChange={(e) => {
                    API.LearningArea.UploadCSV(
                      e.target.files![0],
                      curriculumData.id,
                    ).then((res) => {
                      if (res.status_code === 200 || res.status_code === 201) {
                        showMessage('อัพโหลดสําเร็จ');
                        fetchLearning();
                      } else {
                        showMessage(res.message, 'error');
                      }
                    });
                  }}
                  className="hidden"
                  type="file"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-12 gap-5">
              <CWSelect
                options={yearOptions}
                value={filterSearch.year_id}
                onChange={(e) => {
                  const value = e.target.value
                  setFilterSearch((prev) => ({
                    ...prev,
                    year_id: Number(value),
                  }));
                }}
                required={false}
                title={'ชั้นปีทั้งหมด'}
                className="col-span-2"
              />
            </div>
            <div className="mt-5">
              <Tabs
                currentTab={filterSearch.status}
                setCurrentTab={(value) => {
                  setFilterSearch((prev) => ({
                    ...prev,
                    status: value as LearningStatus,
                  }));
                }}
                tabs={[
                  { label: 'ทั้งหมด', value: undefined },
                  { label: 'แบบร่าง', value: LearningStatus.DRAFT },
                  { label: 'ใช้งาน', value: LearningStatus.IN_USE },
                  { label: 'ไม่ใช้งาน', value: LearningStatus.NOT_IN_USE },
                ]}
              />
              <div className="table-responsive mt-3">
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
                  onSelectedRecordsChange={handleSelectionChange}
                  minHeight={200}
                  paginationText={({ from, totalRecords }) => {
                    const currentPage = Math.ceil(from / pageSize);
                    const totalPage = Math.ceil(totalRecords / pageSize);
                    return `แสดงที่ ${currentPage} จาก ${totalPage} หน้า`;
                  }}
                  fetching={fetching}
                  loaderType="oval"
                  loaderBackgroundBlur={4}
                  height={'calc(100vh - 350px)'}
                  noRecordsText="ไม่พบข้อมูล"
                />
              </div>
            </div>

            <CWModalArchive
              open={modalArchive.isOpen}
              onOk={confirmArchive}
              onClose={() => {
                modalArchive.close();
              }}
            />
            <CWModalArchiveRecall
              open={modalRecall.isOpen}
              onOk={confirmArchive}
              onClose={() => {
                modalRecall.close();
              }}
            />
          </div>
        </MainLayout>
      ) : (
        <div className="w-full">
          <CreateContent
            title={'เพิ่มกลุ่มสาระการเรียนรู้'}
            userId={user.first_name}
            setCurrentPage={setCurrentPage}
            curriculumId={curriculumId}
          />
        </div>
      )}
    </div>
  );
};

export default DomainJSX;
