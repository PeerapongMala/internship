import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';

import Tabs from '@component/web/cw-tabs';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import CWWhiteBox from '@component/web/cw-white-box';
import CWButton from '@component/web/cw-button';
import CWInputSearch from '@component/web/cw-input-search';

import {
  Status,
  HomeworkStatus,
  HomeworkSubmitDetail,
} from '@domain/g03/g03-d06/local/type';
import StoreItemRestAPI from '@domain/g03/g03-d06/local/api/group/teacher-homework/restapi';
import StoreGlobalPersist from '@store/global/persist';
import showMessage from '@global/utils/showMessage';

// Icons
import IconMenuChat from '@core/design-system/library/vristo/source/components/Icon/Menu/IconMenuChat';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconChatDots from '@core/design-system/library/vristo/source/components/Icon/IconChatDots';
import ModalChat from '@domain/g05/g05-d01/g05-d01-p02-teacher-homework/local/components/modal/ModalChat';
import ProgressBar from '@domain/g05/g05-d01/g05-d01-p02-teacher-homework/local/components/organisms/Progressbar';
import usePagination from '@global/hooks/usePagination';

// Custom hook for modal state management
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
};

// Types
interface Stats {
  notStart: number;
  onTime: number;
  late: number;
  notFinish: number;
  total: number;
}

interface PaginationState {
  page: number;
  limit: number;
  total_count: number;
}

interface GetHomeworkProps {
  schoolID: string;
  active: (tab: string) => void;
  selectedId: HomeworkSubmitDetail;
  setSelectedId: (id: HomeworkSubmitDetail) => void;
}

