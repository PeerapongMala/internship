import { useEffect, useMemo, useRef, useState } from 'react';
import MainLayout from '../local/components/template/MainLayout';
import OutcomeTable from './components/web/organism/IndicatorTable';
import {
  BulkEditItem,
  Content,
  Curriculum,
  Indicator,
  Learning,
  LearningContent,
  LearningStatus,
  Standard,
  Year,
} from '../local/type';
import Tabs from '../local/components/organism/Tabs';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';

import IconUpload from '@core/design-system/library/component/icon/IconUpload';

import CreateContent from './components/web/template/CreateContent';

import CWButton from '@component/web/cw-button';
import CWInputSearch from '@component/web/cw-input-search';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';

import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { toDateTimeTH } from '@global/utils/date';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobalPersist from '@store/global/persist';
import { useNavigate, Link } from '@tanstack/react-router';
import { DataTableColumn, DataTable } from 'mantine-datatable';
import API from '../local/api';
import { LearningFilterQueryParams } from '../local/api/repository';
import showMessage from '@global/utils/showMessage';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWSelectValue from '@component/web/cw-selectValue';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import usePagination from '@global/hooks/usePagination';
import CWSelect from '@component/web/cw-select';

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

  const [currentPage, setCurrentPage] = useState<'main' | 'create'>('main');
  const modalDownload = useModal();
  const modalUpload = useModal();

  const modalArchive = useModal();
  const modalRecall = useModal();
  const handleClick = () => {
    alert('Click');
  };

  const [filterSearch, setFilterSearch] = useState<LearningFilterQueryParams>({});

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

  const [records, setRecords] = useState<Indicator[]>([]);
  const [yearData, setYearData] = useState<Year[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<Indicator[]>([]);

  const [learningAreaData, setLearningAreaData] = useState<Learning[]>([]);
  const [contentData, setContentData] = useState<Content[]>([]);
  const [standardData, setStandardData] = useState<Standard[]>([]);
  const [learningContentData, setLearningContentData] = useState<LearningContent[]>([]);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const refUpload = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFetching(true);
    API.Year.Gets(Number(curriculumId), {})
      .then((res) => {
        if (res.status_code === 200) {
          setYearData(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);
  useEffect(() => {
    setFetching(true);
    API.LearningArea.Gets(Number(curriculumId), {
      year_id: filterSearch.year_id,
    })
      .then((res) => {
        if (res.status_code === 200) {
          setLearningAreaData(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [filterSearch.year_id]);
  useEffect(() => {
    setFetching(true);
    API.Content.Gets(Number(curriculumId), {
      learning_area_id: filterSearch.learning_area_id,
    })
      .then((res) => {
        if (res.status_code === 200) {
          setContentData(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [filterSearch.learning_area_id]);
  useEffect(() => {
    setFetching(true);
    API.Standard.Gets(Number(curriculumId), {
      content_id: filterSearch.content_id,
    })
      .then((res) => {
        if (res.status_code === 200) {
          setStandardData(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [filterSearch.content_id]);

  useEffect(() => {
    setFetching(true);
    API.learningContent
      .Gets(Number(curriculumId), {
        criteria_id: filterSearch.criteria_id,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setLearningContentData(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [filterSearch.criteria_id]);

  const [selectArchive, setSelectArchive] = useState<Indicator>({
    id: 0,
    status: LearningStatus.IN_USE,
    name: '',
    short_name: '',
    transcript_name: '',
  });

  const confirmArchive = () => {
    modalArchive.close();
    modalRecall.close();
    API.Indicator.Update(selectArchive.id as number, {
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
        fetchIndicator();
      });
  };

  const yearOptions = yearData.map((year) => ({
    label: year.seed_year_name || '',
    value: year.id,
  }));
  const learningAreaOptions = learningAreaData.map((data) => ({
    label: data.name || '',
    value: data.id,
  }));
  const contentOptions = contentData.map((data) => ({
    label: data.name || '',
    value: data.id,
  }));
  const standardOptions = standardData.map((data) => ({
    label: data.name || '',
    value: data.id,
  }));
  const learningContentOptions = learningAreaData.map((data) => ({
    label: data.name || '',
    value: data.id,
  }));

  const onConfirmDownload = () => {
    API.Indicator.DownloadCSV({
      curriculum_group_id: Number(curriculumId),
      start_date: startDate,
      end_date: endDate,
    }).then((res) => {
      modalDownload.close();
    });
  };

  useEffect(() => {
    fetchIndicator();
  }, [page, pageSize, filterSearch, curriculumId, currentPage]);

  const fetchIndicator = () => {
    setFetching(true);
    API.Indicator.Gets(Number(curriculumId), {
      page,
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
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const handleBulkEdit = (status: LearningStatus) => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }

    const updatedRecords = selectedRecords.map((record) => ({
      indicator_id: record.id,
      status,
    }));

    setFetching(true);
    API.Indicator.BulkEdit({ bulk_edit_list: updatedRecords as BulkEditItem[] })
      .then((res) => {
        console.log(res.message);
        if (res.status_code === 200) {
          showMessage('อัปเดตสถานะสำเร็จ');
        } else {
          showMessage('การอัปเดตล้มเหลว', 'error');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        showMessage('เกิดข้อผิดพลาดในการอัปเดตข้อมูล', 'error');
      })
      .finally(() => {
        setFetching(false);
        fetchIndicator();
      });
  };

  const columnDefs = useMemo<DataTableColumn<Indicator>[]>(() => {
    return [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสตัวชี้วัด' },
      { accessor: 'short_name', title: 'ชื่อย่อ' },
      { accessor: 'transcript_name', title: 'ชื่อบน ปพ.' },
      { accessor: 'name', title: 'ตัวชี้วัด / ผลการเรียนรู้' },
      { accessor: 'learning_content_name', title: 'สาระการเรียนรู้' },

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
        render: ({ id }) => (
          <Link to="./$indicatorId/edit" params={{ indicatorId: id }}>
            <IconPen />
          </Link>
        ),
      },
      {
        accessor: 'archive',
        title: 'จัดเก็บ',
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
  }, [filterSearch]);

  return (
    <div className="w-full">
      {currentPage === 'main' ? (
        <MainLayout
          title="มาตรฐานหลัก"
          breadcrumbItems={[
            { label: 'เกี่ยวกับหลักสูตร', href: '#' },
            { label: 'มาตรฐานหลัก' },
          ]}
          tabIndex={4}
        >
          <div className="w-full">
            {/* filter */}
            <div className="flex justify-between">
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
                  title={'เพิ่มตัวชี้วัด'}
                  variant={'primary'}
                />
                <p className="border-0 border-l border-neutral-300" />
                <CWInputSearch
                  placeholder="ค้นหา"
                  value={filterSearch.search_text}
                  onChange={(e) =>
                    setFilterSearch({ ...filterSearch, search_text: e.target.value })
                  }
                  onClick={fetchIndicator}
                />
              </div>
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
                        fetchIndicator();
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
                    learning_area_id: undefined,
                    content_id: undefined,
                    criteria_id: undefined,
                    learning_content_id: undefined,
                  }));
                }}
                required={false}
                title={'ชั้นปีทั้งหมด'}
                className="col-span-2"
              />
              <CWSelect
                options={learningAreaOptions}
                value={filterSearch.learning_area_id}
                onChange={(e) => {
                  const value = e.target.value
                  setFilterSearch((prev) => ({
                    ...prev,
                    learning_area_id: Number(value),
                    content_id: undefined,
                    criteria_id: undefined,
                    learning_content_id: undefined,
                  }));
                }}
                required={false}
                title={'กลุ่มสาระการเรียนรู้'}
                className="col-span-2"
                disabled={!filterSearch.year_id}
              />
              <CWSelect
                options={contentOptions}
                value={filterSearch.content_id}
                onChange={(e) => {
                  const value = e.target.value
                  setFilterSearch((prev) => ({
                    ...prev,
                    content_id: Number(value),

                    criteria_id: undefined,
                    learning_content_id: undefined,
                  }));
                }}
                required={false}
                title={'สาระทั้งหมด'}
                className="col-span-2"
                disabled={!filterSearch.learning_area_id}
              />
              <CWSelect
                options={standardOptions}
                value={filterSearch.criteria_id}
                onChange={(e) => {
                  const value = e.target.value
                  setFilterSearch((prev) => ({
                    ...prev,
                    criteria_id: Number(value),
                    learning_content_id: undefined,
                  }));
                }}
                required={false}
                title={'มาตรฐานทั้งหมด'}
                className="col-span-2"
                disabled={!filterSearch.content_id}
              />
              <CWSelect
                options={learningContentOptions}
                value={filterSearch.learning_content_id}
                onChange={(e) => {
                  const value = e.target.value
                  setFilterSearch((prev) => ({
                    ...prev,
                    learning_content_id: Number(value),
                  }));
                }}
                required={false}
                title={'สาระการเรียนรู้ทั้งหมด'}
                className="col-span-2"
                disabled={!filterSearch.criteria_id}
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
                  onSelectedRecordsChange={setSelectedRecords}
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
            title={'เพิ่มตัวชี้วัด'}
            setCurrentPage={setCurrentPage}
            handleClick={handleClick}
            curriculumId={curriculumId}
          />
        </div>
      )}
    </div>
  );
};

export default DomainJSX;
