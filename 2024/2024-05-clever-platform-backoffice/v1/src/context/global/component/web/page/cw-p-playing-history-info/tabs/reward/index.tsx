import CWImg from '@component/web/atom/wc-a-img';
import CWSelect from '@component/web/cw-select';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import API_g03 from '@domain/g03/g03-d04/local/api';
import {
  ParamsTeacherStudent,
  RewardListResponse,
} from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import { toDateTimeTH } from '@global/utils/date.ts';
import downloadCSV from '@global/utils/downloadCSV.ts';
import showMessage from '@global/utils/showMessage.ts';
import { useParams, useRouter } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useCallback, useEffect, useState } from 'react';

const Reward = ({ userId }: { userId: string }) => {
  const {
    state: {
      location: { pathname },
    },
  } = useRouter();
  const { schoolId, studentId, classId, academicYear } = useParams({ from: '' });
  const isAdminPath = pathname.includes('/admin/school');
  const [lessonOptions, setLessonOptions] = useState<{ label: string; value: any }[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<{ label: string; value: any }[]>(
    [],
  );
  const [records, setRecords] = useState<RewardListResponse[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [filters, setFilters] = useState<Partial<ParamsTeacherStudent>>({});

  const fetchOptions = useCallback(async () => {
    if (!studentId || !academicYear) return;
    setFetching(true);
    try {
      const userOrStudentId = isAdminPath ? userId : studentId;
      const [lessonRes, subjectRes] = await Promise.all([
        API_g03.teacherStudent.GetOptions(
          userOrStudentId,
          academicYear,
          'curriculum-group',
        ),
        API_g03.teacherStudent.GetOptions(userOrStudentId, academicYear, 'subject'),
      ]);
      setLessonOptions(
        lessonRes?.status_code === 200
          ? lessonRes.data.values.map((v) => ({ label: v.label, value: v.id }))
          : [],
      );
      setSubjectOptions(
        subjectRes?.status_code === 200
          ? subjectRes.data.values.map((v) => ({ label: v.label, value: v.id }))
          : [],
      );
    } catch (error) {
      console.error('Error fetching options:', error);
    } finally {
      setFetching(false);
    }
  }, [studentId, academicYear, userId, isAdminPath]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    const fetchRewardList = async () => {
      setFetching(true);
      const rewardListId = isAdminPath ? userId : studentId;
      try {
        const response = await API_g03.teacherStudent.GetRewardList(
          rewardListId,
          academicYear,
          {
            start_date: filters.start_date,
            end_date: filters.end_date,
            search: filters.search,
            lesson_id: filters.lesson_id,
            subject_id: filters.subject_id,
          },
        );
        if (response?.status_code === 200) {
          setRecords(response.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchRewardList();
  }, [filters, isAdminPath, studentId, userId, academicYear]);

  const columns: DataTableColumn<RewardListResponse>[] = [
    { accessor: 'reward_id', title: '#' },
    { accessor: 'item_type', title: 'ประเภท' },
    {
      accessor: 'item_image_url',
      title: 'รูปภาพ',
      render: (row) => (
        <CWImg src={row.item_image_url} alt={row.item_image_url} width={40} height={40} />
      ),
    },
    { accessor: 'item_name', title: 'ชื่อรางวัล' },
    { accessor: 'description', title: 'คำอธิบาย' },
    { accessor: 'amount', title: 'จำนวน' },
    { accessor: 'gived_by', title: 'ได้รับจาก' },
    {
      accessor: 'received_at',
      title: 'ได้รับเมื่อ',
      render: (row) => toDateTimeTH(row.received_at) ?? '-',
    },
    {
      accessor: 'used_at',
      title: 'ใช้งานเมื่อ',
      render: (row) => (row.used_at ? toDateTimeTH(row.used_at) : '-'),
    },
  ];

  const onDownload = (dateFrom: string, dateTo: string) => {
    API_g03.teacherStudent
      .DownloadRewardCsv(userId, academicYear, {
        start_date: dateFrom,
        end_date: dateTo,
        search: filters.search,
        lesson_id: filters.lesson_id,
        subject_id: filters.subject_id,
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, `${getDateTime()}_${userId}_reward.csv`);
        } else {
          showMessage('Download failed!', 'error');
        }
      })
      .catch(() => {
        showMessage('Download failed!', 'error');
      });
  };

  return (
    <div className="panel flex flex-col gap-5">
      <CWOHeaderTableButton
        showBulkEditButton={false}
        showUploadButton={false}
        onSearchChange={(e) =>
          setFilters((prev) => ({ ...prev, search: e.target.value }))
        }
        onDownload={(data) => onDownload(data.dateFrom, data.dateTo)}
      />
      <div className="flex w-fit flex-wrap gap-2">
        <CWMDaterange
          onChange={(e) => {
            const [startDate, endDate] = e.map(
              (date) => date?.toISOString().split('T')[0] || '',
            );
            setFilters((prev) => ({ ...prev, start_date: startDate, end_date: endDate }));
          }}
        />
        <CWSelect
          title="สังกัดวิชา"
          options={lessonOptions}
          value={filters.lesson_id}
          onChange={(e) => setFilters((prev) => ({ ...prev, lesson_id: e.target.value }))}
          className="min-w-48"
          disabled={fetching}
        />
        <CWSelect
          title="วิชา"
          options={subjectOptions}
          value={filters.subject_id}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, subject_id: e.target.value }))
          }
          className="min-w-48"
          disabled={fetching}
        />
      </div>
      <DataTable
        className="table-hover whitespace-nowrap"
        records={records}
        columns={columns}
        highlightOnHover
        withTableBorder
        withColumnBorders
        height={'calc(100vh - 350px)'}
        noRecordsText="ไม่พบข้อมูล"
        fetching={fetching}
      />
    </div>
  );
};

export default Reward;
