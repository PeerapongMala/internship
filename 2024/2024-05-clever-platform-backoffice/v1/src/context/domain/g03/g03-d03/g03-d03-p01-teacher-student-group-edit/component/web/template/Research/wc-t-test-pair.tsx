import { useCallback, useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useParams } from '@tanstack/react-router';

import API from '@domain/g03/g03-d03/local/api';
import showMessage from '@global/utils/showMessage';
import downloadCSV from '@global/utils/downloadCSV';
import {
  StudentGroupResearchQueryParams,
  TTestPairModelStatListResponse,
  LessonResponse,
  SubLessonResponse,
} from '@domain/g03/g03-d03/local/api/group/student-group-research/type';
import CWButton from '@component/web/cw-button';
import CWInputSearch from '@component/web/cw-input-search';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWSelect from '@component/web/cw-select';
import WcModalTTestPairView from './wc-t-test-pait-modal';

const CwTestPair = ({ studentGroup }: { studentGroup: string }) => {
  const { studentGroupId } = useParams({ strict: false });

  const [filters, setFilters] = useState<Partial<StudentGroupResearchQueryParams>>({
    search: '',
    lesson_id: undefined,
    sub_lesson_id: undefined,
  });

  const [open, setOpen] = useState('');
  const [openModalTTest, setOpenModalTTest] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFetching, setFetching] = useState(false);
  const [records, setRecords] = useState<TTestPairModelStatListResponse[]>([]);
  const [lessonDropdown, setLessonDropdown] = useState<LessonResponse[]>([]);
  const [subLessonDropdown, setSubLessonDropdown] = useState<SubLessonResponse[]>([]);

  // Load lessons on mount or when studentGroupId changes
  useEffect(() => {
    if (!studentGroupId) return;
    API.studentGroupResearch.GetLessonParams(+studentGroupId).then((res) => {
      if (res.status_code === 200) {
        setLessonDropdown(res.data);
      }
    });
  }, [studentGroupId]);

  // Load sub-lessons when lesson_id or studentGroupId changes
  useEffect(() => {
    if (!filters.lesson_id || !studentGroupId) {
      setSubLessonDropdown([]);
      setFilters((prev) => ({ ...prev, sub_lesson_id: undefined }));
      return;
    }
    API.studentGroupResearch
      .GetSubLessonParams(+studentGroupId, filters.lesson_id)
      .then((res) => {
        if (res.status_code === 200) {
          setSubLessonDropdown(res.data);
        }
      });
  }, [filters.lesson_id, studentGroupId]);

  const fetchRecords = useCallback(() => {
    if (!studentGroupId) return;
    setFetching(true);
    API.studentGroupResearch
      .GetTTestPairModelStatList(+studentGroupId, filters)
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
        } else {
          showMessage(res.message, 'error');
        }
      })
      .finally(() => {
        setTimeout(() => setFetching(false), 200);
      });
  }, [filters, studentGroupId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const onClickSearch = () => {
    fetchRecords();
  };

  const handleDownload = () => {
    if (!studentGroupId) return;
    API.studentGroupResearch
      .GetResearchTTestPairModelStatCSV(+studentGroupId, filters)
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, 'student-group-research-log.csv');
        } else {
          showMessage(res.message, 'error');
        }
        setOpen('');
      });
  };

  const onClose = () => setOpen('');

  const rowColumns: DataTableColumn<TTestPairModelStatListResponse>[] = [
    {
      title: 'ลำดับที่',
      accessor: 'index',
      width: 150,
      render: (_, index) => index + 1,
    },
    {
      title: 'ชื่อนักเรียน',
      accessor: 'student_fullname',
      width: 400,
    },
    {
      title: 'คะแนนสอบก่อนเรียน',
      accessor: 'pre_test_score',
    },
    {
      title: 'คะแนนสอบหลังเรียน',
      accessor: 'post_test_score',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-[10px] rounded-[10px] p-[10px]">
        <div className="mb-3 flex justify-between">
          <div className="flex">
            <CWButton
              variant="primary"
              title="ดูสรุป"
              onClick={() => setOpenModalTTest(true)}
            />
            <span className="ml-2 mr-2 h-full !w-px bg-neutral-300" />
            <div className="w-fit">
              <CWInputSearch
                placeholder="ค้นหา"
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onClick={onClickSearch}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onClickSearch();
                }}
              />
            </div>
          </div>

          <div className="flex">
            <CWButton
              title="Download"
              icon={<IconDownload />}
              onClick={() => setOpen('download')}
            />
          </div>
        </div>

        <div className="mb-3 flex gap-2">
          <CWSelect
            title="บทเรียน"
            options={lessonDropdown.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            value={filters.lesson_id}
            className="min-w-48"
            onChange={(e) =>
              setFilters({
                ...filters,
                lesson_id: e.target.value,
                sub_lesson_id: undefined,
              })
            }
          />
          <CWSelect
            title="บทเรียนย่อย"
            options={subLessonDropdown.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            value={filters.sub_lesson_id}
            className="min-w-48"
            onChange={(e) => setFilters({ ...filters, sub_lesson_id: e.target.value })}
            disabled={!filters.lesson_id}
          />
        </div>

        <div className="datatables">
          <DataTable
            className="z-0"
            columns={rowColumns}
            records={records}
            styles={{ root: { minHeight: '300px' } }}
            fetching={isFetching}
            highlightOnHover
            withTableBorder
            withColumnBorders
            loaderType="oval"
            loaderBackgroundBlur={4}
            noRecordsText="ไม่พบข้อมูล"
          />
        </div>
      </div>

      <CWModalDownload
        open={open === 'download'}
        onClose={onClose}
        onDownload={handleDownload}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <WcModalTTestPairView
        open={openModalTTest}
        onClose={() => setOpenModalTTest(false)}
        filters={filters}
        studentGroup={studentGroup}
      />
    </div>
  );
};

export default CwTestPair;
