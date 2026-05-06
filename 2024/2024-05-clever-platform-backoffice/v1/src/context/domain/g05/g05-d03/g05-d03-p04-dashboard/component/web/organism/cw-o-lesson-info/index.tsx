import CWSelect from '@component/web/cw-select';
import LessonBarChart from '../../template/chart/cw-a-lesson-bar-chart';
import { Lesson, OverviewProp } from '@domain/g05/g05-d03/local/types/overview';
import showMessage from '@global/utils/showMessage';
import { TPagination } from '@domain/g05/g05-d03/local/types';
import { useEffect, useState } from 'react';
import API from '@domain/g05/g05-d03/local/api';

import WCADropdown from '@domain/g05/g05-d01/g05-d01-p01-teacher-dashboard/local/components/web/atom/WCADropdown';
import CWPagination from '@domain/g05/g05-d02/local/component/web/organism/cw-pagination';

const LessonInfo = ({
  subjectData,
  selectedSubject,
  user_id,
  class_id,
  startDate,
  endDate,
}: OverviewProp) => {
  const [pagination, setPagination] = useState<TPagination>({
    page: 1,
    limit: 5,
    total_count: 0,
  });
  const [fetching, setFetching] = useState<boolean>(false);
  const [lessonData, setLessonData] = useState<Lesson[]>([]);

  useEffect(() => {
    fetchLesson();
  }, [selectedSubject, startDate, endDate, pagination.page]);

  const fetchLesson = async () => {
    if (!user_id || !class_id || !selectedSubject) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.Overview.GetLesson(user_id, class_id, selectedSubject, {
        page: pagination?.page,
        limit: pagination?.limit,
      });
      if (res.status_code === 200) {
        setLessonData(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res?._pagination?.total_count || res?.data?.length,
        }));
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      showMessage(error, 'error');
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
  const selectedSubjectData = subjectData?.find(
    (subject) => subject.subject_id === selectedSubject,
  );
  const subjectName = selectedSubjectData?.subject_name || 'เลือกวิชา';
  return (
    <div className="col-span-1 w-full rounded-md bg-white shadow-md">
      <div className="w-full border-b-2 border-neutral-100 px-2 py-3">
        <span className="flex items-center gap-2 text-[12px]">
          <h1 className="font-bold">สรุปความก้าวหน้าระดับบทเรียน</h1>
          <p>{pagination?.total_count || 0} บทเรียน</p>
        </span>
      </div>
      <div className="w-full px-5">
        <div className="mt-5 flex gap-5">
          <WCADropdown
            placeholder={subjectName ?? ''}
            options={[]}
            onSelect={() => {}}
            disabled
          />
        </div>
        <div className="mt-5">
          {fetching ? (
            <div className="flex h-64 items-center justify-center">
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : lessonData && lessonData.length > 0 ? (
            <>
              <LessonBarChart data={lessonData} />
              {totalPages > 1 && (
                <CWPagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <p>ไม่พบข้อมูลบทเรียน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonInfo;
