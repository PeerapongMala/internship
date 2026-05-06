import { useState, useEffect, useMemo, SetStateAction } from 'react';
import { useParams, Link, useNavigate, useLocation } from '@tanstack/react-router';
import ModalChat from '../../../../../../local/components/modal/ModalChat';
import ModalCheckpoint from '../../../../../../local/components/modal/ModalCheckpoint';

import { HomeworkSent, DetailLevel } from '@domain/g03/g03-d06/local/type';
import IconUpload from '@component/web/atom/wc-a-icons/IconUpload';
import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import IconArrowLeft from '@core/design-system/library/component/icon/IconArrowLeft';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconMenuChat from '@core/design-system/library/vristo/source/components/Icon/Menu/IconMenuChat';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWInput from '@component/web/cw-input';
import CWNeutralBox from '@component/web/cw-neutral-box';
import CWWhiteBox from '@component/web/cw-white-box';
import ProgressBar from '@domain/g03/g03-d06/local/components/organisms/Progressbar';
import CWInputSearch from '@component/web/cw-input-search';
import {
  StatusStudent,
  StudentSent,
  Status,
  HomeworkStatus,
  HomeworkSubmitDetail,
} from '@domain/g03/g03-d06/local/type';
import StoreItemRestAPI from '@domain/g03/g03-d06/local/api/group/teacher-homework/restapi';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const GetByIdHomework = ({
  active,
  selectedId,
  setSelectedId,
}: {
  active: (tab: string) => void;
  selectedId: HomeworkSubmitDetail;
  setSelectedId: (id: HomeworkSubmitDetail) => void;
}) => {
  const navigate = useNavigate();
  const modalDownload = useModal();
  const modalQuestion = useModal();

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<HomeworkSent[]>([]);
  const [records, setRecords] = useState<HomeworkSent[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [searchTerm, setSearchTerm] = useState('');
  const [detailLevels, setDetailLevels] = useState<DetailLevel[]>([]);
  const { homeworkId } = useParams({ strict: false });

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedId?.user_id) return;

      setFetching(true);
      try {
        const response = await StoreItemRestAPI.GetHomeworkSubmitStudentList(
          selectedId.user_id,
          Number(homeworkId),
          pagination.page,
          pagination.limit,
        );

        if (response.status_code === 200 && response.data) {
          setRecords(response.data);
          setPagination((prev) => ({ ...prev, total_count: response.data.length }));
        } else {
          console.error('Failed to fetch homework submissions:', response.message);
          setRecords([]);
        }
      } catch (error) {
        console.error('Error fetching homework submissions:', error);
        setRecords([]);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [selectedId, pagination.page, pagination.limit]);

  const handleViewAnswer = (user: HomeworkSubmitDetail) => {
    setSelectedId(user);
    active('1');
  };

  const filteredRecords = useMemo(() => {
    if (!searchTerm) return records;

    return records.filter((record) => {
      // ปรับการค้นหาตามฟิลด์ที่ต้องการ
      return (
        record.homework_submission_index.toString().includes(searchTerm) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [records, searchTerm]);

  const columnDefs = useMemo<DataTableColumn<HomeworkSent>[]>(() => {
    const finalDefs: DataTableColumn<HomeworkSent>[] = [
      {
        accessor: 'edit',
        title: 'ดูคำตอบ',
        render: (record) => (
          <button onClick={() => openModal(record)}>
            <IconEye />
          </button>
        ),
      },
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      {
        accessor: 'homework_submission_index',
        title: 'ทำครั้งที่',
        render: ({ homework_submission_index }) => homework_submission_index,
      },
      {
        accessor: 'score',
        title: 'คะแนน',
        textAlign: 'right',
        render: ({ total_star_count, max_star_count }) => (
          <div className="flex flex-col items-end justify-end">
            <div className="flex justify-center">
              <p>{total_star_count}</p>/<p>{max_star_count}</p>
            </div>
            <ProgressBar score={total_star_count} total={max_star_count} />
          </div>
        ),
      },
      {
        accessor: 'avg_time_used',
        title: 'เวลา/ข้อ(วินาที)',
        render: ({ avg_time_used }) => Math.round(avg_time_used),
      },
      {
        accessor: 'status',
        title: 'สถานะ',
        render: ({ status }) => {
          if (status === 'done')
            return <span className="badge badge-outline-success">เสร็จแล้ว</span>;
          else if (status === 'doing')
            return <span className="badge badge-outline-dark">กำลังทำ</span>;
          else return <span className="badge badge-outline-warning">{status}</span>;
        },
      },
    ];
    return finalDefs;
  }, []);

  const openModal = (record: HomeworkSent) => {
    setDetailLevels(record.detail_level);
    modalQuestion.open();
  };

  const handleSelectionChange = (selectedRows: SetStateAction<HomeworkSent[]>) => {
    setSelectedRecords(selectedRows);
  };

  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit,
    );
  }, [filteredRecords, pagination.page, pagination.limit]);

  return (
    <div className="w-full">
      <div className="mb-5 w-full">
        <CWNeutralBox>
          <div className="flex flex-col gap-5">
            <div className="flex gap-5">
              <button
                onClick={() => {
                  active('0');
                }}
              >
                <IconArrowBackward />
              </button>
              <h1 className="text-2xl font-bold">
                {selectedId.title} {selectedId.first_name} {selectedId.last_name}
              </h1>
            </div>
            <div>
              <p>
                รหัสนักเรียน: {selectedId.student_no}, รหัสโรงเรียน:{' '}
                {selectedId.student_no} (ตัวย่อ: AA109)
              </p>
            </div>
          </div>
        </CWNeutralBox>
      </div>
      <CWWhiteBox>
        <div>
          <DataTable
            fetching={fetching}
            className="table-hover mantine-mobile-layout whitespace-nowrap"
            columns={columnDefs}
            records={paginatedRecords}
            totalRecords={filteredRecords.length}
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
            noRecordsText="ไม่พบข้อมูล"
          />
        </div>
        <ModalCheckpoint
          detailLevels={detailLevels}
          open={modalQuestion.isOpen}
          onClose={modalQuestion.close}
        />
      </CWWhiteBox>
    </div>
  );
};

export default GetByIdHomework;
