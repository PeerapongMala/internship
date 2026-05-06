import CWSelect from '@component/web/cw-select';
import CWSplineAreaChart from '../Chart/cw-spline-area-chart';

import { useEffect, useMemo, useState } from 'react';
import API from '@domain/g03/g03-d01/local/api';
import { resLesson, resSubLesson } from '@domain/g03/g03-d01/local/type';
import { DashboradProp, Pagination } from '../../../../type';
import CWPagination from '../../organism/cw-pagination';

export const CWSublessonSection = ({
  classroom,
  subject_id,
  lesson_id,
  onSubLessonTotalChange,
  start_at,
  end_at,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [record, setRecord] = useState<resSubLesson[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 5,
    total_count: 0,
  });

  const shouldFetch = useMemo(() => {
    return subject_id && lesson_id;
  }, [subject_id, lesson_id]);

  useEffect(() => {
    if (shouldFetch) {
      fetchSubLesson();
    }
  }, [shouldFetch, start_at, pagination.page]);

  const fetchSubLesson = async () => {
    if (
      !classroom ||
      classroom.length === 0 ||
      !subject_id ||
      !lesson_id ||
      !start_at ||
      !end_at
    ) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.dashboard.GetA14({
        class_ids: classroom,
        start_at: start_at,
        end_at: end_at,
        subject_ids: subject_id,
        lesson_ids: lesson_id,
        page: pagination.page,
        limit: pagination.limit,
      });
      if (res.status_code === 200) {
        setRecord(res.data);
        const newPagination = {
          ...pagination,
          total_count: res._pagination.total_count || res.data.length,
        };
        setPagination(newPagination);
        if (onSubLessonTotalChange) {
          onSubLessonTotalChange(newPagination.total_count);
        }
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
    <div className="w-full px-5">
      {!subject_id || subject_id.length === 0 ? (
        <div className="flex h-[300px] w-full items-center justify-center">
          <div className="text-lg text-gray-500">โปรดเลือกวิชา</div>
        </div>
      ) : (
        <div>
          <CWSplineAreaChart record={record} />
          {record?.length > 0 && (
            <div className="mt-4 flex justify-center gap-4">
              <CWPagination
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
