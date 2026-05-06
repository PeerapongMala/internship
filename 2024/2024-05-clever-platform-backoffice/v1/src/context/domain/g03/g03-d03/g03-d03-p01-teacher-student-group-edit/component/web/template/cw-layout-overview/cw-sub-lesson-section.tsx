import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWSelect from '@component/web/cw-select';
import { Thai } from 'flatpickr/dist/l10n/th';

import { toDateTimeTH } from '@global/utils/date';
import { useEffect, useState } from 'react';

import API from '@domain/g03/g03-d03/local/api';
import CWLevelAverage from '../Chart/cw-level-average';
import CWLessonChart from '../Chart/cw-lesson-chart';
import CWSubLessonChart from '../Chart/cw-sub-lesson-chart';
import {
  DashboradProp,
  SubLessonProgress,
} from '@domain/g03/g03-d03/local/api/group/student-overview/types';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';
import { Pagination } from '@domain/g03/g03-d03/local/type';
import CWPagination from '../../organism/cw-pagination';

const CWSubLessonSection = ({
  study_group_id,
  lesson_ids,
  sub_lesson_ids,
  lesson_name,
  start_at,
  end_at,
  onSubLessonTotalChange,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [record, setRecord] = useState<SubLessonProgress[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 5,
    total_count: 0,
  });
  useEffect(() => {
    StudentLessonProgress();
  }, [study_group_id, end_at, pagination.page]);
  useEffect(() => {
    if (pagination?.total_count !== 0 && onSubLessonTotalChange) {
      onSubLessonTotalChange(pagination?.total_count);
    }
  }, [pagination?.total_count, onSubLessonTotalChange]);
  const StudentLessonProgress = async () => {
    if (!study_group_id || !start_at || !end_at) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.studentOverviewRestAPI.GetA09({
        study_group_id: study_group_id,
        start_at: start_at,
        end_at: end_at,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (res.status_code === 200) {
        setRecord(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res?._pagination.total_count || res.data.length,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };
  const totalPages = Math.ceil(pagination.total_count / pagination.limit);
  return (
    <div className="w-full">
      <div className="mt-5 flex flex-col gap-5">
        <div className="w-full">
          <WCADropdown
            placeholder={lesson_name ?? ''}
            options={[]}
            onSelect={() => {}}
            disabled
          />
        </div>
      </div>
      <div className="mt-5">
        <CWSubLessonChart record={record} />
      </div>
      {record.length > 0 && (
        <div className="mt-4 flex justify-center gap-4">
          <CWPagination
            currentPage={pagination?.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CWSubLessonSection;
