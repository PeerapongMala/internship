import { useEffect, useMemo, useState } from 'react';
import CWSubmission from '../Chart/cw-submission';

import { questionOverview } from '@domain/g03/g03-d01/local/type';
import API from '@domain/g03/g03-d01/local/api';
import { DashboradProp } from '../../../../type';

const CWQuestionOverviewSection = ({
  classroom,
  lesson_id,
  onPointTotalChange,
  onPointTotalPassChange,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [record, setRecord] = useState<questionOverview[]>([]);

  const shouldFetch = useMemo(() => {
    return classroom && lesson_id;
  }, [classroom, lesson_id]);

  useEffect(() => {
    if (shouldFetch) {
      fetchQuestion();
    }
  }, [shouldFetch, onPointTotalChange, onPointTotalPassChange]);

  const fetchQuestion = async () => {
    if (!classroom || classroom.length === 0) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.dashboard.GetA08({
        class_ids: classroom,
        lesson_ids: lesson_id ?? undefined,
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
      <CWSubmission
        record={record}
        onPointTotalChange={onPointTotalChange}
        onPointTotalPassChange={onPointTotalPassChange}
      />
    </div>
  );
};

export default CWQuestionOverviewSection;
