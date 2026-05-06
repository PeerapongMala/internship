import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import CWSchoolCard from '@component/web/cw-school-card';
import CWSelect from '@component/web/cw-select';
import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import CWMTab from '@component/web/molecule/cw-m-tab';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconKey from '@core/design-system/library/component/icon/IconKey';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import API from '@domain/g03/g03-d04/local/api';
import { AccountStudentResponse } from '@domain/g03/g03-d04/local/api/group/account-student/type.ts';
import { SchoolResponse } from '@domain/g03/g03-d04/local/api/group/school/type.ts';
import StoreGlobal from '@global/store/global';
import showMessage from '@global/utils/showMessage.ts';
import { Link } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { toDateTimeTH } from '@global/utils/date';
import CWButton from '@component/web/cw-button';
import CWInput from '@component/web/cw-input';
import CWModalSelectClass from '@component/web/organism/cw-o-modal-select-class';
import { filter } from 'lodash';
import CWClassSelector from '@component/web/organism/cw-o-select-class-student';
import { getClassData } from '@global/utils/store/get-class-data';
import { getUserData } from '@global/utils/store/getUserData';
import { getUserSubjectData } from '@global/utils/store/user-subject';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const userData = getUserData();
  const subjectData = getUserSubjectData();

  const [schoolData, setSchoolData] = useState<SchoolResponse>();
  const [accountStudentData, setAccountStudentData] =
    useState<AccountStudentResponse[]>();
  const [fetching, setFetching] = useState<boolean>(false);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [isModalOpenClass, setModalOpenClass] = useState(false);
  const filters = getClassData();

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
    if (!schoolData?.school_id) return;
    const fetchAccountStudent = async () => {
      setFetching(true);
      try {
        const res = await API.accountStudent.GetAccountStudent({
          page: pagination.page,
          limit: pagination.limit,
          academic_year:
            filters?.academic_year?.toString() ?? userData.academic_year?.toString(),
          name: filters?.class_name,
          search: searchText,
          school_id: String(schoolData?.school_id),
          class_id: filters?.class_id,
          subject_id: subjectData?.id,
        });
        if (res.status_code === 200) {
          setAccountStudentData(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res._pagination.total_count,
          }));
          setFetching(false);
        }
      } catch (error) {
        showMessage(`Failed to fetch account students: ${error}`, 'error');
      }
    };

    fetchAccountStudent();
  }, [
    pagination.page,
    pagination.limit,
    selectedAcademicYear,
    searchText,
    schoolData,
    filters,
  ]);

  const [selectedRecords, setSelectedRecords] = useState<any>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AccountStudentResponse | null>(
    null,
  );

  const handleResetPassword = async (
    studentId: string,
    password: string,
    onClose: () => void,
  ) => {
    if (!password) {
      showMessage('กรุณากรอกรหัสผ่าน', 'warning');
      return;
    }
    if (password.length < 4) {
      showMessage('กรุณากรอกรหัสให้ครบ 4 หลัก', 'warning');
      return;
    }
    if (password.length > 4) {
      showMessage('กรุณากรอกรหัสไม่เกิน 4 หลัก', 'warning');
      return;
    }
    try {
      await API.accountStudent.UpdateStudentPin(studentId, password);
      showMessage('เปลี่ยน PIN สำเร็จ!', 'success');
      onClose();
    } catch (error) {
      showMessage('ไม่สามารถเปลี่ยน PIN ได้', 'error');
    }
  };

  const rowColumns: DataTableColumn<AccountStudentResponse>[] = [
    {
      title: 'ดูข้อมูล',
      accessor: 'view',
      textAlign: 'center',
      render: (row) => (
        <div className="flex w-full justify-center">
          <Link to={`/teacher/student/student-info/${row.id}`}>
            <IconEye />
          </Link>
        </div>
      ),
    },
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    {
      title: 'รหัสนักเรียน',
      accessor: 'student_id',
      render: (row) => row.student_id ?? '-',
    },
    {
      title: 'คำนำหน้า',
      accessor: 'title',
      render: (row) => row.title ?? '-',
    },
    {
      title: 'ชื่อ',
      accessor: 'first_name',
      render: (row) => row.first_name ?? '-',
    },
    {
      title: 'สกุล',
      accessor: 'last_name',
      render: (row) => row.last_name ?? '-',
    },
    {
      title: 'อีเมล',
      accessor: 'email',
      render: (row) => row.email ?? '-',
    },
    {
      title: 'เข้าใช้งานล่าสุด',
      accessor: 'last_login',
      render: (row) => (row.last_login ? toDateTimeTH(row.last_login) : '-'),
    },
    {
      title: 'เปลี่ยนพิน',
      accessor: 'editpin',
      textAlign: 'center',
      render: (row) => (
        <button
          className="flex w-full items-center justify-center"
          onClick={() => {
            setSelectedStudent(row);
            setIsModalOpen(true);
          }}
        >
          <IconKey />
        </button>
      ),
    },
  ];

  const options = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '30', value: 30 },
  ];

  const onBulkEdit = async (records: any): Promise<void> => {
    if (records.length === 0) {
      console.error('No records selected for bulk edit');
      return Promise.reject(new Error('No records selected'));
    }

    const data = records.map((record: any) => ({
      id: record.id,
      status: (record.status = 'disabled'),
    }));

    try {
      // API BulkEdit
      setSelectedRecords([]);
    } catch (error) {
      console.error('Failed to perform bulk edit:', error);
      throw error;
    }
  };

  const onDownloadCSV = () => {
    // API Download
    console.log('downloadCSV');
    return;
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

      <div>
        <h1 className="text-2xl font-bold">ข้อมูลนักเรียน</h1>
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

      <div className="panel flex flex-col gap-5">
        <CWOHeaderTableButton
          showBulkEditButton={false}
          showUploadButton={false}
          onSearchChange={(e) => setSearchText(e.target.value)}
          onDownload={onDownloadCSV}
        />

        <div className="flex w-fit flex-wrap gap-2">
          <CWClassSelector classes={filters} />
        </div>

        <div className="datatables">
          <div className="datatables">
            {accountStudentData && accountStudentData.length > 0 ? (
              <DataTable
                className="table-hover whitespace-nowrap"
                records={accountStudentData}
                columns={rowColumns}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={setSelectedRecords}
                highlightOnHover
                withTableBorder
                withColumnBorders
                height={'calc(100vh - 350px)'}
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
                records={[]}
                columns={rowColumns}
                highlightOnHover
                withTableBorder
                withColumnBorders
                height={'calc(100vh - 350px)'}
                noRecordsText="ไม่พบข้อมูล"
                fetching={fetching}
                loaderType="oval"
                loaderBackgroundBlur={4}
              />
            )}
          </div>
        </div>
        <CWModalResetPassword
          maxLength={4}
          mode="pin"
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudent(null);
          }}
          onOk={(password) => {
            if (selectedStudent) {
              handleResetPassword(selectedStudent.id, password, () => {
                setIsModalOpen(false);
                setSelectedStudent(null);
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
