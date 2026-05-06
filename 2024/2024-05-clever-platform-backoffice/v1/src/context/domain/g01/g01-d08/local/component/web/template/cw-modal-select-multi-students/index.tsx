import CWSelect from '@component/web/cw-select';
import CWButton from '@component/web/cw-button'; // ปุ่ม
import CWPagination from '@component/web/cw-pagination'; // สำหรับ Pagination
import IconSearch from '@core/design-system/library/component/icon/IconSearch.tsx'; // นำเข้า Modal component ที่ใช้งาน
import React, { useEffect, useState } from 'react';
import API from '@domain/g01/g01-d08/local/api';
import {
  ParamsStudentList,
  DropdownSchoolListResponse,
  DropdownClassListResponse,
  FamilyMemberResponse,
} from '@domain/g01/g01-d08/local/api/group/admin-family/type';
import showMessage from '@global/utils/showMessage';
import { Modal } from '@context/global/component/web/cw-modal';
import usePagination from '@global/hooks/usePagination';

interface WithUserId {
  user_id: string;
}

interface CWModalSelectMultiStudentsProps<T extends WithUserId> {
  open: boolean;
  onClose: () => void;
  renderRow: (item: T) => React.ReactNode; // ฟังก์ชันในการ render ข้อมูลในแต่ละแถว
  title: string; // ชื่อหัวข้อ modal
  familyId?: string;
  setRefetch?: (refetch: boolean) => void;
}

