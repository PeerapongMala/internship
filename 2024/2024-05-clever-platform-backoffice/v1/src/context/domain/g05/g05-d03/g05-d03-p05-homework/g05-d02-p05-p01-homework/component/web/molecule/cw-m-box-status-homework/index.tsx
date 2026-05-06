import CWNeutralBox from '@component/web/cw-neutral-box';
import { StudentRepository } from '@domain/g05/local/api/repository/student';
import { useEffect, useState } from 'react';

// Status configuration
const STATUS_CONFIG = [
  { id: 'On Time', label: 'ตรงเวลา' },
  { id: 'Late', label: 'เลยกำหนด' },
  { id: 'Not Finish', label: 'กำลังทำ' },
  { id: 'Not Start', label: 'ยังไม่เริ่ม' },
] as const;

type HomeworkStatus = (typeof STATUS_CONFIG)[number]['id'];

interface StatusCardProps {
  title: HomeworkStatus;
  progress: number;
  total: number;
}

interface BoxStatusHomeworkProps {
  studentId: string;
  classId?: number;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, progress, total }) => {
  const progressPercentage = (progress / total) * 100;
  const statusLabel = STATUS_CONFIG.find((status) => status.id === title)?.label ?? title;

  return (
    <CWNeutralBox>
      <h2 className="mb-3 text-[14px] font-medium text-gray-800">{statusLabel}</h2>
      <div className="mb-1 flex items-center text-[18px]">
        <span>
          {progress} / {total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-green-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </CWNeutralBox>
  );
};

const BoxStatusHomework: React.FC<BoxStatusHomeworkProps> = ({ studentId, classId }) => {
  const [statusCards, setStatusCards] = useState<StatusCardProps[]>([]);

  useEffect(() => {
    const fetchHomeworkStatus = async () => {
      if (!studentId || !classId) return;

      try {
        const response = await StudentRepository.GetHomeworkStatus({
          student_id: studentId,
          class_id: classId.toString(),
        });

        if (response.data.status_code === 200) {
          // Create a map of status data for easy lookup
          const statusMap = new Map(
            response.data.data.map((status) => [status.status_name, status]),
          );

          // Create cards in the specified order
          const cards = STATUS_CONFIG.map(({ id }) => ({
            title: id as HomeworkStatus,
            progress: statusMap.get(id)?.count ?? 0,
            total: statusMap.get(id)?.total ?? 0,
          }));

          setStatusCards(cards);
        }
      } catch (error) {
        console.error('Error fetching homework status:', error);
      }
    };

    fetchHomeworkStatus();
  }, [studentId, classId]);

  return (
    <div className="w-full px-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        {statusCards.map((card, index) => (
          <div key={index} className="w-full">
            <StatusCard {...card} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxStatusHomework;