// Component
const GetHomework: React.FC<GetHomeworkProps> = ({
  schoolID,
  active,
  selectedId,
  setSelectedId,
}) => {
  const navigate = useNavigate();
  const { homeworkId } = useParams({ strict: false });
  const modalDownload = useModal();
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);

  // State management
  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<HomeworkSubmitDetail[]>([]);
  const [records, setRecords] = useState<HomeworkSubmitDetail[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [stats, setStats] = useState<Stats>({
    notStart: 0,
    onTime: 0,
    late: 0,
    notFinish: 0,
    total: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isBulkMessageOpen, setIsBulkMessageOpen] = useState(false);

  // Fetch homework data
  useEffect(() => {
    const fetchHomeworkData = async () => {
      if (!homeworkId) return;

      setFetching(true);
      try {
        const response = await StoreItemRestAPI.GetHomeworkSubmitDetailList(
          Number(homeworkId),
          pagination.page,
          pagination.limit,
          statusFilter,
          schoolID,
        );

        if (response.status_code === 200) {
          const data = response.data;
          setRecords(data);
          updateStats(data);
          setPagination((prev) => ({ ...prev, total_count: data.length }));
        } else {
          showMessage(response.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
        }
      } catch (error) {
        console.error('Error fetching homework data:', error);
        showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
      } finally {
        setFetching(false);
      }
    };

    fetchHomeworkData();
  }, [homeworkId, pagination.page, pagination.limit, statusFilter]);

  // Update stats when records change
  const updateStats = (data: HomeworkSubmitDetail[]) => {
    const notStartCount = data.filter(
      (item) => item.status === HomeworkStatus.NOT_START,
    ).length;
    const onTimeCount = data.filter(
      (item) => item.status === HomeworkStatus.ON_TIME,
    ).length;
    const lateCount = data.filter((item) => item.status === HomeworkStatus.LATE).length;
    const notFinishCount = data.filter(
      (item) => item.status === HomeworkStatus.NOT_FINISH,
    ).length;

    setStats({
      notStart: notStartCount,
      onTime: onTimeCount,
      late: lateCount,
      notFinish: notFinishCount,
      total: data.length,
    });
  };

  // Table column definitions
  const columnDefs = useMemo<DataTableColumn<HomeworkSubmitDetail>[]>(
    () => [
      {
        accessor: 'edit',
        title: 'ดูการบ้าน',
        render: (user) => (
          <button onClick={() => handleViewAnswer(user)}>
            <IconEye />
          </button>
        ),
      },
      {
        accessor: 'chat',
        title: 'แชท',
        render: (user) => (
          <button onClick={() => openModal(user)}>
            <IconChatDots />
          </button>
        ),
      },
      { accessor: 'student_no', title: 'รหัสนักเรียน' },
      { accessor: 'title', title: 'คำนำหน้า' },
      { accessor: 'first_name', title: 'ชื่อ' },
      { accessor: 'last_name', title: 'สกุล' },
      {
        accessor: 'score',
        title: 'คะแนน',
        render: ({ star_count, max_star_count }) => `${star_count}/${max_star_count}`,
      },
      {
        accessor: 'submitted_at',
        title: 'วันที่ส่ง',
        render: ({ submitted_at }) => {
          if (!submitted_at) return '-';
          const date = new Date(submitted_at);
          return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        },
      },
      {
        accessor: 'status',
        title: 'สถานะ',
        render: ({ status }) => {
          const statusMap: Record<string, { className: string; text: string }> = {
            [HomeworkStatus.ON_TIME]: {
              className: 'badge badge-outline-success',
              text: 'ตรงเวลา',
            },
            [HomeworkStatus.NOT_FINISH]: {
              className: 'badge badge-outline-dark',
              text: 'กำลังทำ',
            },
            [HomeworkStatus.LATE]: {
              className: 'badge badge-outline-warning',
              text: 'เลยกำหนด',
            },
            [HomeworkStatus.NOT_START]: {
              className: 'badge badge-outline-danger',
              text: 'ยังไม่ได้ส่ง',
            },
          };

          const statusConfig = statusMap[status] || {
            className: 'badge badge-outline-secondary',
            text: status,
          };

          return <span className={statusConfig.className}>{statusConfig.text}</span>;
        },
      },
    ],
    [],
  );

  // Event handlers
  const handleViewAnswer = (user: HomeworkSubmitDetail) => {
    setSelectedId(user);
    active('1');
  };

  const handleSelectionChange = (selectedRows: HomeworkSubmitDetail[]) => {
    setSelectedRecords(selectedRows);
  };

  const handleBulkEdit = (status: Status) => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }
    showMessage('Bulk edit simulated successfully');
  };

  const openModal = (user: HomeworkSubmitDetail) => {
    setSelectedId(user);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsBulkMessageOpen(false);
  };

  const handleBulkMessage = () => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกนักเรียนที่ต้องการส่งข้อความ', 'error');
      return;
    }
    setIsBulkMessageOpen(true);
  };

  const handleSendAllMessage = () => {
    if (records.length === 0) {
      showMessage('ไม่พบรายชื่อนักเรียน', 'error');
      return;
    }
    const allUserIds = records.map((record) => record.user_id);
    setSelectedId({ ...records[0], user_id: '' });
    setSelectedRecords(records);
    setIsBulkMessageOpen(true);
  };

  // Filtered records
  const paginatedRecords = useMemo(() => {
    let filteredRecords = records;

    if (statusFilter) {
      filteredRecords = filteredRecords.filter((item) => item.status === statusFilter);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredRecords = filteredRecords.filter(
        (item) =>
          item.student_no.toLowerCase().includes(searchLower) ||
          item.first_name.toLowerCase().includes(searchLower) ||
          item.last_name.toLowerCase().includes(searchLower),
      );
    }

    setPagination((prev) => ({ ...prev, total_count: filteredRecords.length }));

    return filteredRecords.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit,
    );
  }, [records, statusFilter, searchTerm, pagination.page, pagination.limit]);

  return (
    <CWWhiteBox>
      <div className="w-full">
        {/* Stats Section */}
        <div className="flex gap-5">
          <div className="grid w-full grid-cols-2 gap-5 xl:flex xl:flex-row">
            <StatCard title="กำลังทำ" count={stats.notFinish} total={stats.total} />
            <StatCard title="ตรงเวลา" count={stats.onTime} total={stats.total} />
            <StatCard title="ส่งเลยกำหนด" count={stats.late} total={stats.total} />
            <StatCard title="ยังไม่ได้ส่ง" count={stats.notStart} total={stats.total} />
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex w-full flex-col justify-between py-5 lg:flex-row">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex w-full flex-row flex-wrap items-center gap-4">
              <div>
                <BulkActionsDropdown
                  selectedRecords={selectedRecords}
                  onBulkMessage={handleBulkMessage}
                  onBulkEdit={handleBulkEdit}
                />
              </div>

              <div className="min-w-0 flex-1">
                <CWButton
                  title="ส่งข้อความทั้งหมด"
                  onClick={handleSendAllMessage}
                  className="w-full"
                >
                  ส่งข้อความทั้งหมด
                </CWButton>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <CWInputSearch
                placeholder="ค้นหา"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className="w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full">
          <div className="w-full overflow-x-auto">
            <div className="flex flex-nowrap gap-2 sm:gap-4">
              <Tabs
                currentTab={statusFilter}
                setCurrentTab={(value) => setStatusFilter(value)}
                tabs={[
                  { label: 'ทั้งหมด', value: undefined },
                  { label: 'กำลังทำ', value: HomeworkStatus.NOT_FINISH },
                  { label: 'ตรงเวลา', value: HomeworkStatus.ON_TIME },
                  { label: 'เลยกำหนด', value: HomeworkStatus.LATE },
                  { label: 'ยังไม่ได้ส่ง', value: HomeworkStatus.NOT_START },
                ]}
              />
            </div>
          </div>

          <div className="mt-5">
            <DataTable
              fetching={fetching}
              className="table-hover mantine-mobile-layout whitespace-nowrap"
              columns={columnDefs}
              records={paginatedRecords}
              totalRecords={pagination.total_count}
              recordsPerPage={pagination.limit}
              page={pagination.page}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              onRecordsPerPageChange={(limit) => {
                setPagination((prev) => ({ ...prev, limit, page: 1 }));
              }}
              recordsPerPageOptions={pageSizeOptions}
              paginationText={({ from, to, totalRecords }) =>
                `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
              }
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={handleSelectionChange}
              idAccessor="user_id"
            />
          </div>

          {/* Modals */}
          {selectedId && (
            <>
              <ModalChat
                open={isOpen}
                onClose={closeModal}
                subjectId={selectedId.user_id}
                selectedStudents={[
                  {
                    title: selectedId.title,
                    first_name: selectedId.first_name,
                    last_name: selectedId.last_name,
                  },
                ]}
              />
              <ModalChat
                open={isBulkMessageOpen}
                onClose={closeModal}
                receivers={selectedRecords.map((record) => record.user_id)}
                selectedStudents={selectedRecords.map((record) => ({
                  title: record.title,
                  first_name: record.first_name,
                  last_name: record.last_name,
                }))}
              />
            </>
          )}
        </div>
      </div>
    </CWWhiteBox>
  );
};

// Sub-components
const StatCard: React.FC<{ title: string; count: number; total: number }> = ({
  title,
  count,
  total,
}) => (
  <div className="w-full rounded-md bg-neutral-100">
    <div className="p-4">
      <h1 className="text-lg font-bold">{title}</h1>
      <h1 className="text-xl font-bold">
        {count}/{total}
      </h1>
      <ProgressBar score={count} total={total} />
    </div>
  </div>
);

const BulkActionsDropdown: React.FC<{
  selectedRecords: HomeworkSubmitDetail[];
  onBulkMessage: () => void;
  onBulkEdit: (status: Status) => void;
}> = ({ selectedRecords, onBulkMessage, onBulkEdit }) => (
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
          <button type="button" className="w-full" onClick={onBulkMessage}>
            <div className="flex w-full justify-between">
              <span>ส่งข้อความ</span>
              <IconChatDots />
            </div>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="w-full"
            onClick={() => onBulkEdit(Status.IN_USE)}
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
            onClick={() => onBulkEdit(Status.NOT_IN_USE)}
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
);

export default GetHomework;
