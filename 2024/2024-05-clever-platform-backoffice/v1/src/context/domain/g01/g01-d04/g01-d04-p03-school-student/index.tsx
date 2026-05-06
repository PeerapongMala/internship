import IconSearch from '@component/web/atom/wc-a-icons/IconSearch.tsx';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import CWWhiteBox from '@component/web/cw-white-box';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive.tsx';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconKey from '@core/design-system/library/component/icon/IconKey.tsx';
import IconLink from '@core/design-system/library/component/icon/IconLink.tsx';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import API from '@domain/g01/g01-d04/local/api';
import { SchoolStudentList } from '@domain/g01/g01-d04/local/type.ts';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import usePagination from '@global/hooks/usePagination';
import { toDateTimeTH } from '@global/utils/date.ts';
import downloadCSV from '@global/utils/downloadCSV';
import showMessage from '@global/utils/showMessage';
import { useDebouncedValue } from '@mantine/hooks';
import { useNavigate, useParams } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import { FaGoogle } from 'react-icons/fa6';

interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

const SchoolStudent = () => {
  const navigate = useNavigate();

  // Get school ID from URL parameters
  const { schoolId } = useParams({ from: '' });
  console.log({ schoolId: schoolId });

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };
  const modalResetPassword = useModal();
  const modalArchive = useModal();

  const [students, setStudents] = useState<SchoolStudentList[]>([]);
  console.log({ students: students });
  const { pagination, setPagination } = usePagination();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedRecords, setSelectedRecords] = useState<SchoolStudentList[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);

  // เพิ่ม state สำหรับการค้นหา
  const [searchField, setSearchField] = useState<string>('first_name');
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText] = useDebouncedValue(searchText, 200);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const tabsList = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'draft', label: 'แบบร่าง' },
    { key: 'enabled', label: 'ใช้งาน' },
    { key: 'disabled', label: 'ไม่ใช้งาน' },
  ];

  const fetchStudents = async () => {
    setIsFetching(true);
    try {
      const query: any = {
        page: pagination.page,
        limit: pagination.limit,
        status: selectedTab === 'all' ? undefined : selectedTab,
      };

      // เพิ่มเงื่อนไขการค้นหา
      if (debouncedSearchText) {
        query[searchField] = debouncedSearchText;
      }

      const response = await API.schoolStudent.GetStudentsBySchoolId(schoolId, query);
      if (response.status_code === 200) {
        setStudents(response.data);
        setPagination((prev) => ({
          ...prev,
          total_count: response._pagination.total_count,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedTab, debouncedSearchText, pagination.page, pagination.limit]);

  const columns: DataTableColumn<SchoolStudentList>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    { accessor: 'id', title: 'uuid' },
    { accessor: 'student_id', title: 'รหัสนักเรียน / รหัสผู้ใช้งาน' },
    { accessor: 'title', title: 'คำนำหน้า' },
    { accessor: 'first_name', title: 'ชื่อ' },
    { accessor: 'last_name', title: 'สกุล' },
    // {
    //   accessor: 'email',
    //   title: 'อีเมล',
    //   render: (row) => row.email || '-',
    // },

    {
      accessor: 'have_password',
      title: 'รหัสผ่าน',
      render: (row) =>
        row.have_password ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600" />
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600" />
        ),
    },

    {
      accessor: 'googleLinked',
      title: <FaGoogle />,
      render: (row: any) =>
        row.googleLinked ? (
          <IconLink className="text-primary" />
        ) : (
          <IconLink className="text-neutral-300" />
        ),
    },
    {
      accessor: 'status',
      title: 'เปิดใช้งาน',
      render: (row) => {
        const statusText = row.status?.toLowerCase() || '';
        const badgeClass =
          statusText === 'enabled'
            ? 'badge-outline-success'
            : statusText === 'disabled'
              ? 'badge-outline-danger'
              : 'badge-outline-dark';
        return (
          <span className={`badge ${badgeClass} flex w-16 items-center justify-center`}>
            {statusLabels[statusText] || 'ไม่ระบุสถานะ'}
          </span>
        );
      },
    },
    {
      accessor: 'last_login',
      title: 'เข้าใช้งานล่าสุด',
      render: (row) =>
        row.last_login ? toDateTimeTH(new Date(row.last_login)).toString() : '-',
    },
    {
      accessor: 'view',
      title: 'ดู',
      render: (row) => (
        <button
          onClick={() => {
            navigate({
              to: `/admin/school/${schoolId}/student/${row.id}`,
            });
          }}
          className="flex items-center"
        >
          <IconSearch />
        </button>
      ),
    },
    {
      accessor: 'resetPassword',
      title: 'เปลี่ยนพิน',
      render: (row) => (
        <>
          <button
            className="flex w-full items-center justify-center"
            onClick={() => {
              setSelectedRowId(row.id);
              modalResetPassword.open();
            }}
          >
            <IconKey />
          </button>
          <CWModalResetPassword
            mode="pin"
            maxLength={4}
            open={modalResetPassword.isOpen && selectedRowId === row.id}
            onClose={() => {
              setSelectedRowId(null);
              modalResetPassword.close();
            }}
            onOk={(password) =>
              handleResetPassword(row.id, password, () => {
                setSelectedRowId(null);
                modalResetPassword.close();
              })
            }
          />
        </>
      ),
    },
    {
      accessor: 'archive',
      title: 'ปิดบัญชี',
      render: (row: any, index: number) => (
        <>
          {row.status === 'enabled' ? (
            <button
              className="flex w-full items-center justify-center"
              onClick={() => {
                setSelectedRowId(row.id);
                setSelectedRowIndex(index);
                modalArchive.open();
              }}
            >
              <IconArchive />
            </button>
          ) : (
            <button
              className="flex w-full items-center justify-center"
              onClick={() => {
                handleEnableAccount(row.id);
              }}
            >
              <IconCornerUpLeft />
            </button>
          )}
        </>
      ),
    },
  ];

  const rows = students;

  const statusLabels: Record<string, string> = {
    enabled: 'ใช้งาน',
    disabled: 'ไม่ใช้งาน',
    draft: 'แบบร่าง',
  };

  const onBulkEdit = async (
    records: SchoolStudentList[],
    newStatus: 'enabled' | 'disabled',
  ): Promise<void> => {
    if (records.length === 0) {
      console.error('No records selected for bulk edit');
      return Promise.reject(new Error('No records selected'));
    }

    const data = records.map((record) => ({
      id: record.id,
      status: newStatus,
    }));

    try {
      await API.schoolStudent.BulkEdit(data);
      await fetchStudents();
      setSelectedRecords([]);
      showMessage(`${newStatus === 'enabled' ? 'เปิด' : 'ปิด'}ใช้งานสำเร็จ`, 'success');
    } catch (error) {
      console.error('Failed to perform bulk edit:', error);
      showMessage(
        `ไม่สามารถ${newStatus === 'enabled' ? 'เปิด' : 'ปิด'}ใช้งานได้`,
        'error',
      );
      throw error;
    }
  };

  const onDownload = async (data: Record<string, any>): Promise<void> => {
    if (!data.dateFrom || !data.dateTo) {
      console.error('Missing required date range');
      showMessage('กรุณาระบุช่วงวันที่', 'error');
      return;
    }

    try {
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const microseconds = String(Math.floor(Math.random() * 999999)).padStart(6, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${microseconds}Z`;
      };

      const query = {
        start_date: formatDate(data.dateFrom),
        end_date: formatDate(data.dateTo),
      };

      const res = await API.schoolStudent.DownloadCSV(schoolId, query);
      downloadCSV(res, `${getDateTime()}_students`);
      showMessage('ดาวน์โหลดสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to start CSV download:', error);
      showMessage('ดาวน์โหลดล้มเหลว', 'error');
    }
  };

  const onUpload = async (file?: File): Promise<void> => {
    if (file) {
      API.schoolStudent
        .UploadCSV(schoolId, file)
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            fetchStudents();
            showMessage(res.message, 'success');
          } else {
            showMessage(res.message, 'error');
          }
        })
        .catch((err) => {
          console.error('Failed to upload CSV', err);
          showMessage('อัพโหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        });
    }
  };

  const handleResetPassword = async (
    userId: string,
    password: string,
    onClose: () => void,
  ) => {
    const pinRegex = /^[0-9]{4}$/;
    if (!password) {
      showMessage('PIN ต้องเป็นตัวเลข 4 หลักเท่านั้น', 'warning');
      return;
    }
    if (!pinRegex.test(password)) {
      showMessage('PIN ต้องเป็นตัวเลข 4 หลักเท่านั้น', 'warning');
      return;
    }

    try {
      await API.schoolStudent.UpdateUserPin({ user_id: userId, pin: password });
      showMessage('เปลี่ยน PIN สำเร็จ!', 'success');
      onClose();
    } catch (error: any) {
      const errorMessage = error.message || 'ไม่สามารถเปลี่ยน PIN ได้ กรุณาลองอีกครั้ง';
      showMessage(errorMessage, 'error');
    }
  };

  const handleDisableAccount = async (userId: string, index: number) => {
    try {
      await API.schoolStudent.DisableStudentStatus(userId);
      showMessage('ปิดบัญชีสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to disable account:', error);
      showMessage('ไม่สามารถปิดบัญชีได้', 'error');
    }
  };

  const handleEnableAccount = async (userId: string) => {
    try {
      await API.schoolStudent.EnableStudentStatus(userId);
      fetchStudents();
      showMessage('เปิดบัญชีสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to enable account:', error);
      showMessage('ไม่สามารถเปิดบัญชีได้', 'error');
    }
  };

  return (
    <div className="py-5 font-noto-sans-thai">
      <CWWhiteBox className="flex flex-col gap-5">
        <CWOHeaderTableButton
          bulkEditDisabled={selectedRecords.length === 0}
          bulkEditActions={[
            {
              label: (
                <div className="flex gap-2">
                  <IconArchive />
                  <div>จัดเก็บ</div>
                </div>
              ),
              onClick: () => onBulkEdit(selectedRecords, 'disabled'),
            },
            // {
            //   label: (
            //     <div className="flex gap-2">
            //       <IconCornerUpLeft />
            //       <div>เปิดใช้งาน</div>
            //     </div>
            //   ),
            //   onClick: () => onBulkEdit(selectedRecords, 'enabled'),
            // },
          ]}
          onBtnClick={() => {
            navigate({
              to: `/admin/school/${schoolId}/student/new`,
            });
          }}
          btnIcon={<IconPlus />}
          btnLabel="เพิ่มนักเรียน"
          onDownload={onDownload}
          onUpload={onUpload}
          inputSearchType="input-dropdown"
          searchDropdownOptions={[
            {
              label: 'ชื่อ',
              value: 'first_name',
            },
            {
              label: 'สกุล',
              value: 'last_name',
            },
            {
              label: 'รหัสนักเรียน',
              value: 'student_id',
            },
          ]}
          onSearchDropdownSelect={(value) => {
            setSearchField(String(value));
          }}
          onSearchChange={(evt) => {
            const text = evt.target.value;
            setSearchText(text);
          }}
        />

        <CWMTabs
          items={tabsList.map((t) => t.label)}
          currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
          onClick={(index) => {
            setSelectedTab(tabsList[index].key);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        />

        <DataTable
          className="table-hover whitespace-nowrap"
          records={rows}
          columns={columns}
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          highlightOnHover
          withTableBorder
          withColumnBorders
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          totalRecords={pagination.total_count}
          recordsPerPage={pagination.limit}
          page={pagination.page}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
          onPageChange={(page) => {
            setPagination((prev: Pagination) => ({
              ...prev,
              page,
            }));
          }}
          onRecordsPerPageChange={(limit: number) => {
            setPagination((prev: Pagination) => ({
              ...prev,
              limit,
              page: 1,
            }));
          }}
          recordsPerPageOptions={[10, 25, 50, 100]}
          fetching={isFetching}
        />
      </CWWhiteBox>

      <CWModalArchive
        open={modalArchive.isOpen}
        onClose={modalArchive.close}
        onOk={() => {
          if (selectedRowId) {
            handleDisableAccount(selectedRowId, selectedRowIndex).then(() =>
              fetchStudents(),
            );
          }
          modalArchive.close();
        }}
      />
    </div>
  );
};

export default SchoolStudent;