const CWModalSelectMultiStudents = <T extends WithUserId>({
  open,
  onClose,
  renderRow,
  title,
  familyId,
  setRefetch,
}: CWModalSelectMultiStudentsProps<T>) => {
  const [filters, setFilters] = useState<ParamsStudentList | undefined>({});
  const [optionsSchool, setOptionsSchool] = useState<{ value: number; label: string }[]>(
    [],
  );
  const [optionsAcademicYear, setOptionsAcademicYear] = useState<
    { value: number; label: string }[]
  >([]);
  const [optionsYear, setOptionsYear] = useState<{ value: number; label: string }[]>([]);
  const [optionsClass, setOptionsClass] = useState<{ value: number; label: string }[]>(
    [],
  );

  const { pagination, setPagination } = usePagination({ isModal: true });

  const [studentList, setStudentList] = useState<FamilyMemberResponse[]>([]);
  const [internalSelectedItems, setInternalSelectedItems] = useState<
    FamilyMemberResponse[]
  >([]);

  const fetchStudentList = () => {
    API.adminFamily
      .GetStudentList({
        school_id: filters?.school_id,
        academic_year: filters?.academic_year,
        year: filters?.year,
        class_name: filters?.class_name,
        search: filters?.search,
      })
      .then((res) => {
        if (res.status_code === 200 && res.data) {
          setStudentList(res.data);
          setPagination({
            page: res._pagination.page,
            limit: res._pagination.limit,
            total_count: res._pagination.total_count,
          });
        }
      });
  };

  useEffect(() => {
    API.adminFamily.GetDropdownSchoolList().then((res) => {
      if (res.status_code === 200) {
        const options = res.data.map((item: DropdownSchoolListResponse) => ({
          value: item.school_id,
          label: item.school_name,
        }));
        setOptionsSchool(options);
      }
    });
    API.adminFamily.GetDropdownAcademicYearList().then((res) => {
      if (res.status_code === 200) {
        const options = res.data.map((item: number[]) => ({
          value: Number(item),
          label: item.toString(),
        }));
        setOptionsAcademicYear(options);
      }
    });
  }, []);

  useEffect(() => {
    if (open) {
      fetchStudentList();
    }
  }, [open, filters]);

  useEffect(() => {
    if (filters?.school_id && filters?.academic_year) {
      API.adminFamily
        .GetDropdownYearList({
          school_id: filters.school_id,
          academic_year: filters.academic_year,
        })
        .then((res) => {
          if (res.status_code === 200) {
            const options = res.data.map((item: string[], index) => ({
              value: index,
              label: item.toString(),
            }));
            setOptionsYear(options);
          }
        });
    }
  }, [filters?.school_id, filters?.academic_year]);

  useEffect(() => {
    if (filters?.school_id && filters?.academic_year && filters?.year) {
      API.adminFamily
        .GetDropdownClassList({
          school_id: filters.school_id,
          academic_year: filters.academic_year,
          year: filters.year,
        })
        .then((res) => {
          if (res.status_code === 200) {
            const options = res.data.map((item: DropdownClassListResponse) => ({
              value: item.class_id,
              label: item.class_name,
            }));
            setOptionsClass(options);
          }
        });
    }
  }, [filters?.school_id, filters?.academic_year, filters?.year]);

  const handleSelectItem = (item: FamilyMemberResponse) => {
    const isSelected = internalSelectedItems.some(
      (selectedItem) => JSON.stringify(selectedItem) === JSON.stringify(item),
    );
    if (isSelected) {
      setInternalSelectedItems(
        internalSelectedItems.filter(
          (selectedItem) => JSON.stringify(selectedItem) !== JSON.stringify(item),
        ),
      );
    } else {
      setInternalSelectedItems([...internalSelectedItems, item]);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleItemsPerPageChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleConfirmSelection = () => {
    onClose();
    API.adminFamily
      .AddFamilyMember(
        internalSelectedItems.map((item) => item.user_id as string),
        familyId || '',
      )
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกข้อมูลสำเร็จ', 'success');
          setStudentList([]);
          setPagination({ page: 1, limit: 10, total_count: 0 });
          setFilters({});
          setInternalSelectedItems([]);
          setRefetch?.(true);
        } else {
          showMessage('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      })
      .catch(() => {
        showMessage('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setFilters({});
        setStudentList([]);
        setPagination({ page: 1, limit: 10, total_count: 0 });
        setInternalSelectedItems([]);
        setRefetch?.(false);
        onClose?.();
      }}
      title={title}
      className="h-auto w-3/4"
    >
      <div className="flex w-full flex-col gap-4">
        {/* ช่องค้นหาพร้อมแว่นขยาย */}
        <div className="relative w-full">
          <input
            className={`form-input w-full`}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="ค้นหา"
            value={filters?.search || ''}
          />
          <button
            type="button"
            className="!absolute right-0 top-0.5 mr-2 h-full"
            onClick={() => { }}
          >
            <IconSearch className="!h-5 !w-5" />
          </button>
        </div>

        {/* แสดง dropdown ถ้าผู้ใช้กำหนด options */}
        <div className="grid grid-cols-4 gap-4">
          <CWSelect
            options={optionsSchool}
            onChange={(e) => {
              console.log('e.target.value', e.target.value);
              if (e.currentTarget.value === '') {
                setFilters({
                  ...filters,
                  school_id: undefined,
                  year: undefined,
                  year_index: undefined,
                  class_name: undefined,
                });
              } else {
                setFilters({ ...filters, school_id: Number(e.currentTarget.value) });
              }
            }}
            title="โรงเรียน"
            value={filters?.school_id}
          />
          <CWSelect
            options={optionsAcademicYear}
            onChange={(e) => {
              if (e.currentTarget.value === '') {
                setFilters({
                  ...filters,
                  academic_year: undefined,
                  year: undefined,
                  year_index: undefined,
                  class_name: undefined,
                });
              } else {
                setFilters({ ...filters, academic_year: Number(e.currentTarget.value) });
              }
            }}
            title="ปีการศึกษา"
            value={filters?.academic_year}
          />
          <CWSelect
            options={optionsYear}
            disabled={!filters?.academic_year || !filters?.school_id}
            onChange={(e) => {
              if (e.currentTarget.value === '') {
                setFilters({
                  ...filters,
                  year: undefined,
                  year_index: undefined,
                  class_name: undefined,
                });
              } else {
                const findYear = optionsYear.find(
                  (item) => item.value === Number(e.currentTarget.value),
                );
                if (findYear) {
                  setFilters({
                    ...filters,
                    year: findYear.label,
                    year_index: Number(e.currentTarget.value),
                  });
                }
              }
            }}
            title="ชั้นปี"
            value={filters?.year_index}
          />
          <CWSelect
            options={optionsClass}
            disabled={!filters?.academic_year || !filters?.school_id || !filters?.year}
            onChange={(e) => {
              if (e.currentTarget.value === '') {
                setFilters({ ...filters, class_name: undefined });
              } else {
                setFilters({ ...filters, class_name: Number(e.currentTarget.value) });
              }
            }}
            title="ห้อง"
            value={filters?.class_name}
          />
        </div>

        <div className="border-b-2" />
        {/* แสดงข้อมูลที่กรอง */}
        <div className="max-h-[500px] overflow-y-auto">
          {studentList?.length > 0 ? (
            <div className="p-2">
              {studentList.map((item: any, index: number) => (
                <div className="flex items-center p-2" key={index}>
                  <input
                    type="checkbox"
                    checked={internalSelectedItems.some(
                      (selectedItem) =>
                        JSON.stringify(selectedItem) === JSON.stringify(item),
                    )} // เชื่อมโยงสถานะการเลือก
                    onChange={() => handleSelectItem(item as FamilyMemberResponse)} // เมื่อเปลี่ยนสถานะ checkbox
                    className="form-checkbox mr-3 flex items-center justify-center"
                  />
                  <div
                    className={`flex h-auto w-full flex-row items-center justify-between rounded-md border px-4 py-2 ${internalSelectedItems.some(
                      (selectedItem) =>
                        JSON.stringify(selectedItem) === JSON.stringify(item),
                    )
                        ? 'border-primary' // เพิ่ม border-primary เมื่อเลือก
                        : ''
                      }`}
                  >
                    {renderRow(item as T)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg bg-gray-50">
              <span className="text-lg font-medium text-gray-600">ไม่พบข้อมูล</span>
              <span className="text-sm text-gray-400">
                โปรดตรวจสอบข้อมูลที่คุณเลือกใหม่อีกครั้ง
              </span>
            </div>
          )}
        </div>

        {studentList?.length > 0 && (
          <CWPagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total_count / pagination.limit)}
            onPageChange={handlePageChange}
            pageSize={pagination.limit}
            setPageSize={handleItemsPerPageChange}
          />
        )}

        {/* ปุ่มเลือกและยกเลิก */}
        <div className="flex w-full justify-between">
          <CWButton
            outline
            title="ยกเลิก"
            onClick={() => {
              setFilters({});
              setStudentList([]);
              setPagination({ page: 1, limit: 10, total_count: 0 });
              setInternalSelectedItems([]);
              setRefetch?.(false);
              onClose?.();
            }}
            className="w-[150px]"
          />
          <CWButton
            title={`เลือก (${internalSelectedItems.length})`}
            onClick={handleConfirmSelection}
            disabled={internalSelectedItems.length === 0}
            className="w-[150px]"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CWModalSelectMultiStudents;
