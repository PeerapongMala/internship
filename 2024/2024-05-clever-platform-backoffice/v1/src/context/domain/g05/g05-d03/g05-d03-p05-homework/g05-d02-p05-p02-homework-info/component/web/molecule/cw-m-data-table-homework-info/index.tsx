import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { ActionIcon } from '@mantine/core';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import useModal from '@global/utils/useModal';
import CwProgress from '@component/web/cw-progress';
import API from '@context/domain/g05/g05-d01/g05-d01-p02-teacher-homework/local/api';
import { HomeworkSent } from '@context/domain/g03/g03-d06/local/type';
import ModalLevel from '../../organism/cw-o-modal-level';
import { DetailLevel } from '@domain/g05/g05-d01/g05-d01-p02-teacher-homework/local/type';
import { formatTimeString } from '@global/utils/format/time';

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'done':
        return { color: '#008000', borderColor: '#008000' };
      case 'doing':
        return { color: '#555555', borderColor: '#888888' };
      default:
        return { color: '#FF0000', borderColor: '#FF0000' };
    }
  };

  const style = getStatusStyle(status);
  const statusText =
    status === 'done' ? 'เสร็จแล้ว' : status === 'doing' ? 'กำลังทำ' : 'เลยกำหนด';

  return (
    <div
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid',
        borderRadius: '10px',
        padding: '4px 8px',
        fontSize: '14px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {statusText}
    </div>
  );
};

const TableDataHomeworkInfo = ({
  studentId,
  homeworkID,
}: {
  studentId: string;
  homeworkID: string;
}) => {
  const modalQuestion = useModal();
  const [selectedID, setSelectedID] = useState<DetailLevel[]>([]);
  const [homeworkData, setHomeworkData] = useState<HomeworkSent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeworkData = async () => {
      try {
        const response = await API.teacherHomework.GetHomeworkSubmitStudentList(
          studentId,
          parseInt(homeworkID),
        );
        if (response.status_code === 200 && 'data' in response) {
          setHomeworkData(response.data);
        }
      } catch (error) {
        console.error('Error fetching homework data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworkData();
  }, [studentId, homeworkID]);

  const columns: DataTableColumn<HomeworkSent>[] = [
    {
      accessor: 'actions',
      title: 'ดูข้อมูล',
      render: (record) => (
        <button onClick={() => openModal(record)}>
          <IconEye />
        </button>
      ),
      width: 80,
    },
    { accessor: 'homework_submission_index', title: '#' },
    { accessor: 'homework_submission_index', title: 'ทำครั้งที่' },
    {
      accessor: 'total_star_count',
      title: 'คะแนน',
      render: (record) => (
        <div className="flex flex-col gap-1">
          <span>{`${record.total_star_count}/${record.max_star_count}`}</span>
          <CwProgress percent={record.total_star_count / record.max_star_count} />
        </div>
      ),
    },
    {
      accessor: 'avg_time_used',
      title: 'เวลา/ข้อ',
      render: (record) => formatTimeString(record.avg_time_used),
    },
    {
      accessor: 'status',
      title: 'สถานะ',
      render: ({ status }) => <StatusBadge status={status} />,
    },
  ];
  const openModal = (record: HomeworkSent) => {
    setSelectedID(record.detail_level);
    modalQuestion.open();
  };
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[900px]">
        <DataTable
          columns={columns}
          records={homeworkData}
          highlightOnHover
          fetching={loading}
          minHeight={200}
          noRecordsText="ไม่พบข้อมูล"
        />

        {selectedID && (
          <ModalLevel
            detailLevels={selectedID}
            open={modalQuestion.isOpen}
            onClose={modalQuestion.close}
          />
        )}
      </div>
    </div>
  );
};

export default TableDataHomeworkInfo;
