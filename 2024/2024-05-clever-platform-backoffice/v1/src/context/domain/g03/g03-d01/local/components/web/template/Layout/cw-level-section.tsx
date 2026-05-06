import { useEffect, useMemo, useState } from 'react';
import CWLevelPassed from '../Chart/cw-level-passed';
import { DashboradProp, Level } from '@domain/g03/g03-d01/local/type';
import API from '@domain/g03/g03-d01/local/api';

const CWLevelSection = ({
  academicYear,
  year,
  classroom,
  lesson_id,
  onLevelTotalChange,
  onLevelTotalPassChange,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [record, setRecord] = useState<Level[]>([]);

  const shouldFetch = useMemo(() => {
    return classroom && lesson_id;
  }, [classroom, lesson_id]);

  useEffect(() => {
    if (shouldFetch) {
      fetchLevel();
    }
  }, [shouldFetch]);

  const fetchLevel = async () => {
    if (!classroom || classroom.length === 0) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.dashboard.GetA06({
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
  const aggregatedData = record?.reduce(
    (acc, record) => {
      return {
        total_level: acc.total_level + (record.total_level || 0),
        passed_level: acc.passed_level + (record.passed_level || 0),
        failed_level: acc.failed_level + (record.failed_level || 0),
      };
    },
    { total_level: 0, passed_level: 0, failed_level: 0 },
  ) || { total_level: 0, passed_level: 0, failed_level: 0 };

  const data = [
    // aggregatedData.total_level,
    aggregatedData.passed_level,
    aggregatedData.failed_level,
  ];

  useEffect(() => {
    if (onLevelTotalChange && onLevelTotalPassChange) {
      onLevelTotalChange(aggregatedData.total_level);
      onLevelTotalPassChange(aggregatedData.passed_level);
    }
  }, [aggregatedData.total_level, onLevelTotalChange]);

  return (
    <div className="p-2">
      <CWLevelPassed data={data} />
    </div>
  );
};

export default CWLevelSection;
