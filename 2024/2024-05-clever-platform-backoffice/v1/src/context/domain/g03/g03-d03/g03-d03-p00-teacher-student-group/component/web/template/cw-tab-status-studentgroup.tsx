import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import { StudentGroup } from '@domain/g03/g03-d03/local/type';
import { roundNumber } from '@global/utils/number';
import CwProgressBar from '@component/web/cw-progress-bar';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import { formatTimeString } from '@global/utils/format/time';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const CWTabStatusStudentGroup = ({
  records,
  limit,
  page,
  selectedRecords,
  setLimit,
  setPage,
  setSelectedRecords,
  totalRecords,
  fetching,
  onEnabled,
  onDisabled,
}: {
  records: StudentGroup[];
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  totalRecords: number;
  selectedRecords: StudentGroup[];
  setSelectedRecords: Dispatch<SetStateAction<StudentGroup[]>>;
  fetching?: boolean;
  onEnabled: (record: StudentGroup) => void;
  onDisabled: (record: StudentGroup) => void;
}) => {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<StudentGroup>();
  // modal
  const modalArchive = useModal();
  const handleArchiveObserver = () => {
    if (selectedRecord) {
      onDisabled(selectedRecord);
      modalArchive.close();
      setSelectedRecord(undefined);
    }
  };

  const rowColumns: DataTableColumn<StudentGroup>[] = [
    {
      title: 'ดู',
      accessor: 'seeBtn',
      render: (row) => {
        return (
          <button
            className="flex gap-2"
            onClick={() => {
              navigate({ to: `/teacher/student-group/${row.id}/edit` });
            }}
          >
            <IconEye />
          </button>
        );
      },
    },
    {
      title: '#',
      accessor: '#',
      render: ({ id }) => {
        return id;
      },
    },
    {
      title: 'ชื่อกลุ่มเรียน',
      accessor: 'study_group_name',
    },
    // {
    //   title: 'ปีการศึกษา',
    //   accessor: 'academic_year',
    // },
    // {
    //   title: 'วิชา',
    //   accessor: 'subject_name',
    // },
    // {
    //   title: 'ชั้นปี',
    //   accessor: 'year',
    // },

    // {
    //   title: 'ห้อง',
    //   accessor: 'room',
    // },
    {
      title: 'นักเรียน (คน)',
      accessor: 'student_count',
    },

    {
      title: 'ด่านที่ผ่านเฉลี่ย (ด่าน)',
      accessor: 'pass_section',
      titleClassName: 'text-end',
      render: (record) => {
        return (
          <div className="flex flex-col">
            <span className="text-right">
              {roundNumber(record.avg_passed_levels)}/{roundNumber(record.avg_all_levels)}
            </span>
            <div className="ml-auto w-16">
              <CwProgressBar
                score={record.avg_passed_levels}
                total={record.avg_all_levels}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: 'คะเเนนรวมเฉลี่ย (คะแนน)',
      accessor: 'pass_score',
      titleClassName: 'text-end',
      render: (record) => {
        return (
          <div className="flex flex-col p-2">
            <span className="text-right">
              {roundNumber(record.avg_stars_earned)}/
              {roundNumber(record.avg_max_possible_stars)}
            </span>
            <div className="ml-auto w-16">
              <CwProgressBar
                score={record.avg_stars_earned}
                total={record.avg_max_possible_stars}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: 'ทำข้อสอบเฉลี่ย (ครั้ง)',
      accessor: 'avg_time_per_question',
      textAlign: 'center',
      render: function (record) {
        return (
          <div className="flex justify-center">
            {roundNumber(record.avg_time_per_question)}
          </div>
        );
      },
    },
    {
      title: 'เวลาเฉลี่ย/ข้อ (วินาที)',
      accessor: 'avg_play_time',
      textAlign: 'right',
      render: function (record) {
        return (
          <div className="flex justify-center">
            {formatTimeString(record.avg_play_time)}
          </div>
        );
      },
    },

    {
      title: 'ลบ',
      accessor: 'removeBtn',
      render: (record, index) => (
        <div className="flex w-full justify-center">
          {record.status === 'disabled' ? (
            <button type="button" disabled className="cursor-not-allowed">
              <IconTrash className="h-5 w-5 text-gray-300" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSelectedRecord(record);
                modalArchive.open();
              }}
            >
              <IconTrash className="h-5 w-5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="datatables">
        {records.length > 0 ? (
          <DataTable
            fetching={fetching}
            className="table-hover whitespace-nowrap"
            records={records}
            columns={rowColumns}
            highlightOnHover
            withTableBorder
            withColumnBorders
            height={'calc(100vh - 350px)'}
            totalRecords={totalRecords}
            recordsPerPage={limit}
            page={page}
            onPageChange={setPage}
            onRecordsPerPageChange={setLimit}
            recordsPerPageOptions={[10, 25, 50, 100]}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
            }
          />
        ) : !fetching ? (
          <DataTable
            className="table-hover whitespace-nowrap"
            records={[]}
            columns={rowColumns}
            noRecordsText="ไม่พบข้อมูล"
            highlightOnHover
            withTableBorder
            withColumnBorders
            height={'calc(100vh - 350px)'}
          />
        ) : null}

        <CWModalArchive
          open={modalArchive.isOpen}
          onOk={handleArchiveObserver}
          onClose={() => {
            modalArchive.close();
            setSelectedRecord(undefined);
          }}
        />
      </div>
    </div>
  );
};

export default CWTabStatusStudentGroup;
