import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import { Thai } from 'flatpickr/dist/l10n/th';
import CWHomework from '../Chart/cw-homework';

import { useEffect, useMemo, useState } from 'react';
import {
  DashboradProp,
  LatestHomework,
  ResHomework,
} from '@domain/g03/g03-d01/local/type';
import API from '@domain/g03/g03-d01/local/api';

const CWHomeworkSection = ({
  academicYear,
  classroom,
  lesson_id,
  onHomeworkTotalChange,
  start_at,
  end_at,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [record, setRecord] = useState<ResHomework[]>([]);

  //pick date

  const [defaultStartDate, setDefaultStartDate] = useState<string>(start_at || '');
  const [defaultEndDate, setDefaultEndDate] = useState<string>(end_at || '');

  const [userSelectedStartDate, setUserSelectedStartDate] = useState<string>('');
  const [userSelectedEndDate, setUserSelectedEndDate] = useState<string>('');

  const startDate = userSelectedStartDate || defaultStartDate;
  const endDate = userSelectedEndDate || defaultEndDate;

  const [dueStartDate, setDueStartDate] = useState<string>('');
  const [dueEndDate, setDueEndDate] = useState<string>('');

  const [closeStartDate, setCloseStartDate] = useState<string>('');
  const [closeEndDate, setCloseEndDate] = useState<string>('');

  useEffect(() => {
    setDefaultStartDate(start_at || '');
    setDefaultEndDate(end_at || '');
  }, [start_at, end_at]);

  const shouldFetch = useMemo(() => {
    return classroom && lesson_id;
  }, [classroom, lesson_id]);

  useEffect(() => {
    if (shouldFetch) {
      fetchHomework();
    }
  }, [
    shouldFetch,
    academicYear,
    startDate,
    endDate,
    dueStartDate,
    dueEndDate,
    closeStartDate,
    closeEndDate,
  ]);

  const fetchHomework = async () => {
    if (!classroom || classroom.length === 0 || !lesson_id) {
      return;
    }
    try {
      const params: any = {
        class_ids: classroom,
        lesson_ids: lesson_id,
        start_at: start_at,
        end_at: end_at,
      };

      if (startDate) params.start_date_start_at = startDate;
      if (endDate) params.start_date_end_at = endDate;

      if (dueStartDate) params.due_date_start_at = dueStartDate;
      if (dueEndDate) params.due_date_end_at = dueEndDate;

      if (closeStartDate) params.closed_date_start_at = closeStartDate;
      if (closeEndDate) params.closed_date_end_at = closeEndDate;

      const res = await API.dashboard.GetA15(params);

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
        total_homework: acc.total_homework + (record.total_homework || 0),
        not_start: acc.not_start + (record.not_start || 0),
        in_progress: acc.in_progress + (record.in_progress || 0),
        done: acc.done + (record.done || 0),
      };
    },
    { total_homework: 0, not_start: 0, in_progress: 0, done: 0 },
  ) || { total_homework: 0, not_start: 0, in_progress: 0, done: 0 };

  const data = [
    aggregatedData.not_start,
    aggregatedData.in_progress,
    aggregatedData.done,
  ];
  // setTotal
  useEffect(() => {
    if (onHomeworkTotalChange) {
      onHomeworkTotalChange(aggregatedData.total_homework);
    }
  }, [aggregatedData.total_homework]);

  const handleDateChange = (
    dates: Date[],
    setStart: (date: string) => void,
    setEnd: (date: string) => void,
  ) => {
    if (dates.length === 2) {
      const start = new Date(
        Date.UTC(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate()),
      );
      const end = new Date(
        Date.UTC(dates[1].getFullYear(), dates[1].getMonth(), dates[1].getDate()),
      );

      setUserSelectedStartDate(start.toISOString());
      setUserSelectedEndDate(end.toISOString());
    } else {
      setUserSelectedStartDate('');
      setUserSelectedEndDate('');
    }
  };

  const clearFilters = () => {
    setUserSelectedStartDate('');
    setUserSelectedEndDate('');
    setDueStartDate('');
    setDueEndDate('');
    setCloseStartDate('');
    setCloseEndDate('');
  };

  return (
    <div className="w-full px-5">
      <div className="mt-5 flex flex-col gap-5">
        <div className="relative flex w-full gap-5">
          <div className="w-full">
            <p>วันที่สั่งการบ้าน</p>
            <WCAInputDateFlat
              key={`${startDate}-${endDate}`}
              placeholder="วว/ดด/ปป - วว/ดด/ปปปป"
              options={{
                mode: 'range',
                dateFormat: 'd/m/Y',
                locale: { ...Thai },
              }}
              className="w-full"
              value={
                startDate && endDate
                  ? [new Date(startDate), new Date(endDate)]
                  : undefined
              }
              onChange={(dates: Date[]) =>
                handleDateChange(dates, setUserSelectedStartDate, setUserSelectedEndDate)
              }
            />
          </div>

          <div className="w-full">
            <p>วันกำหนดส่ง</p>
            <WCAInputDateFlat
              key={`${dueStartDate}-${dueStartDate}`}
              placeholder="วว/ดด/ปป - วว/ดด/ปปปป"
              options={{
                mode: 'range',
                dateFormat: 'd/m/Y',
                locale: { ...Thai },
              }}
              value={
                dueStartDate && dueEndDate
                  ? [new Date(dueStartDate), new Date(dueEndDate)]
                  : undefined
              }
              onChange={(dates: Date[]) =>
                handleDateChange(dates, setDueStartDate, setDueEndDate)
              }
            />
          </div>
          <div className="w-full">
            <p>วันที่ปิดรับการบ้าน</p>
            <WCAInputDateFlat
              key={`${closeStartDate}-${closeEndDate}`}
              placeholder="วว/ดด/ปป - วว/ดด/ปปปป"
              options={{
                mode: 'range',
                dateFormat: 'd/m/Y',
                locale: { ...Thai },
              }}
              value={
                closeStartDate && closeEndDate
                  ? [new Date(closeStartDate), new Date(closeEndDate)]
                  : undefined
              }
              onChange={(dates: Date[]) =>
                handleDateChange(dates, setCloseStartDate, setCloseEndDate)
              }
            />
          </div>
          <div className="absolute -right-5 -top-[68px] mt-2 flex w-full justify-end">
            <button onClick={clearFilters} className="underline hover:underline-offset-2">
              ล้างตัวกรอง
            </button>
          </div>
        </div>
      </div>
      <div className="mt-[50px] h-[350px] w-full">
        <CWHomework
          data={data}
          totol={aggregatedData.total_homework}
          //   onHomeworkTotalChange={onHomeworkTotalChange}
        />
      </div>
    </div>
  );
};

export default CWHomeworkSection;
