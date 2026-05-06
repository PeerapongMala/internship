import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';

import ModalQuestion from '../../../../../local/components/modal/ModalQuestion';
import ProgressBar from '../../../../../local/components/organisms/Progressbar';
import IconEye from '@core/design-system/library/vristo/source/components/Icon/IconEye';
import { DataHomework, Tier, Question } from '@domain/g03/g03-d06/local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import CwProgress from '@component/web/cw-progress';
import ModalQuestionOne from '@domain/g03/g03-d06/local/components/modal/ModalQuestion-one';
import CWWhiteBox from '@component/web/cw-white-box';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';
import API from '../../../../../local/api/index';
import CWProgressBar from '@component/web/cw-progress-bar';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { homework_id } = useParams({ strict: false });

  const open = (id: number) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const close = () => {
    setSelectedId(null);
    setIsOpen(false);
  };

  return { isOpen, open, close, selectedId };
};

const InfoHomework = () => {
  const modalOpenQuestion = useModal();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { homeworkId } = useParams({ strict: false });

  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<DataHomework[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        setFetching(true);
        const response = await API.teacherHomework.GetHomeworkDetailList(
          homeworkId,
          pagination.page,
          pagination.limit,
        );

        setRecords(response.data);
        setPagination((prev) => ({
          ...prev,
          total_count: response._pagination.total_count,
        }));
      } catch (error) {
        console.error('Error fetching homework detail list:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchMockData();
  }, [pagination.page, pagination.limit]);

  const columnDefs = useMemo<DataTableColumn<DataHomework>[]>(() => {
    const finalDefs: DataTableColumn<DataHomework>[] = [
      {
        accessor: 'edit',
        title: 'ดูคำถาม',
        render: ({ level_id }) => (
          <button
            onClick={() => {
              setSelectedId(level_id);
              modalOpenQuestion.open(level_id);
            }}
          >
            <IconEye />
          </button>
        ),
      },
      {
        accessor: 'index',
        title: '#ID',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'sub_lesson_name', title: 'บทเรียนย่อย' },
      { accessor: 'level_index', title: 'ด่านที่' },
      {
        accessor: 'level_type',
        title: 'ประเภท',
        render: ({ level_type }) => {
          const typeMap: { [key: string]: string } = {
            test: 'แบบฝึกหัด',
            'sub-lesson-post-test': 'แบบฝึกหัดท้ายบทเรียนย่อย',
            'pre-post-test': 'แบบฝึกหัดก่อนเรียน',
          };
          return typeMap[level_type] || level_type;
        },
      },
      {
        accessor: 'question_type',
        title: 'รูปแบบคำถาม',
        render: ({ question_type }) => {
          const questionTypeMap: { [key: string]: string } = {
            'multiple-choices': 'คำถามปรนัย (Multiple Choices)',
            pairing: 'คำถามแบบจับคู่ (Pairing)',
            sorting: 'คำถามแบบเรียงลำดับ (Sorting)',
            placeholder: 'คำถามแบบมีตัวเลือก (Placeholder)',
            input: 'คำถามแบบเติมคำ (Input)',
            boss: '',
          };
          return questionTypeMap[question_type] || question_type;
        },
      },
      { accessor: 'level_difficulty', title: 'ระดับ' },
      {
        accessor: 'level_difficulty-badge',
        title: 'ระดับ',
        render: ({ level_difficulty }) => (
          <div>
            {level_difficulty === Tier.EASY ? (
              <button className="btn btn-outline-success">ง่าย</button>
            ) : level_difficulty === Tier.MEDIUM ? (
              <button className="btn btn-outline-warning">ปานกลาง</button>
            ) : (
              <button className="btn btn-outline-danger">ยาก</button>
            )}
          </div>
        ),
      },
      {
        accessor: 'avg_star_count',
        title: 'คะแนนรวมเฉลี่ย(คะแนน)',
        textAlign: 'right',
        render: ({ avg_star_count, avg_max_star_count }) => (
          <div className="flex flex-col items-end justify-end">
            <div className="flex justify-center">
              <p>{avg_star_count}</p>/<p>{avg_max_star_count}</p>
            </div>
            <CWProgressBar score={avg_star_count} total={avg_max_star_count} />
          </div>
        ),
      },
      {
        accessor: 'readyexam',
        title: 'ทำข้อสอบแล้ว(คน)',
        textAlign: 'right',
        render: ({ student_done_homework_count, total_student_count }) => (
          <div className="flex flex-col items-end justify-end">
            <div className="flex justify-center">
              <p>{student_done_homework_count}</p>/<p>{total_student_count}</p>
            </div>
            <CWProgressBar
              score={student_done_homework_count}
              total={total_student_count}
            />
          </div>
        ),
      },
      { accessor: 'avg_count_do_homework', title: 'ทำข้อสอบโดยเฉลี่ย(ครั้ง)' },
      { accessor: 'done_homework_count', title: 'ทำข้อสอบแล้ว(ครั้ง)' },
      { accessor: 'avg_time_used', title: 'เวลาเฉลี่ยต่อข้อ(วินาที)' },
      {
        accessor: 'latest_do_homework_date',
        title: 'ทำข้อสอบล่าสุด',
        render: ({ latest_do_homework_date }) => (
          <div>
            {latest_do_homework_date
              ? new Date(latest_do_homework_date).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '-'}
          </div>
        ),
      },
    ];
    return finalDefs;
  }, [pagination.limit, pagination.page]);

  return (
    <CWWhiteBox>
      <div className="">
        <DataTable
          idAccessor="level_id"
          fetching={fetching}
          className="table-hover whitespace-nowrap"
          columns={columnDefs}
          records={records}
          totalRecords={pagination.total_count}
          recordsPerPage={pagination.limit}
          page={pagination.page}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onRecordsPerPageChange={(limit) => {
            console.log('Records Per Page Changed:', limit);
            setPagination((prev) => ({ ...prev, limit, page: 1 }));
          }}
          recordsPerPageOptions={pageSizeOptions}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
          }
        />
        {/* <ModalQuestionOne
          open={modalOpenQuestion.isOpen}
          onClose={modalOpenQuestion.close}
          questionId={modalOpenQuestion.selectedId}
          data={records}
        /> */}
        <CWModalQuestionView
          open={modalOpenQuestion.isOpen}
          onClose={modalOpenQuestion.close}
          // CWModalQuestionView_please_fix_this_for_real_data
          levelId={modalOpenQuestion.selectedId ?? 5}
          // levelPlayLogId={1}
        />
      </div>
    </CWWhiteBox>
  );
};

export default InfoHomework;
