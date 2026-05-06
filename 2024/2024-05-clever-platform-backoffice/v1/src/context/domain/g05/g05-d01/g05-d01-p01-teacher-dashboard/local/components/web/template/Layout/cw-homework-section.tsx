import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWSelect from '@component/web/cw-select';
import { Thai } from 'flatpickr/dist/l10n/th';
import CWHomework from '../Chart/cw-homework';
import { DashboradProp, ResHomework } from '../../../../type';
import { useEffect, useMemo, useState } from 'react';
import API from '../../../../api';
import SelectUserSubjectData from '@component/web/cw-select-user-subject-data';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';

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
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [dueStartDate, setDueStartDate] = useState<string>('');
  const [dueEndDate, setDueEndDate] = useState<string>('');

  const [closeStartDate, setCloseStartDate] = useState<string>('');
  const [closeEndDate, setCloseEndDate] = useState<string>('');

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
      // ใช้ UTC date
      const start = new Date(
        Date.UTC(dates[0].getFullYear(), dates[0].getMonth(), dates[0].getDate()),
      );
      const end = new Date(
        Date.UTC(dates[1].getFullYear(), dates[1].getMonth(), dates[1].getDate()),
      );

      setStart(start.toISOString());
      setEnd(end.toISOString());
    } else {
      setStart('');
      setEnd('');
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setDueStartDate('');
    setDueEndDate('');
    setCloseStartDate('');
    setCloseEndDate('');
  };

  return (
    <div className="w-full px-5">
      <div className="mt-5 flex flex-col gap-5">
        <div className="flex w-full flex-col gap-5">
          <div className="w-full">
            <CWMAccordion title="ตัวกรอง" headerClassName="bg-[#D5DDFF] mt-5 ">
              <div className="mt-3 space-y-4 bg-[#F0F3FF] p-3 p-4 shadow-[0px_1px_3px_0px_#0000001A,_0px_1px_2px_0px_#0000001A]">
                <SelectUserSubjectData />
                <div className="flex w-full gap-4">
                  <WCAInputDateFlat
                    placeholder="วันที่สั่งการบ้าน"
                    options={{
                      mode: 'range',
                      dateFormat: 'd/m/Y',
                      locale: { ...Thai },
                    }}
                    className="w-full flex-1"
                    onChange={(dates: Date[]) =>
                      handleDateChange(dates, setStartDate, setEndDate)
                    }
                    hideIcon
                  />

                  <WCAInputDateFlat
                    placeholder="วันกำหนดส่ง"
                    options={{
                      mode: 'range',
                      dateFormat: 'd/m/Y',
                      locale: { ...Thai },
                    }}
                    className="w-full flex-1"
                    onChange={(dates: Date[]) =>
                      handleDateChange(dates, setDueStartDate, setDueEndDate)
                    }
                    hideIcon
                  />
                </div>

                <WCAInputDateFlat
                  placeholder="วันปิดรับ"
                  options={{
                    mode: 'range',
                    dateFormat: 'd/m/Y',
                    locale: { ...Thai },
                  }}
                  onChange={(dates: Date[]) =>
                    handleDateChange(dates, setCloseStartDate, setCloseEndDate)
                  }
                  hideIcon
                />
              </div>
            </CWMAccordion>
          </div>
        </div>
      </div>
      <div className="mt-[50px] h-[350px] w-full">
        <CWHomework data={data} totol={aggregatedData.total_homework} />
      </div>
    </div>
  );
};
export default CWHomeworkSection;
