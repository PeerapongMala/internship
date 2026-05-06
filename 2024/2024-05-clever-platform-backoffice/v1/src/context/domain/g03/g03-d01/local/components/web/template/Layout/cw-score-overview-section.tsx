import { useEffect, useMemo, useState } from 'react';
import CWAverageScore from '../Chart/cw-average-score';

import API from '@domain/g03/g03-d01/local/api';
import { DashboradProp, Score } from '@domain/g03/g03-d01/local/type';

export const CWScoreOverviewSection = ({
  academicYear,
  year,
  classroom,
  lesson_id,
  onScoreTotalChange,
  onScoreTotalPassChange,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [record, setRecord] = useState<Score[]>([]);

  const shouldFetch = useMemo(() => {
    return classroom && lesson_id;
  }, [classroom, lesson_id]);

  useEffect(() => {
    if (shouldFetch) {
      fetchLevel();
    }
  }, [shouldFetch]);

  const fetchLevel = async () => {
    if (!classroom || classroom.length === 0 || !lesson_id) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.dashboard.GetA07({
        class_ids: classroom,
        lesson_ids: lesson_id,
      });

      if (res.status_code === 200) {
        setRecord(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };
  return (
    <div className="p-2">
      <CWAverageScore
        record={record}
        onScoreTotalChange={onScoreTotalChange}
        onScoreTotalPassChange={onScoreTotalPassChange}
      />
    </div>
  );
};

export default CWScoreOverviewSection;
