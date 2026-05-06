import CWSchoolCard from '@component/web/cw-school-card';
import CWSelect from '@component/web/cw-select';
import CWMTab from '@component/web/molecule/cw-m-tab';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconChatDot from '@core/design-system/library/vristo/source/components/Icon/IconChatDots';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import AcademicYearModal from '@domain/g03/g03-d04/g03-d04-p02-all-student/component/web/template/academic-year-modal';
import { SchoolResponse } from '@domain/g03/g03-d04/local/api/group/school/type.ts';
import { StudentStatResponse } from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import StoreGlobal from '@global/store/global';
import { toDateTimeTH } from '@global/utils/date';
import showMessage from '@global/utils/showMessage.ts';
import { Link } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import API from '../local/api';
import API2 from '@domain/g03/g03-d11/local/api';
import ConfigJson from './config/index.json';
import { useChatStore } from '@domain/g03/g03-d11/local/stores/chat-list';
import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import StoreGlobalPersist from '@store/global/persist';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import CwProgressBar from '@component/web/cw-progress-bar';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { formatTimeString } from '@global/utils/format/time';
import CWInput from '@component/web/cw-input';
import CWModalSelectClass from '@component/web/organism/cw-o-modal-select-class';
import CWClassSelector from '@component/web/organism/cw-o-select-class-student';
import { getClassData } from '@global/utils/store/get-class-data';
import { getUserData } from '@global/utils/store/getUserData';
import {
  getUserSubjectData,
  setUserSubjectDataByIndex,
} from '@global/utils/store/user-subject';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [schoolData, setSchoolData] = useState<SchoolResponse>();
  const [fetching, setFetching] = useState<boolean>(false);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const { academiceYear } = StoreGlobalPersist.StateGet(['academiceYear']);
  const [records, setRecords] = useState<StudentStatResponse[]>([]);
  const [optionYear, setOptionYear] = useState<{ label: string; value: number }[]>([]);
  const [optionRoom, setOptionRoom] = useState<{ label: string; value: number }[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalAcademicYearOpen, setIsModalAcademicYearOpen] = useState(false);
  const { setCurrentChatId } = useChatStore();
  const navigate = useNavigate();

  const userData = getUserData();
  const subjectData = getUserSubjectData();

  const [isModalOpen, setModalOpen] = useState(false);
  const filters = getClassData();

  const schoolId = userData.school_id;
  const handleToChat = (id: string) => {
    setCurrentChatId(id);

    // Store the current chat ID in sessionStorage for persistence across navigation
    sessionStorage.setItem('currentChatId', id);

    // Navigate to the chat page
    navigate({ to: '/teacher/chat' });
  };
  const handleSendMessage = async (user_id: string) => {
    try {
      if (!schoolId) {
        throw new Error('School ID is missing');
      }

      const results = await API2.chatRepo.SendMessageFirst({
        school_id: +schoolId,
        reciever_id: user_id,
      });

      if (!results) {
        throw new Error('Failed to initiate chat');
      }

      return results;
    } catch (error: any) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };
  const handleStartChat = useCallback(
    async (user_id: string) => {
      console.log({ user_id: user_id });
      try {
        await handleSendMessage(user_id);
        setCurrentChatId(`private-${user_id}`);
        sessionStorage.setItem('currentChatId', `private-${user_id}`);

        // Navigate to the chat page
        navigate({ to: '/teacher/chat' });
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [handleSendMessage, setCurrentChatId],
  );

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters, searchText]);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const res = await API.school.GetSchoolId();
        if (res.status_code === 200) {
          setSchoolData(res.data);
        }
      } catch (error) {
        showMessage(`Failed to fetch schools: ${error}`, 'error');
      }
    };

    fetchSchoolData();
  }, []);

  useEffect(() => {
    setFetching(true);
    API.teacherStudent
      .GetStudentStatListByTeacherId({
        page: pagination.page,
        limit: pagination.limit,
        academic_year:
          filters?.academic_year?.toString() ?? userData.academic_year?.toString(),
        school_id: +userData.school_id,
        year: filters?.year,
        class_name: filters?.class_name,
        search: searchText,
        class_id: filters?.class_id,
        subject_id: subjectData?.id,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res._pagination.total_count,
          }));
          setFetching(false);
        }
      });
  }, [pagination.page, pagination.limit, searchText, filters, subjectData?.id]);

  const onDownloadCSV = async () => {
    try {
      const subjectId = subjectData?.id;
      const academicYear = filters?.academic_year ?? userData.academic_year;

      if (!subjectId || !academicYear) {
        showMessage('กรุณาเลือกวิชาและปีการศึกษา', 'error');
        return;
      }

      const blob = await API.teacherStudent.GetStudentStatCsvByTeacherId(
        subjectId,
        academicYear,
      );

      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `student-stat-${academicYear}.csv`; // ตั้งชื่อไฟล์
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        showMessage('ดาวน์โหลด CSV ไม่สำเร็จ', 'error');
      }
    } catch (error) {
      console.error('Download CSV Error:', error);
      showMessage(`เกิดข้อผิดพลาด: ${error}`, 'error');
    }
  };

  const rowColumns: DataTableColumn<StudentStatResponse>[] = [
    {
      title: 'ดู',
      accessor: 'view',
      render: (row) => {
        return (
          <div className="flex gap-2">
            <Link
              to={`/teacher/student/student-info/${row.user_id}/history/${row.class_id}/${row.academic_year}`}
            >
              <IconEye />
            </Link>
          </div>
        );
      },
    },
    {
      title: 'แชท',
      accessor: 'chat',
      render: (row) => {
        return (
          <button className="flex gap-2" onClick={() => handleStartChat(row.user_id)}>
            <IconChatDot />
          </button>
        );
      },
    },
    {
      title: (
        <div className="flex gap-2">
          <span>#</span>
        </div>
      ),
      accessor: 'id',
      render: (id, index) => {
        return (
          <div className="flex gap-2">
            <span>{index + 1}</span>
          </div>
        );
      },
    },
    {
      title: 'รหัสนักเรียน',
      accessor: 'student_id',
    },
    {
      title: 'คำนำหน้า',
      accessor: 'student_title',
    },
    {
      title: 'ชื่อ',
      accessor: 'student_first_name',
    },
    {
      title: 'สกุล',
      accessor: 'student_last_name',
    },
    {
      title: 'ปีการศึกษา',
      accessor: 'academic_year',
    },
    {
      title: 'ชั้นปี',
      accessor: 'class_year',
    },
    {
      title: 'ห้อง',
      accessor: 'class_name',
    },
    {
      title: 'ด่านที่ผ่าน (ด่าน)',
      accessor: 'level',
      render: (row) => {
        const progress = (row.total_passed_level / row.total_level) * 100;
        return (
          <div className="flex flex-col">
            <span className="text-right">
              {row.total_passed_level}/{row.total_level}
            </span>
            <div className="ml-auto w-16">
              <CwProgressBar score={row.total_passed_level} total={row.total_level} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'คะแนนรวม (คะแนน)',
      accessor: 'total_score',
      render: (row) => {
        return (
          <div className="flex flex-col">
            <span className="text-right">
              {row.total_passed_star}/{row.total_star}
            </span>
            <div className="ml-auto w-16">
              <CwProgressBar score={row.total_passed_star} total={row.total_star} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'ทำข้อสอบ (ครั้ง)',
      accessor: 'total_attempt',
      render: (row) => {
        return <div className="text-right">{row.total_attempt || '-'}</div>;
      },
    },
    {
      title: 'เวลาเฉลี่ย/ข้อ',
      accessor: 'avg_time_used',
      render: (row) => {
        return (
          <div className="text-right">
            {row.avg_time_used ? formatTimeString(row.avg_time_used) : '-'}
          </div>
        );
      },
    },
    {
      title: 'เข้าสู่ระบบล่าสุด',
      accessor: 'last_played',
      render: ({ last_played }) => {
        return last_played ? toDateTimeTH(last_played) : '-';
      },
    },
  ];

  const handleSelectAcademicYear = (year?: string) => {
    if (year !== undefined) {
      filters?.year;
      StoreGlobalPersist.MethodGet().setAcademiceYear(year);
    }
    console.log(year);
    setIsModalAcademicYearOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          {
            label: 'การเรียนการสอน',
            href: '/',
            disabled: true,
          },
          {
            label: 'ข้อมูลนักเรียน',
          },
        ]}
      />

      <CWSchoolCard
        name={schoolData?.school_name || '-'}
        code={schoolData?.school_id.toString() || '-'}
        subCode={schoolData?.school_code || '-'}
        image={schoolData?.image_url || '/public/logo192.png'}
      />

      {/* <div>
        <h1
          className="cursor-pointer text-2xl font-bold underline"
          onClick={() => setIsModalAcademicYearOpen(true)}
        >
          {selectedAcademicYear
            ? `ปีการศึกษา ${selectedAcademicYear}`
            : 'เลือกปีการศึกษา'}
        </h1>
        <h2 className="">{pagination.total_count} คน</h2>
      </div> */}

      <div className="w-full">
        <div className="flex w-full justify-between">
          <h1 className="flex-grow-0 text-2xl font-bold">
            ข้อมูลนักเรียน{' '}
            {filters?.academic_year ? `ปีการศึกษา ${filters.academic_year}` : ''}
          </h1>

          {/* {selectedAcademicYear && (
            <CWButton
              icon={<IconPlus />}
              title="เลือกปีการศึกษา"
              onClick={() => setIsModalAcademicYearOpen(true)}
              className="flex-grow-0"
            />
          )} */}
        </div>

        <h2 className="">{pagination.total_count} คน</h2>
      </div>
      <CWMTab
        tabs={[
          // {
          //   name: 'สถิตินักเรียนรายบทเรียน',
          //   to: '/teacher/student',
          // },
          {
            name: 'สถิตินักเรียนรายคน',
            to: '/teacher/student/all-student',
          },
          {
            name: 'จัดการบัญชี & พิน',
            to: '/teacher/student/account-pin',
          },
        ]}
      />
      <CWWhiteBox className="h-[800px] w-full">
        {/* {selectedAcademicYear ? ( */}
        <div className="flex flex-col gap-5">
          <CWOHeaderTableButton
            showBulkEditButton={false}
            showUploadButton={false}
            onSearchChange={(e) => setSearchText(e.target.value)}
            onDownload={onDownloadCSV}
          />

          <div className="flex gap-2">
            <CWClassSelector classes={filters} />
            <CWSelect
              disabled={userData.subject.length == 1}
              hideEmptyOption
              className="w-[250px] max-w-[250px]"
              options={userData.subject.map((data, index) => ({
                label: data.name,
                value: index,
              }))}
              value={0}
              onChange={(e) => setUserSubjectDataByIndex(e.target.value, userData)}
            />
          </div>

          <div className="datatables">
            {records.length > 0 ? (
              <DataTable
                className="table-hover whitespace-nowrap"
                records={records}
                columns={rowColumns}
                highlightOnHover
                withTableBorder
                withColumnBorders
                height={'calc(100vh - 350px)'}
                noRecordsText="ไม่พบข้อมูล"
                totalRecords={pagination.total_count}
                recordsPerPage={pagination.limit}
                page={pagination.page}
                onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                onRecordsPerPageChange={(limit) =>
                  setPagination({
                    page: 1,
                    limit,
                    total_count: pagination.total_count,
                  })
                }
                recordsPerPageOptions={pageSizeOptions}
                paginationText={({ from, to, totalRecords }) =>
                  `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
                }
                fetching={fetching}
                loaderType="oval"
                loaderBackgroundBlur={4}
              />
            ) : (
              <DataTable
                className="table-hover whitespace-nowrap"
                records={records}
                columns={rowColumns}
                highlightOnHover
                withTableBorder
                withColumnBorders
                height={'calc(100vh - 350px)'}
                noRecordsText="ไม่พบข้อมูล"
                fetching={fetching}
              />
            )}
          </div>
        </div>
        {/* ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CWButton
              title="เลือกปีการศึกษา"
              onClick={() => setIsModalAcademicYearOpen(true)}
              className="text-2xl font-bold"
              icon={<IconPlus />}
            />
          </div>
        )} */}
      </CWWhiteBox>

      <AcademicYearModal
        isOpen={isModalAcademicYearOpen}
        onClose={() => {
          setIsModalAcademicYearOpen(false);
        }}
        onOk={handleSelectAcademicYear}
      />
    </div>
  );
};

export default DomainJSX;
