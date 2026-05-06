import IconEye from '@core/design-system/library/component/icon/IconEye.tsx';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import API_g03 from '@domain/g03/g03-d04/local/api';
import { StudyGroupListResponse } from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import downloadCSV from '@global/utils/downloadCSV.ts';
import showMessage from '@global/utils/showMessage.ts';
import { Link, useParams, useRouter } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';

const GroupStudy = ({ userStudentId }: { userStudentId: string }) => {
  const router = useRouter();
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');
  const { schoolId, studentId, classId, academicYear } = useParams({ from: '' });

  const [records, setRecords] = useState<StudyGroupListResponse[]>([]);
  const [fetching, setFetching] = useState(false);
  const [inputValueSearch, setInputValueSearch] = useState('');

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const modalDownload = useModal();

  const onDownload = (dateFrom: string, dateTo: string) => {
    API_g03.teacherStudent
      .DownloadStudyGroupCsv(userStudentId, academicYear, {
        start_date: dateFrom,
        end_date: dateTo,
        search: inputValueSearch,
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, `${getDateTime()}_${userStudentId}_study-group.csv`);
          modalDownload.close();
        } else {
          showMessage('Download failed!', 'error');
        }
      })
      .catch(() => {
        showMessage('Download failed!', 'error');
      });
  };

  useEffect(() => {
    const fetchStudyGroups = async () => {
      setFetching(true);
      try {
        if (isAdminPath || isTeacherPath) {
          const response = isAdminPath
            ? await API_g03.teacherStudent.GetStudyGroupListByStudentIdAndAcademicYear(
                userStudentId,
                academicYear,
                inputValueSearch,
              )
            : await API_g03.teacherStudent.GetStudyGroupListByStudentIdAndAcademicYear(
                studentId,
                academicYear,
                inputValueSearch,
              );

          if (response?.status_code === 200) {
            setRecords(response.data);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchStudyGroups();
  }, [
    inputValueSearch,
    userStudentId,
    academicYear,
    studentId,
    isAdminPath,
    isTeacherPath,
  ]);

  const columns: DataTableColumn<StudyGroupListResponse>[] = [
    {
      accessor: '',
      title: 'ดูข้อมูล',
      titleClassName: 'text-center',
      render: ({ study_group_id }) => (
        <div className="flex w-full justify-center">
          <Link to={`/teacher/student-group/${study_group_id}/edit`}>
            <IconEye />
          </Link>
        </div>
      ),
    },
    {
      accessor: 'study_group_id',
      title: '#',
    },
    {
      accessor: 'study_group_name',
      title: 'ชื่อกลุ่มเรียน',
    },
  ];

  return (
    <div className="panel flex flex-col gap-5">
      <CWOHeaderTableButton
        showBulkEditButton={false}
        showUploadButton={false}
        onSearchChange={(evt) => {
          setInputValueSearch(evt.target.value);
        }}
        onDownload={(data) => onDownload(data.dateFrom, data.dateTo)}
      />

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

export default GroupStudy;
