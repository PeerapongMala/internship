import StoreGlobal from '@global/store/global';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  BulkEditItem,
  Curriculum,
  IReport,
  LearningStatus,
  SubCriteria,
  SubStandard,
  Year,
} from '../local/type';
import Tabs from '../local/components/organism/Tabs';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import { Input } from '@core/design-system/library/vristo/source/components/Input';

import Breadcrumbs from '@component/web/atom/Breadcums';

import CWTitleGroup from '@component/web/cw-title-group';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import CWButton from '@component/web/cw-button';
import API from '../local/api';
import { LearningFilterQueryParams } from '../local/api/repository';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { toDateTimeTH } from '@global/utils/date';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWInput from '@component/web/cw-input';
import CWInputSearch from '@component/web/cw-input-search';
import CWSelect from '@component/web/cw-select';
import StoreGlobalPersist from '@store/global/persist';
import showMessage from '@global/utils/showMessage';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWSelectValue from '@component/web/cw-selectValue';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import ModalEdit from '../local/components/Modal/ModalEdit';
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

  const [currentPage, setCurrentPage] = useState<'table' | 'report'>('table');
  const modalDownload = useModal();

  const modalArchive = useModal();
  const modalRecall = useModal();
  const modalEdit = useModal();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const [filterSearch, setFilterSearch] = useState<LearningFilterQueryParams>({
    search_text: '',
    year_id: undefined,
    status: undefined,
  });

  const {
    page,
    pageSize,
    totalCount: totalRecord,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecord,
    pageSizeOptions,
  } = usePagination();

  const [currentSubStandard, setCurrentSubStandard] = useState<SubCriteria[]>([]);
  const [selectedSubStandardId, setSelectedSubStandardId] = useState<number | null>(null);
  const [numberSubStandard, setNumberSubStandard] = useState(1);
  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<SubStandard[]>([]);
  const [reportRecords, setReportRecords] = useState<IReport[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<SubStandard[]>([]);
  const [yearData, setYearData] = useState<Year[]>([]);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [standardName, setStandardName] = useState<string>('');

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
    fetchSubStandardTopic();
  }, []);

  const fetchSubStandardTopic = () => {
    API.SubStandard.GetBySubStandard(Number(curriculumId), {})
      .then((res) => {
        if (res.status_code === 200) {
          // const foundSubStandard = res.data.find(
          //   (item: any) => item.index === sub_standard_id
          // );
          setCurrentSubStandard(res.data || null);
          if (res.data.length > 0) {
            setSelectedSubStandardId(res.data[0].id);
          }
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const [selectArchive, setSelectArchive] = useState<SubStandard>({
    id: 0,
    status: LearningStatus.IN_USE,
    indicator_short_name: '',
    indicator_transcript_name: '',
    indicator_name: '',
    name: '',
    seed_year_name: '',
    short_name: '',
  });

  const confirmArchive = () => {
    modalArchive.close();
    modalRecall.close();
    API.SubStandard.Update(selectArchive.id as number, {
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
        fetchSubStandard();
      });
  };

  useEffect(() => {
    fetchSubStandard();
  }, [selectedSubStandardId, page, pageSize, filterSearch, currentPage]);

  const fetchSubStandard = () => {
    if (!selectedSubStandardId) return;
    if (currentPage === 'table') {
      API.SubStandard.Gets(selectedSubStandardId, 'topics', {
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
        });
    } else {
      API.Report.Gets(selectedSubStandardId, {
        page,
        limit: pageSize,
        ...filterSearch,
      }).then((res) => {
        if (res.status_code === 200) {
          setReportRecords(res.data);
          setTotalRecord(res._pagination.total_count);
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  };

  const yearOptions = yearData.map((year) => ({
    label: year.seed_year_name || '',
    value: year.id,
  }));

  const incrementNumber = () => {
    const currentIndex = currentSubStandard.findIndex(
      (item) => item.id === selectedSubStandardId,
    );
    if (currentIndex < currentSubStandard.length - 1) {
      setSelectedSubStandardId(currentSubStandard[currentIndex + 1].id);
    }
  };

  const decrementNumber = () => {
    const currentIndex = currentSubStandard.findIndex(
      (item) => item.id === selectedSubStandardId,
    );
    if (currentIndex > 0) {
      setSelectedSubStandardId(currentSubStandard[currentIndex - 1].id);
    }
  };

  const handleBulkEdit = (status: LearningStatus) => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }

    const updatedRecords = selectedRecords.map((record) => ({
      sub_criteria_topic_id: record.id,
      status,
    }));

    setFetching(true);
    API.SubStandard.BulkEdit({ bulk_edit_list: updatedRecords as BulkEditItem[] })
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
        fetchSubStandard();
      });
  };

  const onConfirmDownload = () => {
    if (!selectedSubStandardId) return;
    API.SubStandard.DownloadCSV({
      sub_criteria_id: Number(selectedSubStandardId),
      start_date: startDate,
      end_date: endDate,
    }).then((res) => {
      modalDownload.close();
    });
  };

  const columnDefs = useMemo<DataTableColumn<SubStandard>[]>(() => {
    const finalDefs: DataTableColumn<SubStandard>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสมาตรฐาน' },
      { accessor: 'seed_year_name', title: 'ชั้นปี' },
      { accessor: 'short_name', title: 'ชื่อย่อ' },
      { accessor: 'name', title: 'ชื่อหัวข้อมาตรฐานย่อย' },
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
          <Link to="./$subStandardId/edit" params={{ subStandardId: id }}>
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

  const reportColumnDefs = useMemo<DataTableColumn<SubStandard>[]>(() => {
    const reportFinalDefs: DataTableColumn<SubStandard>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'indicator_id', title: 'รหัสตัวชี้วัด' },
      { accessor: 'indicator_short_name', title: 'ชื่อย่อตัวชี้วัด' },
      { accessor: 'seed_year_name', title: 'ชั้นปี' },
      { accessor: 'content_name', title: 'ชื่อสาระ' },
      { accessor: 'criteria_name', title: 'มาตรฐาน' },
      { accessor: 'learning_content_name', title: 'สาระการเรียนรู้' },
      { accessor: 'indicator_name', title: 'ตัวชี้วัด / ผลการเรียนรู้' },
      { accessor: 'lesson_name', title: 'บทเรียนหลัก' },
      { accessor: 'sub_lesson_name', title: 'บทเรียนย่อย' },
      { accessor: 'level_id', title: 'ด่านที่' },
    ];

    return reportFinalDefs;
  }, [filterSearch]);

  const handleUpdateSubStandard = () => {
    API.SubStandard.UpdateSubStandard(1, {})
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
        fetchSubStandard();
      });
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '/' },
          { label: 'มาตรฐานย่อย', href: '' },
          {
            label: `มาตรฐานย่อย ${currentSubStandard.find((item) => item.id === selectedSubStandardId)?.index || ''}`,
            href: '',
          },
        ]}
      />
      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData.name} (${curriculumData.short_name})`,
        ]}
        className="mt-5"
      />

      <div className="mt-5 flex w-full items-center justify-center gap-4 rounded-md py-4 text-lg font-bold">
        <div>มาตรฐานย่อย</div>
        <CWButton
          className="w-8"
          icon={<IconCaretDown className="h-6 w-6 rotate-90" />}
          onClick={decrementNumber}
          disabled={
            currentSubStandard.findIndex((item) => item.id === selectedSubStandardId) <= 0
          }
        />
        <div className="flex w-[100px] items-center gap-4">
          <CWInput
            type="text"
            className="w-full text-lg font-bold"
            value={
              currentSubStandard.find((item) => item.id === selectedSubStandardId)
                ?.index || ''
            }
            readOnly
            disabled
          />
          <div className="w-full">/ {currentSubStandard.length}</div>
        </div>
        <CWButton
          className="-ml-5 w-8"
          icon={<IconCaretDown className="h-6 w-6 -rotate-90" />}
          onClick={incrementNumber}
          disabled={
            currentSubStandard.findIndex((item) => item.id === selectedSubStandardId) >=
            currentSubStandard.length - 1
          }
        />
      </div>

      <div className="mt-5 flex w-full border-b-2 bg-white">
        <button
          className={`px-10 py-1.5 ${currentPage === 'table'
            ? 'border-b-2 border-primary text-primary'
            : 'text-gray-500'
            }`}
          onClick={() => setCurrentPage('table')}
        >
          ข้อมูลมาตรฐานย่อย
        </button>
        <button
          className={`px-10 py-1.5 ${currentPage === 'report'
            ? 'border-b-2 border-primary text-primary'
            : 'text-gray-500'
            }`}
          onClick={() => setCurrentPage('report')}
        >
          รายงาน
        </button>
      </div>

      {/* switch tap */}
      <div className="mt-5 rounded-md bg-white p-5 shadow-sm">
        {currentPage === 'table' ? (
          <div>
            <div className="flex justify-between">
              <div className="flex">
                <div className="flex gap-[10px]">
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
                    onClick={modalEdit.open}
                    icon={<IconPen />}
                    title="แก้ไขชื่อ"
                    className=""
                  />

                  <ModalEdit
                    open={modalEdit.isOpen}
                    onClose={modalEdit.close}
                    title={'แก้ไขชื่อมาตรฐาน'}
                    sub_standard_id={selectedSubStandardId}
                    data={
                      currentSubStandard.find((item) => item.id === selectedSubStandardId)
                        ?.name || ''
                    }
                    setData={(newName) => {
                      setCurrentSubStandard((prev) =>
                        prev.map((item) =>
                          item.id === selectedSubStandardId
                            ? { ...item, name: newName }
                            : item,
                        ),
                      );
                    }}
                    curriculumId={curriculumId}
                  />

                  <CWButton
                    icon={<IconPlus />}
                    title="  เพิ่มหัวข้อมาตรฐานย่อย"
                    onClick={() =>
                      navigate({ to: '/content-creator/standard/sub-standard-create' })
                    }
                  />

                  <p className="border-0 border-l border-neutral-300" />
                  <CWInputSearch
                    placeholder="ค้นหา"
                    value={filterSearch.search_text}
                    onChange={(e) =>
                      setFilterSearch((prev) => ({
                        ...prev,
                        search_text: e.target.value,
                      }))
                    }
                    onClick={fetchSubStandard}
                  />
                </div>
              </div>
              {/* Download , Upload */}
              <div className="flex gap-x-[10px]">
                {/* <button className='btn btn-primary flex gap-1' onClick={modalDownload.open}> <IconDownload />  Download</button>
                <CWModalDownload onDownload={onConfirmDownload} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} open={modalDownload.isOpen} onClose={modalDownload.close} /> */}
                {/* <button

                  className='btn btn-primary flex gap-1' onClick={() => refUpload.current?.click()}> <IconUpload />  Upload</button>

                <input ref={refUpload} value={''} accept=".csv" onChange={(e) => {
                  API.LearningArea.UploadCSV(e.target.files![0], curriculumData.id).then(res => {
                    if (res.status_code === 200 || res.status_code === 201) {
                      showMessage('อัพโหลดสําเร็จ')
                      fetchSubStandard()
                    } else {
                      showMessage(res.message, 'error')
                    }
                  })


                }} className='hidden' type="file" /> */}
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
                  setFilterSearch((prev) => {
                    return {
                      ...prev,
                      status: value as LearningStatus,
                    };
                  });
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
                  recordsPerPageOptions={[10, 25, 50]}
                  onRecordsPerPageChange={setPageSize}
                  selectedRecords={selectedRecords}
                  onSelectedRecordsChange={setSelectedRecords}
                  minHeight={200}
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
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex w-full justify-between">
              <div className="flex">
                <div className="flex gap-x-[10px]">
                  <CWInputSearch
                    placeholder="ค้นหา"
                    value={filterSearch.search_text}
                    onChange={(e) =>
                      setFilterSearch((prev) => ({
                        ...prev,
                        search_text: e.target.value,
                      }))
                    }
                    onClick={fetchSubStandard}
                  />
                </div>
              </div>
              <div className="-full">
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
              </div>
            </div>
            <div className="mt-5">
              <DataTable
                className="table-hover whitespace-nowrap"
                columns={reportColumnDefs}
                records={reportRecords}
                totalRecords={totalRecord}
                page={page}
                onPageChange={setPage}
                recordsPerPage={pageSize}
                recordsPerPageOptions={pageSizeOptions}
                onRecordsPerPageChange={setPageSize}
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
        )}
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
  );
};

export default DomainJSX;
