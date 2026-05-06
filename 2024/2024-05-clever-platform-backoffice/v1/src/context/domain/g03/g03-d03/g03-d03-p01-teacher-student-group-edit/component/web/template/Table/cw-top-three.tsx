import CWSelect from '@component/web/cw-select';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import CWPagination from '../../organism/cw-pagination';
import {
  DashboradProp,
  TopStudent,
} from '@domain/g03/g03-d03/local/api/group/student-overview/types';
import API from '@domain/g03/g03-d03/local/api';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';

export interface ScoreMax {
  id: number;
  first_name: string;
  last_name: string;
  subject_name: string;
  lesson_name: string;
  score: number;
}

const CWTopThreeScore = ({
  study_group_id,
  lesson_ids,
  sub_lesson_ids,
  lesson_name,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<TopStudent[]>([]);

  useEffect(() => {
    fetchTopThreeStudent();
  }, [lesson_ids, sub_lesson_ids]);

  const fetchTopThreeStudent = async () => {
    if (!study_group_id || !lesson_ids || !sub_lesson_ids) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.studentOverviewRestAPI.GetA05({
        study_group_id: study_group_id,
        lesson_ids: lesson_ids,
        sub_lesson_ids: sub_lesson_ids,
        limit: 3,
      });

      if (res.status_code === 200) {
        setRecords(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  const columnDefs = useMemo<DataTableColumn<TopStudent>[]>(() => {
    const finalDefs: DataTableColumn<TopStudent>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      {
        accessor: 'name',
        title: 'ชื่อ - นามสกุล',
        render: (record) => `${record.name}`,
      },
    ];

    return finalDefs;
  }, []);

  return (
    <div className="h-[380px] w-full">
      <div className="w-full border-b-2 border-neutral-100 px-2 py-3">
        <h1 className="font-bold">3 อันดับ นักเรียนที่ได้คะแนนสูงสดในแต่ละบท</h1>
      </div>
      <div className="w-full px-5">
        <div className="h-[300px] w-full">
          <div className="mt-5 flex gap-5">
            <WCADropdown
              placeholder={lesson_name ?? ''}
              options={[]}
              onSelect={() => {}}
              disabled
            />
          </div>
          <div className="mt-5 w-full">
            <DataTable
              className="table-hover whitespace-nowrap"
              columns={columnDefs}
              records={records}
              noHeader
              minHeight={200}
              noRecordsText="ไม่พบข้อมูล"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CWTopThreeScore;
