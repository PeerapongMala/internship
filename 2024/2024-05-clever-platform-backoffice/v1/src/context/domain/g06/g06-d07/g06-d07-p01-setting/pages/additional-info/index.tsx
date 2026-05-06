import CWInputSearch from '@component/web/cw-input-search';
import CWWhiteBox from '@component/web/cw-white-box';
import CWAcademicYearModalButton from '@domain/g01/g01-d05/local/component/web/cw-academic-year-modal-button';
import API from '@domain/g06/g06-d07/local/api';
import {
  TStudentAdditionalInfo,
  TStudentFilter,
} from '@domain/g06/g06-d07/local/types/students';
import SelectAcademicYear from '@domain/g06/local/components/web/molecule/cw-m-select-academic-year';
import SelectClass from '@domain/g06/local/components/web/molecule/cw-m-select-class';
import SelectYear from '@domain/g06/local/components/web/molecule/cw-m-select-year';
import usePagination from '@global/hooks/usePagination';
import { TPagination } from '@global/types/api';
import showMessage from '@global/utils/showMessage';
import { getUserData } from '@global/utils/store/getUserData';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';

const AdditionalInfo = () => {
  const userData = getUserData();

  const [students, setStudents] = useState<TStudentAdditionalInfo[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [filter, setFilter] = useState<TStudentFilter>();
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [filter, pagination.page, pagination.limit]);

  const fetchData = async () => {
    try {
      setFetching(true);
      const result = await API.GradeSetting.GetListStudentAdditionalInfo({
        school_id: userData.school_id,
        ...filter,
        ...pagination,
      });

      setStudents(result.data.data);
      setPagination((prev) => ({
        ...prev,
        total_count: result.data._pagination.total_count,
      }));
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
      throw error;
    } finally {
      setFetching(false);
    }
  };

  const formatAddress = (user: TStudentAdditionalInfo): string => {
    const parts = [
      user.address_no,
      user.address_moo ? `หมู่ ${user.address_moo}` : null,
      user.address_sub_district ? `ต.${user.address_sub_district}` : null,
      user.address_district ? `อ.${user.address_district}` : null,
      user.address_province ? `จ.${user.address_province}` : null,
      user.address_postal_code,
    ].filter(
      (part): part is string => part !== null && part !== undefined && part.trim() !== '',
    ); // Filter out null, undefined, and empty strings

    return parts.length > 0 ? parts.join(' ') : '-';
  };

  const columnDefs = useMemo<DataTableColumn<TStudentAdditionalInfo>[]>(() => {
    const columns: DataTableColumn<TStudentAdditionalInfo>[] = [
      {
        accessor: 'index',
        title: 'ที่',
        render: (_, i) => i + 1 + (pagination.page - 1) * pagination.limit,
      },
      {
        accessor: 'student_id',
        title: 'รหัสนักเรียน',
      },
      {
        accessor: 'fullname',
        title: 'ชื่อ-สกุล',
        render: (user) => (
          <span> {`${user.thai_first_name} ${user.thai_last_name}`} </span>
        ),
      },
      {
        accessor: 'address',
        title: 'ที่อยู่',
        render: (user) => formatAddress(user),
      },
    ];

    return columns;
  }, [pagination.limit, pagination.page]);

  return (
    <CWWhiteBox className="flex flex-col gap-5">
      <CWInputSearch
        className="w-full max-w-56"
        onChange={(e) => setFilter((prev) => ({ ...prev, search_text: e.target.value }))}
      />

      <div className="flex gap-6">
        <CWAcademicYearModalButton
          schoolId={Number(userData.school_id)}
          type="button"
          className="min-w-48"
          placeholder="เลือกปีการศึกษา"
          academicYear={filter?.academic_year}
          onDataChange={(value) => {
            setFilter((prev) => ({
              ...prev,
              academic_year: value ? Number(value.name) : undefined,
              year: undefined,
              school_room: undefined,
            }));
          }}
          createMode={false}
          deleteMode={false}
        />
        <SelectYear
          value={filter?.year}
          onChange={(year) => setFilter((prev) => ({
            ...prev, year: year,
            school_room: undefined
          }))}
          disabled={!filter?.academic_year}
        />
        <SelectClass
          academicYear={filter?.academic_year}
          year={filter?.year}
          value={filter?.school_room}
          onChange={(school_room) =>
            setFilter((prev) => ({ ...prev, school_room: school_room }))
          }
          disabled={!filter?.year}
        />
      </div>

      {students.length > 0 ? (
        <DataTable
          records={students}
          columns={columnDefs}
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          fetching={fetching}
          loaderType="oval"
          loaderBackgroundBlur={4}
          page={pagination.page}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          recordsPerPage={pagination.limit}
          onRecordsPerPageChange={(limit) =>
            setPagination((prev) => ({
              ...prev,
              page:
                pagination.page * limit > pagination.total_count ? 1 : pagination.page,
              limit,
            }))
          }
          recordsPerPageOptions={pageSizeOptions}
          totalRecords={pagination.total_count}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
        />
      ) : (
        <DataTable
          records={students}
          columns={columnDefs}
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          fetching={fetching}
          loaderType="oval"
          loaderBackgroundBlur={4}
        />
      )}
    </CWWhiteBox>
  );
};

export default AdditionalInfo;
