import Tabs from '@component/web/cw-tabs';
import CWWhiteBox from '@component/web/cw-white-box';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import {
  FilterLesson,
  FilterSubject,
  FilterSublesson,
  SeedYear,
  SpecialReward,
  Status,
} from '@domain/g04/g04-d04/local/type';
import { toDateTimeTH } from '@global/utils/date';
import { Link, useNavigate } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import CWModalAdditem from '../modal/cw-modal-item';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import API from '../../../api';
import { Pagination } from '@domain/g04/g04-d05/local/type';
import { FilterQueryParams } from '../../../api/repository';
import CWSelectValue from '@component/web/cw-selectValue';
import { useDebouncedValue } from '@mantine/hooks';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = (newSelectedIds: number[]) => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};
const CWRewardSpecial = ({ seedyearId }: { seedyearId: number }) => {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<SpecialReward[]>([]);
  const [subject, setSubject] = useState<FilterSubject[]>([]);
  const [lesson, setLesson] = useState<FilterLesson[]>([]);
  const [subLesson, setSubLesson] = useState<FilterSublesson[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<SpecialReward[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const modalAdditem = useModal();
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [filterSearch, setFilterSearch] = useState<FilterQueryParams>({
    subject_group_id: seedyearId,
    subject_id: undefined,
    lesson_id: undefined,
    sub_lesson_id: undefined,
    status: undefined,
    searchText: {
      key: '',
      value: '',
    },
  });
  const [debouncedFilterSearch] = useDebouncedValue(filterSearch, 300);
  const searchDropdownOptions = [
    { label: 'รหัสด่าน', value: 'id' },
    { label: 'จำนวนรางวัล', value: 'reward_amount' },
  ];
  const dropdownPlaceholder =
    searchDropdownOptions && searchDropdownOptions.length > 0
      ? searchDropdownOptions[0].label
      : 'ฟิลด์';

  useEffect(() => {
    setFilterSearch((prev) => ({
      ...prev,
      subject_group_id: seedyearId,
    }));
  }, [seedyearId]);

  useEffect(() => {
    fetchSubjects();
  }, [seedyearId, debouncedFilterSearch]);

  useEffect(() => {
    fetchLessons();
  }, [filterSearch.subject_id, seedyearId, debouncedFilterSearch]);

  useEffect(() => {
    fetchSubLessons();
  }, [filterSearch.lesson_id, seedyearId, debouncedFilterSearch]);

  useEffect(() => {
    fetchLevels();
  }, [debouncedFilterSearch, seedyearId, pagination.page, pagination.limit]);

  const fetchSubjects = async () => {
    if (!seedyearId) {
      return;
    }
    setFetching(true);
    try {
      const res = await API.gamification.GetSubject({ subject_group_id: seedyearId });
      if (res.status_code === 200) {
        setSubject(res.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setFetching(false);
    }
  };

  const fetchLessons = async () => {
    if (!filterSearch.subject_id) return;
    setFetching(true);
    try {
      const res = await API.gamification.GetLesson({
        subject_id: filterSearch.subject_id,
      });
      if (res.status_code === 200) {
        setLesson(res.data);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setFetching(false);
    }
  };

  const fetchSubLessons = async () => {
    if (!filterSearch.lesson_id) return;
    setFetching(true);
    try {
      const res = await API.gamification.GetSublesson({
        lesson_id: filterSearch.lesson_id,
      });
      if (res.status_code === 200) {
        setSubLesson(res.data);
      }
    } catch (error) {
      console.error('Error fetching sublessons:', error);
    } finally {
      setFetching(false);
    }
  };

  const fetchLevels = async () => {
    setFetching(true);

    try {
      const res = await API.gamification.GetsLevel({
        page: pagination.page,
        limit: pagination.limit,
        ...debouncedFilterSearch,
        [debouncedFilterSearch.searchText?.key as keyof FilterQueryParams]:
          debouncedFilterSearch.searchText?.value,
        subject_group_id: seedyearId,
      });

      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination?.total_count || res.data.length,
        }));
      } else if (res.status_code === 401) {
        navigate({ to: '/' });
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleOpenModal = useCallback((ids: number[]) => {
    setSelectedIds([]);
    setSelectedIds((prev) => {
      const newSelectedIds = [...new Set([...prev, ...ids])];
      modalAdditem.open(newSelectedIds);
      return newSelectedIds;
    });
  }, []);

  const columnDefs = useMemo<DataTableColumn<SpecialReward>[]>(() => {
    const finalDefs: DataTableColumn<SpecialReward>[] = [
      {
        accessor: 'view',
        title: 'ดู',
        render: ({ id, status }) => {
          return (
            <Link to="./$specialId/view" params={{ specialId: id }}>
              <IconEye />
            </Link>
          );
        },
      },
      // {
      //     accessor: "index",
      //     title: "#",
      //     render: (record, index) => {
      //         return index + 1;
      //     },
      // },
      { accessor: 'id', title: 'รหัสด่าน' },
      { accessor: 'reward_amount', title: 'จำนวนรางวัล' },
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
        title: 'สถานะ',
        render: ({ status }) => {
          if (status === Status.IN_USE)
            return <span className="badge badge-outline-success">เผยแพร่</span>;
          else if (status === Status.NOT_IN_USE)
            return <span className="badge badge-outline-danger">ไม่ใช้งาน</span>;
          else if (status === Status.SETTING)
            return <span className="badge badge-outline-warning">ตั้งค่าด่าน</span>;
          else if (status === Status.QUESTION)
            return <span className="badge badge-outline-secondary">จัดการคำถาม</span>;
          else if (status === Status.TRANSLATION)
            return <span className="badge badge-outline-primary">แปลภาษา</span>;
          else if (status === Status.SPEECH)
            return <span className="badge badge-outline-info">สร้างเสียง</span>;
        },
      },
      {
        accessor: 'edit',
        title: 'แก้ไข',
        render: ({ id, status }) => {
          const isDisabled =
            status === Status.DRAFT ||
            status === Status.IN_USE ||
            status === Status.NOT_IN_USE;
          return (
            <Link
              to="./$specialId/create"
              disabled={isDisabled}
              className={` ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              params={{ specialId: id }}
            >
              <IconPen />
            </Link>
          );
        },
      },
      {
        accessor: 'add',
        title: 'เพิ่มไอเทม',
        render: (record) => {
          const { id, status } = record;
          return (
            <button
              type="button"
              onClick={() => handleOpenModal([id])}
              disabled={
                status === Status.DRAFT ||
                status === Status.IN_USE ||
                status === Status.NOT_IN_USE
              }
              className={`rounded p-2 ${
                status === Status.DRAFT ||
                status === Status.IN_USE ||
                status === Status.NOT_IN_USE
                  ? 'cursor-not-allowed text-gray-400'
                  : ''
              }`}
            >
              <IconPlus />
            </button>
          );
        },
      },
    ];

    return finalDefs;
  }, [debouncedFilterSearch, seedyearId]);

  const handleSelectionChange = (selectedRows: SpecialReward[]) => {
    const filteredSelection = selectedRows.filter(
      (row) =>
        row.status !== Status.DRAFT &&
        row.status !== Status.IN_USE &&
        row.status !== Status.NOT_IN_USE,
    );
    setSelectedRecords(filteredSelection);
  };

  const isSelectable = (record: SpecialReward) => {
    return (
      record.status !== Status.DRAFT &&
      record.status !== Status.IN_USE &&
      record.status !== Status.NOT_IN_USE
    );
  };
  const rowClassName = (record: SpecialReward) => {
    if (
      record.status === Status.DRAFT ||
      record.status === Status.IN_USE ||
      record.status === Status.NOT_IN_USE
    ) {
      return 'cursor-not-allowed';
    }
    return '';
  };
  const handleSuccess = useCallback(() => {
    fetchLevels();
  }, [seedyearId, fetchLevels]);

  return (
    <CWWhiteBox>
      {/*  header tap */}
      <div className="flex w-full gap-3">
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
                  onClick={() => handleOpenModal(selectedRecords.map((item) => item.id))}
                >
                  <div className="flex w-full justify-between">
                    <span className="flex gap-5">
                      <IconPlus />
                      เพิ่มไอเทม
                    </span>
                  </div>
                </button>
              </li>
            </ul>
          </Dropdown>
        </div>
        <p className="border-0 border-l border-neutral-300" />
        <WCAInputDropdown
          inputPlaceholder={'ค้นหา'}
          onInputChange={(evt) => {
            const value = evt.currentTarget.value;
            setFilterSearch((prev: any) => ({
              ...prev,
              searchText: {
                ...prev.searchText,
                value: value,
              },
            }));
            setPagination((prev: any) => ({
              ...prev,
              page: 1,
            }));
          }}
          inputValue={filterSearch.searchText?.value || ''}
          dropdownOptions={searchDropdownOptions}
          dropdownPlaceholder={dropdownPlaceholder}
          onDropdownSelect={(value) => {
            setFilterSearch((prev: any) => ({
              ...prev,
              searchText: {
                ...prev.searchText,
                key: `${value}`,
              },
            }));
          }}
        />
      </div>
      {/* filter  */}
      <div className="mt-5">
        <Tabs
          currentTab={filterSearch.status}
          setCurrentTab={(value) => {
            setFilterSearch((prev) => ({
              ...prev,
              status: value as Status,
            }));
          }}
          tabs={[
            { label: 'ทั้งหมด', value: undefined },
            { label: 'ตั้งค่าด่าน', value: Status.SETTING },
            { label: 'จัดการคำถาม', value: Status.QUESTION },
            { label: 'แปลภาษา', value: Status.TRANSLATION },
            { label: 'สร้างเสียง', value: Status.SPEECH },
            { label: 'เผยแพร่', value: Status.IN_USE },
            { label: 'ไม่ใช้งาน', value: Status.NOT_IN_USE },
          ]}
        />
      </div>

      <div className="mt-5 flex w-full gap-5">
        <div className="w-[300px]">
          <CWSelectValue
            options={subject.map((s) => ({ label: s.name, value: s.id }))}
            value={filterSearch.subject_id}
            onChange={(value: number) => {
              setFilterSearch((prev) => ({
                ...prev,
                subject_id: value,
                lesson_id: undefined,
                sub_lesson_id: undefined,
              }));
            }}
            title="วิชา"
          />
        </div>
        <div className="w-[300px]">
          <CWSelectValue
            options={lesson.map((s) => ({ label: s.name, value: s.id }))}
            value={filterSearch.lesson_id}
            onChange={(value: number) => {
              setFilterSearch((prev) => ({
                ...prev,
                lesson_id: value,
                sub_lesson_id: undefined,
              }));
            }}
            title="บทเรียน"
            disabled={!filterSearch.subject_id}
          />
        </div>
        <div className="w-[300px]">
          <CWSelectValue
            options={subLesson.map((s) => ({ label: s.name, value: s.id }))}
            value={filterSearch.sub_lesson_id}
            onChange={(value: number) => {
              setFilterSearch((prev) => ({
                ...prev,
                sub_lesson_id: value,
              }));
            }}
            title="บทเรียนย่อย"
            disabled={!filterSearch.lesson_id}
          />
        </div>
      </div>
      {/* table */}
      <div className="mt-5 w-full">
        <DataTable
          fetching={fetching}
          className="table-hover whitespace-nowrap"
          columns={columnDefs}
          records={records}
          minHeight={200}
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={handleSelectionChange}
          isRecordSelectable={isSelectable}
          rowClassName={rowClassName}
          totalRecords={pagination.total_count}
          recordsPerPage={pagination.limit}
          page={pagination.page}
          onPageChange={(page) => setPagination((prev: any) => ({ ...prev, page }))}
          onRecordsPerPageChange={(limit) =>
            setPagination({
              page: 1,
              limit,
              total_count: pagination.total_count,
            })
          }
          recordsPerPageOptions={pageSizeOptions}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
          loaderType="oval"
          loaderBackgroundBlur={4}
        />
      </div>
      <CWModalAdditem
        selectedId={selectedIds}
        open={modalAdditem.isOpen}
        onClose={modalAdditem.close}
        onSuccess={handleSuccess}
      />
    </CWWhiteBox>
  );
};

export default CWRewardSpecial;
