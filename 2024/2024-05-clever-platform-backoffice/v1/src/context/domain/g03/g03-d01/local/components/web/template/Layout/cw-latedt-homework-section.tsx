import { useEffect, useMemo, useState } from 'react';
import CWLatestHomework from '../Chart/cw-latest-homework';
import API from '@domain/g03/g03-d01/local/api';
import { DashboradProp, LatestHomework } from '@domain/g03/g03-d01/local/type';
import showMessage from '@global/utils/showMessage';
import { toDateTimeTH } from '@global/utils/date';

const CWLatestHomeworkSection = ({
  academicYear,
  year,
  classroom,
  lesson_name,
  lesson_id,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [record, setRecord] = useState<LatestHomework[]>([]);

  const shouldFetch = useMemo(() => {
    return classroom && lesson_id;
  }, [classroom, lesson_id]);

  useEffect(() => {
    if (shouldFetch) {
      fetchLatestHomework();
    }
  }, [shouldFetch]);

  const fetchLatestHomework = async () => {
    if (!classroom || classroom.length === 0) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.dashboard.GetA05({
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
        not_start: acc.not_start + (record.not_start || 0),
        in_progress: acc.in_progress + (record.in_progress || 0),
        submitted_late: acc.submitted_late + (record.submitted_late || 0),
        submitted: acc.submitted + (record.submitted || 0),
        total_submission: acc.total_submission + (record.total_submission || 0),
      };
    },
    {
      not_start: 0,
      in_progress: 0,
      submitted_late: 0,
      submitted: 0,
      total_submission: 0,
    },
  ) || {
    not_start: 0,
    in_progress: 0,
    submitted_late: 0,
    submitted: 0,
    total_submission: 0,
  };

  const data = [
    aggregatedData.not_start,
    aggregatedData.in_progress,
    // aggregatedData.submitted_late,
    aggregatedData.submitted,
  ];

  const formatDateSafe = (dateString: string | undefined) => {
    if (
      !dateString ||
      dateString === '0001-01-01T00:00:00Z' ||
      dateString.startsWith('0001-01-01')
    ) {
      return '-';
    }
    return toDateTimeTH(dateString);
  };

  return (
    <div className="px-5 py-5">
      <h1 className="font-bold">
        {lesson_name ?? 'ชื่อบทเรียน'} / {year}
      </h1>
      <div className="flex justify-between gap-5">
        <p>วันที่สั่งการบ้าน: {formatDateSafe(record[0]?.started_at)}</p>
        <p>วันที่ปิดรับการบ้าน: {formatDateSafe(record[0]?.closed_at)}</p>
        <p>วันกำหนดส่ง: {formatDateSafe(record[0]?.due_at)}</p>
      </div>
      <div className="mt-[68px] h-[350px] w-full">
        <CWLatestHomework data={data} totol={aggregatedData.total_submission} />
      </div>
    </div>
  );
};

export default CWLatestHomeworkSection;
