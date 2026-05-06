import { DataTable, DataTableColumn } from 'mantine-datatable';
import { ActionIcon } from '@mantine/core';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import { useNavigate } from '@tanstack/react-router';
import { getHomeworks } from '@domain/g05/local/api/group/student/get-homeworks/restapi';
import { useEffect, useState } from 'react';
import { THomework } from '@domain/g05/local/api/helper/student';

// Homework status configuration
const HOMEWORK_STATUS = {
  'On Time': { label: 'ตรงเวลา', color: 'success' },
  'Not Finish': { label: 'กำลังทำ', color: 'dark' },
  Late: { label: 'เลยกำหนด', color: 'warning' },
  'Not Start': { label: 'ยังไม่เริ่ม', color: 'danger' },
} as const;

type HomeworkStatus = keyof typeof HOMEWORK_STATUS;

type FilterStatusHomeworkProps = {
  studentId: string;
  classId?: number;
};

// Utility function for date formatting
const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const StatusBadge = ({ status }: { status: HomeworkStatus }) => {
  const { label, color } = HOMEWORK_STATUS[status];
  return <span className={`badge text-nowrap badge-outline-${color}`}>{label}</span>;
};

// Homework filter configuration
const HOMEWORK_FILTERS = {
  all: () => true,
  done: (h: THomework) => h.status === 'On Time',
  inprogress: (h: THomework) => h.status === 'Not Finish',
  late: (h: THomework) => h.status === 'Late',
  notstart: (h: THomework) => h.status === 'Not Start',
} as const;

type FilterType = keyof typeof HOMEWORK_FILTERS;

const filterHomework = (homeworks: THomework[], type: FilterType): THomework[] => {
  return homeworks.filter(HOMEWORK_FILTERS[type]);
};

const FilterStatusHomework: React.FC<FilterStatusHomeworkProps> = ({
  studentId,
  classId,
}) => {
  const navigate = useNavigate();
  const [homeworks, setHomeworks] = useState<THomework[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeworks = async () => {
      if (!studentId || !classId) return;

      try {
        setLoading(true);
        const response = await getHomeworks({
          student_id: studentId,
          class_id: classId.toString(),
        });

        if (response.data.status_code === 200) {
          setHomeworks(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching homeworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, [studentId, classId]);

  const columns: DataTableColumn<THomework>[] = [
    { accessor: 'homework_name', title: 'ชื่อการบ้าน' },
    { accessor: 'subject_name', title: 'วิชา' },
    { accessor: 'lesson', title: 'บทเรียน' },
    { accessor: 'sub_lesson', title: 'บทเรียนย่อย' },
    { accessor: 'assign_to', title: 'มอบหมายให้' },
    {
      accessor: 'started_at',
      title: 'วันที่สั่งการบ้าน',
      render: (record) => formatDate(record.started_at),
    },
    {
      accessor: 'due_at',
      title: 'วันที่ส่งการบ้าน',
      render: (record) => formatDate(record.due_at),
    },
    { accessor: 'level_count', title: 'จำนวนด่าน' },
    {
      accessor: 'status',
      title: 'สถานะ',
      render: ({ status }) => <StatusBadge status={status as HomeworkStatus} />,
    },
    {
      accessor: 'actions',
      title: 'ดูข้อมูล',
      render: (record) => (
        <button
          onClick={() => {
            const hash = encodeURIComponent(JSON.stringify(record));
            navigate({
              to: `/line/student/clever/homework/student/${studentId}/homework/${record.homework_id}#${hash}`,
            });
          }}
        >
          <ActionIcon variant="light" color="blue">
            <IconSearch className="h-5 w-5" />
          </ActionIcon>
        </button>
      ),
      width: 80,
    },
  ];

  const tabConfigs = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'done', label: 'ตรงเวลา' },
    { id: 'inprogress', label: 'กำลังทำ' },
    { id: 'late', label: 'เลยกำหนด' },
    { id: 'notstart', label: 'ยังไม่เริ่ม' },
  ] as const;

  const tabs = tabConfigs.map(({ id, label }) => ({
    id,
    label,
    content: (
      <DataTable
        columns={columns}
        records={filterHomework(homeworks, id)}
        striped
        highlightOnHover
        fetching={loading}
        minHeight={200}
        noRecordsText="ไม่พบข้อมูล"
      />
    ),
  }));

  return (
    <div className="w-full overflow-x-auto pl-5">
      <div className="min-w-[900px]">
        <CWSwitchTabs tabs={tabs} initialTabId="all" />
      </div>
    </div>
  );
};

export default FilterStatusHomework;
