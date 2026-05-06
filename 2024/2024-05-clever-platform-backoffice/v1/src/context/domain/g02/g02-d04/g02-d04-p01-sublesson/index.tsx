// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import SelectItemPage from '../local/components/organisms/SelectItemPage';
import Pagination from '../local/components/organisms/Pagination';

import FilterTabs from '../local/components/organisms/FilterTabs';
import Box from '../local/components/atom/Box';
import API from '../local/api';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';
import {
  Checkbox,
  Input,
} from '@core/design-system/library/vristo/source/components/Input';
import Breadcrumbs from '../local/components/atom/Breadcums';

import {
  Subject,
  SubjectSubLessons,
  ResponseSubjectSubLessons,
  IPagination,
} from '../local/api/type';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import ModalExport from '../local/components/modal/ModalExport';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import ModalImport from '../local/components/modal/ModalImport';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';

import VolatileStore from '@store/global/volatile';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import { LessonStatus } from '@domain/g02/g02-d03/local/Type';
import showMessage from '@global/utils/showMessage';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import { BulkEditItem, Sublesson } from '../local/Type';
import StoreGlobalPersist from '@store/global/persist';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import CWTitleGroup from '@component/web/cw-title-group';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWButton from '@component/web/cw-button';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWWhiteBox from '@component/web/cw-white-box';
import Tabs from '@component/web/cw-tabs';
import CWInputSearch from '@component/web/cw-input-search';
import ModalSortBy from '../local/components/modal/ModalSortBy';
import { convertIdToThreeDigit } from '@domain/g02/g02-d05/local/util';
import CWTitleBack from '@component/web/cw-title-back';
import { toDateTimeTH } from '@global/utils/date';
import { useSubLessonFileUpdate } from '../local/hooks/useSubLessonFileUpdate';
import IconTask from '@core/design-system/library/component/icon/IconTask';
import BadgeLatestStatus from '@component/web/atom/cw-a-badge-latest-status';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { lessonId } = useParams({ from: '/content-creator/sublesson/$lessonId' });
  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);

  // modal
  const modalSortBy = useModal();
  const modalDownload = useModal();

  const refUpload = useRef<HTMLInputElement>(null);

  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<SubjectSubLessons[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<SubjectSubLessons[]>([]);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [openSort, setOpenSort] = useState(false);
  const [levelsListState, setLevelsListState] = useState<any[]>([]);

  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [filterSearch, setFilterSearch] = useState<{
    search_text: string;
    year_id: undefined;
    status: LessonStatus | undefined;
  }>({
    search_text: '',
    year_id: undefined,
    status: undefined,
  });
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  useEffect(() => {
    fetchSubLessonList();
  }, [filterSearch, pagination.page, pagination.limit]);

  const fetchSubLessonList = () => {
    setFetching(true);
    API.Sublesson.SubLessonList.Get(lessonId, {
      ...filterSearch,
      page: pagination.page,
      limit: pagination.limit,
    })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res._pagination.total_count,
          }));
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
  };

  const handleBulkEdit = (status: LessonStatus) => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }
    const updatedRecords = selectedRecords.map((record) => ({
      sub_lesson_id: record.id,
      status,
    }));
    API.Sublesson.BulkEdit.Post({ bulk_edit_list: updatedRecords })
      .then((res: any) => {
        console.log(res.message);
        if (res.status_code === 200) {
          showMessage('อัปเดตสถานะสำเร็จ');
          fetchSubLessonList();
        } else {
          showMessage('การอัปเดตล้มเหลว', 'error');
        }
      })
      .catch((error: any) => {
        console.error('Error fetching data:', error);
        showMessage('เกิดข้อผิดพลาดในการอัปเดตข้อมูล', 'error');
      });
  };

  const onConfirmDownload = () => {
    if (!startDate || !endDate) {
      showMessage('โปรดเลือกวันที่', 'warning');
      return;
    }
    API.Sublesson.DownloadCSV.Get({
      lesson_id: subjectData.id,
      start_date: startDate,
      end_date: endDate,
    }).then(() => {
      showMessage('ดาวน์โหลดสำเร็จ', 'success');
      modalDownload.close();
      fetchSubLessonList();
    });
  };

  useEffect(() => {
    const sortedData = [...records].sort((a, b) => a.index - b.index);

    setLevelsListState(
      sortedData.map((record, index) => ({
        id: record.id,
        label: `ID : ${record.id} / ${record.name}`,
        name: record.name,
        index: record.index,
        disabledUp: index === 0,
        disabledDown: index === sortedData.length - 1,
      })),
    );
  }, [records]);

  const swapIndex = (currentIndex: number, direction: 'up' | 'down') => {
    setLevelsListState((prev) => {
      const newList = [...prev];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= newList.length) return prev;

      const movedItem = newList[currentIndex];
      newList[currentIndex] = newList[targetIndex];
      newList[targetIndex] = movedItem;

      return newList.map((item, index) => ({
        ...item,
        index: index + 1,
        label: `ID : ${item.id} / ${item.name}`,
      }));
    });
  };

  const submitSort = async () => {
    const newLevelsList = {
      sub_lessons: levelsListState
        .map(({ id, index }) => ({ [id]: index }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    };
    API.Sublesson.SubLessonSoft.Patch(lessonId, newLevelsList).then((res) => {
      if (res.status_code === 200) {
        showMessage('บันทึกสำเร็จ', 'success');
        fetchSubLessonList();
        setOpenSort(false);
      } else {
        showMessage(res.message, 'error');
      }
    });
  };

  const updateStatus = (
    subLessonId: number,
    status: LessonStatus,
    fetchSubLessonList: () => void,
  ) => {
    API.Sublesson.BulkEdit.Post({
      bulk_edit_list: [
        {
          sub_lesson_id: subLessonId,
          status,
        },
      ],
    }).then((res) => {
      if (res.status_code === 200) {
        showMessage('อัปเดตสถานะสําเร็จ');
      } else {
        showMessage(res.message, 'error');
      }
      fetchSubLessonList();
    });
  };

  const { handleSubLessonUpdate, isFetchSubLessonFileUpdate } = useSubLessonFileUpdate();

  const columnDefs = useMemo<DataTableColumn<SubjectSubLessons>[]>(() => {
    const rowColumns: DataTableColumn<SubjectSubLessons>[] = [
      {
        accessor: 'id',
        title: '#ID',
        render: (record: any, index: number) => <>{record.id}</>,
      },
      {
        accessor: 'index',
        title: 'บทย่อยที่',
      },
      {
        accessor: 'name',
        title: 'ชื่อบทเรียนย่อย',
      },
      {
        accessor: 'indicator_id',
        title: 'รหัสตัวชี้วัด',
      },
      {
        accessor: 'indicator_name',
        title: 'ตัวชี้วัด',
      },
      {
        accessor: 'level_count',
        title: 'จำนวนด่าน',
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
      },
      {
        accessor: 'status',
        title: 'สถานะ',
        render: ({ status }) => {
          if (status === LessonStatus.IN_USE)
            return <span className="badge badge-outline-success">ใช้งาน</span>;
          else if (status === LessonStatus.DRAFT)
            return <span className="badge badge-outline-dark">แบบร่าง</span>;
          else if (status === LessonStatus.NOT_IN_USE)
            return <span className="badge badge-outline-danger">ไม่ใช้งาน</span>;
        },
      },
      {
        accessor: 'file_is_updated',
        title: 'สถานะปัจจุบัน',
        render: ({ file_is_updated, status }) => {
          if (status === LessonStatus.DRAFT) {
            return '-';
          }
          return <BadgeLatestStatus isLatest={file_is_updated} />;
        },
      },
      {
        accessor: 'update_sub_lesson',
        title: 'อัปเดตบทเรียนย่อย',
        titleClassName: 'text-center',
        cellsClassName: 'flex w-full justify-center',
        render: (record) => (
          <button
            disabled={
              record.file_is_updated ||
              isFetchSubLessonFileUpdate ||
              record.status === LessonStatus.DRAFT
            }
            onClick={() => handleSubLessonUpdate([record.id], () => fetchSubLessonList())}
          >
            <IconTask
              className={`${record.status === LessonStatus.DRAFT ? 'text-slate-200' : ''}`}
            />
          </button>
        ),
      },
      {
        accessor: 'edit',
        title: 'แก้ไข',
        render: (record: any, index: number) => (
          <Link to={`/content-creator/sublesson/${lessonId}/${record.id}/edit`}>
            <button>
              <IconPen />
            </button>
          </Link>
        ),
      },
      {
        accessor: 'search',
        title: 'ดูด่าน',
        render: (record: any, index: number) => (
          <div className="flex gap-2">
            <Link to={`/content-creator/level/${record.id}`}>
              <IconSearch />
            </Link>
          </div>
        ),
      },
      {
        accessor: 'storage',
        title: 'จัดเก็บ',
        render: (record) => (
          <div className="flex gap-2">
            {record.status === LessonStatus.IN_USE ? (
              <button
                onClick={() =>
                  updateStatus(record.id, LessonStatus.NOT_IN_USE, fetchSubLessonList)
                }
              >
                <IconArchive />
              </button>
            ) : (
              <button
                onClick={() =>
                  updateStatus(record.id, LessonStatus.IN_USE, fetchSubLessonList)
                }
              >
                <IconCornerUpLeft />
              </button>
            )}
          </div>
        ),
      },
    ];
    return rowColumns;
  }, [filterSearch]);

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '/' },
          { label: 'จัดการบทเรียน', href: '/content-creator/lesson' },
          { label: 'บทเรียนย่อย', href: '/content-creator/sublesson' },
        ]}
      />
      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData.name} (${curriculumData.short_name})`,
          `${subjectData.seed_year_short_name}`,
          `${subjectData.seed_subject_group_name}`,
          `${subjectData.name}`,
        ]}
        className="mt-5"
      />
      <div className="w-full">
        <div className="my-5">
          <CWTitleBack label="จัดการบทเรียนย่อย" href="../../lesson" />
          {/* <h1 className="font-bold text-[26px]">จัดการบทเรียนย่อย</h1> */}
          <p className="mt-2">
            สร้างบทเรียนแต่ละวิชา พร้อมทั้งกำหนดตัวชี้วัดแต่ละบทเรียน
          </p>
        </div>

        <CWWhiteBox className="mt-5">
          <div className="flex w-full flex-col justify-between lg:flex-row">
            <div className="flex flex-col items-center gap-2 lg:flex-row">
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
                        onClick={() => handleBulkEdit(LessonStatus.IN_USE)}
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
                        onClick={() => handleBulkEdit(LessonStatus.NOT_IN_USE)}
                      >
                        <div className="flex w-full justify-between">
                          <span>ปิดใช้งาน</span>
                          <IconArchive />
                        </div>
                      </button>
                    </li>
                  </ul>
                </Dropdown>
              </div>

              <Link
                to={`/content-creator/sublesson/${lessonId}/create`}
                params={{ lessonId: lessonId }}
              >
                <button className="btn btn-primary flex gap-1">
                  <IconPlus /> เพิ่มบทเรียนย่อย
                </button>
              </Link>

              <CWButton
                icon={<IconPlus />}
                onClick={() => setOpenSort(true)}
                title="เรียงลำดับ"
              />

              {/* <ModalSortBy open={modalSortBy.isOpen} onClose={modalSortBy.close} /> */}
              <ModalSortBy
                open={openSort}
                onClose={() => setOpenSort(false)}
                onOk={submitSort}
                data={levelsListState}
                setData={setLevelsListState}
                enbledAddQuestion={false}
                prefix="ด่านที่ "
                title="เรียงลำดับด่าน"
                swapIndex={swapIndex}
              />
              <span className="hidden h-full w-[2px] bg-neutral-300 xl:block" />

              <CWInputSearch
                placeholder="ค้นหา"
                onChange={(e) => {
                  setFilterSearch((p) => {
                    return {
                      ...p,
                      search_text: e.target.value,
                    };
                  });
                }}
                onClick={() => {
                  fetchSubLessonList();
                }}
                className="ml-0.5"
              />
            </div>

            <div className="mt-3 flex justify-center gap-3 lg:mt-0">
              <CWButton
                title="Download"
                variant="primary"
                onClick={modalDownload.open}
                icon={<IconDownload />}
              />
              <CWModalDownload
                datetimeFormat={true}
                startDate={startDate}
                endDate={endDate}
                onDownload={onConfirmDownload}
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                open={modalDownload.isOpen}
                onClose={modalDownload.close}
              />
              <CWButton
                title="Upload"
                variant="primary"
                onClick={() => refUpload.current?.click()}
                icon={<IconUpload />}
              />

              <input
                ref={refUpload}
                value={''}
                accept=".csv"
                onChange={(e) => {
                  API.Sublesson.UploadCSV.Post(
                    e.target.files![0],
                    curriculumData.id,
                  ).then((res) => {
                    if (res.status_code === 200 || res.status_code === 201) {
                      showMessage('อัพโหลดสําเร็จ');
                      fetchSubLessonList();
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

          <div className="mt-5 w-full">
            <Tabs
              currentTab={filterSearch.status}
              setCurrentTab={(value) => {
                setFilterSearch((prev) => ({
                  ...prev,
                  status: value as LessonStatus | undefined,
                }));
              }}
              tabs={[
                { label: 'ทั้งหมด', value: undefined },
                { label: 'แบบร่าง', value: LessonStatus.DRAFT },
                { label: 'ใช้งาน', value: LessonStatus.IN_USE },
                { label: 'ไม่ใช้งาน', value: LessonStatus.NOT_IN_USE },
              ]}
            />

            <div className="mt-5 w-full">
              <div className="datatables">
                <DataTable
                  fetching={fetching}
                  className="table-hover whitespace-nowrap"
                  records={records}
                  columns={columnDefs}
                  selectedRecords={selectedRecords}
                  onSelectedRecordsChange={setSelectedRecords}
                  highlightOnHover
                  withTableBorder
                  withColumnBorders
                  minHeight={200}
                  height={'calc(100vh - 350px)'}
                  noRecordsText="ไม่พบข้อมูล"
                  totalRecords={pagination.total_count}
                  recordsPerPage={pagination.limit}
                  page={pagination.page}
                  onPageChange={(page) => {
                    setPagination((prev) => ({
                      ...prev,
                      page,
                    }));
                  }}
                  onRecordsPerPageChange={(limit: number) => {
                    setPagination((prev) => ({
                      ...prev,
                      limit,
                      page: 1,
                    }));
                  }}
                  recordsPerPageOptions={pageSizeOptions}
                  paginationText={({ from, to, totalRecords }) =>
                    `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
                  }
                />
              </div>
            </div>
          </div>
        </CWWhiteBox>
      </div>
    </div>
  );
};

export default DomainJSX;
