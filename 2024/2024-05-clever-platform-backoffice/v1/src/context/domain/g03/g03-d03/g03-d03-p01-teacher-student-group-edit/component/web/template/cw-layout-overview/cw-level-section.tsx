import { useEffect, useState } from 'react';

import CWLevelAverage from '../Chart/cw-level-average';
import {
  DashboradProp,
  StudentLevel,
} from '@domain/g03/g03-d03/local/api/group/student-overview/types';
import API from '@domain/g03/g03-d03/local/api';

const CWLevelSection = ({
  study_group_id,
  lesson_ids,
  sub_lesson_ids,
  onLevelTotalChange,
  start_at,
  end_at,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [record, setRecord] = useState<StudentLevel[]>([]);

  useEffect(() => {
    StudentOverview();
  }, [lesson_ids, sub_lesson_ids, end_at]);

  const StudentOverview = async () => {
    if (!study_group_id || !lesson_ids || !start_at || !end_at) {
      return;
    }
    try {
      const res = await API.studentOverviewRestAPI.GetA04({
        study_group_id: study_group_id,
        lesson_ids: lesson_ids,
        sub_lesson_ids: sub_lesson_ids,
        start_at: start_at,
        end_at: end_at,
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
        level_passed: acc.level_passed + (record.level_passed || 0),
        level_failed: acc.level_failed + (record.level_failed || 0),
      };
    },
    { total_level: 0, level_passed: 0, level_failed: 0 },
  ) || { total_level: 0, level_passed: 0, level_failed: 0 };

  const data = [
    // aggregatedData.total_level,
    aggregatedData.level_passed,
    aggregatedData.level_failed,
  ];
  // setTotal
  useEffect(() => {
    if (onLevelTotalChange) {
      onLevelTotalChange(aggregatedData.total_level);
    }
  }, [aggregatedData.total_level, onLevelTotalChange]);

  return (
    <div className="w-full">
      <div className="mt-[50px] h-[350px] w-full">
        <CWLevelAverage data={data} totol={aggregatedData.total_level} />
      </div>
    </div>
  );
};

export default CWLevelSection;
