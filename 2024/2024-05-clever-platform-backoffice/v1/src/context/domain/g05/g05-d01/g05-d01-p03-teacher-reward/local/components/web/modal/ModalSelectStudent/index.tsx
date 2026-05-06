import { useState, useEffect, useMemo, SetStateAction } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '@global/component/web/cw-modal/Modal';
import {
  Pagination,
  RewardTeacher,
  StatusReward,
  Student,
  academicYear,
  Year,
} from '@domain/g03/g03-d07/local/type';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import CWPagination from '@component/web/cw-pagination';

import CWSelectValue from '@component/web/cw-selectValue';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import API from '@domain/g03/g03-d07-v2/local/api';
import { FilterQueryParams } from '@domain/g03/g03-d07-v2/local/api/repository/reward';
import { StudyGroupFilter } from '@domain/g03/g03-d07-v2/local/api/types/reward';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import { getUserData } from '@global/utils/store/getUserData';
import { useMediaQuery } from '@mantine/hooks';
import usePagination from '@global/hooks/usePagination';

interface ModalSelectStudent extends ModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (
    selectedStudents: {
      user_id: string;
      student_id: string;
      first_name?: string;
      last_name?: string;
    }[],
  ) => void;
  initialSelected?: {
    user_id: string;
    student_id: string;
    first_name?: string;
    last_name?: string;
  }[];
}

const CWModalSelectStudent = ({
  open,
  onClose,
  children,
  onSelect,
  onOk,
  initialSelected = [],
  ...rest
}: ModalSelectStudent) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const userData = getUserData();
  const academic_year = userData?.academic_year;

  const [filterSearch, setFilterSearch] = useState<FilterQueryParams>({
    academic_year: academic_year ?? undefined,
    year: '',
    class_id: undefined,
    study_group_id: undefined,
  });

  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<Student[]>([]);

  const [academicYear, setAcademicYear] = useState<academicYear[]>([]);
  const [year, setYear] = useState<Year[]>([]);
  const [classroom, setClassroom] = useState<any[]>([]);
  const [studyGroup, setStudyGroup] = useState<StudyGroupFilter[]>([]);

  const [allSelected, setAllSelected] = useState(false);

  const [selectedStudents, setSelectedStudents] = useState<
    { user_id: string; student_id: string }[]
  >([]);

  const { pagination, setPagination } = usePagination({
    isModal: true,
  });
  const totalPages = Math.ceil(pagination.total_count / pagination.limit);

  useEffect(() => {
    if (initialSelected) {
      setSelectedStudents(initialSelected);
    }
  }, [initialSelected]);
  const handleCheckboxChange = (student?: Student) => {
    if (!student) {
      // This is the "select all" case
      if (allSelected) {
        setSelectedStudents([]);
      } else {
        setSelectedStudents(
          records.map((record) => ({
            user_id: record.user_id,
            student_id: record.student_id,
            first_name: record.first_name,
            last_name: record.last_name,
          })),
        );
      }
      setAllSelected(!allSelected);
    } else {
      // This is the individual checkbox case
      setSelectedStudents((prev) => {
        const existing = prev.find((s) => s.user_id === student.user_id);
        if (existing) {
          return prev.filter((s) => s.user_id !== student.user_id);
        } else {
          return [
            ...prev,
            {
              user_id: student.user_id,
              student_id: student.student_id,
              first_name: student.first_name,
              last_name: student.last_name,
            },
          ];
        }
      });
      // When manually selecting items, we should unset the "allSelected" state
      setAllSelected(false);
    }
  };
  useEffect(() => {
    if (records.length > 0 && selectedStudents.length === records.length) {
      const allRecordsSelected = records.every((record) =>
        selectedStudents.some((s) => s.user_id === record.user_id),
      );
      setAllSelected(allRecordsSelected);
    } else {
      setAllSelected(false);
    }
  }, [records, selectedStudents]);

  useEffect(() => {
    setFetching(true);
    API.reward
      .GetAcademicYear({ limit: -1 })
      .then((res) => {
        if (res.status_code === 200) {
          setAcademicYear(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  useEffect(() => {
    setFetching(true);
    API.reward
      .GetYear({
        limit: -1,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setYear(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  useEffect(() => {
    setFetching(true);
    API.reward
      .GetClass({
        limit: -1,
        year: filterSearch.year,
        academic_year: filterSearch.academic_year,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setClassroom(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [filterSearch]);

  useEffect(() => {
    setFetching(true);
    API.reward
      .GetStudyGroup({
        limit: -1,
        class_id: filterSearch.class_id,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setStudyGroup(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [filterSearch]);

  useEffect(() => {
    setFetching(true);
    API.reward
      .GetsStudent({
        ...filterSearch,
        limit: pagination.limit,
        page: pagination.page,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res._pagination.total_count || res.data.length,
          }));
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [filterSearch, pagination.limit, pagination.page]);

  const setCurrentPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const setPageSize = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size }));
  };

  return (
    <Modal
      className={isMobile ? 'w-[95vw] max-w-[100vw]' : 'w-[1000px]'}
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={'เลือกนักเรียน'}
      {...rest}
    >
      <div className="w-full">
        <div className={`w-full ${isMobile ? 'space-y-3' : 'flex flex-wrap gap-5'} mb-5`}>
          <CWSelectValue
            options={academicYear.map((s) => ({
              label: `ปี ${s.academic_year}`,
              value: s.academic_year,
            }))}
            value={filterSearch.academic_year ?? academic_year}
            onChange={(value: number) => {
              setFilterSearch((prev) => ({
                ...prev,
                academic_year: value,
                year: '',
                class_id: undefined,
                study_group_id: undefined,
              }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            title="ปีการศึกษา"
            className={isMobile ? 'w-full' : 'w-[calc(50%-10px)]'}
          />

          <CWSelectValue
            options={year.map((s) => ({ label: `ชั้น ${s.year}`, value: s.year }))}
            value={filterSearch.year}
            onChange={(value: string) => {
              setFilterSearch((prev) => ({
                ...prev,
                year: value,
                class_id: undefined,
                study_group_id: undefined,
              }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            title="ชั้นปี"
            className={
              isMobile
                ? 'w-full'
                : `w-[calc(50%-10px)] ${!filterSearch.academic_year ? 'cursor-not-allowed opacity-50' : ''}`
            }
            disabled={!filterSearch.academic_year}
          />

          <CWSelectValue
            options={classroom.map((s) => ({
              label: `ห้องที่ ${s.class_id}`,
              value: s.class_id,
            }))}
            value={filterSearch.class_id}
            onChange={(value: number) => {
              setFilterSearch((prev) => ({
                ...prev,
                class_id: value,
                study_group_id: undefined,
              }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            title="ห้อง"
            className={
              isMobile
                ? 'w-full'
                : `w-[calc(50%-10px)] ${!filterSearch.year ? 'cursor-not-allowed opacity-50' : ''}`
            }
            disabled={!filterSearch.year}
          />

          <CWSelectValue
            options={studyGroup.map((s) => ({
              label: `${s.study_group_name}`,
              value: s.study_group_id,
            }))}
            value={filterSearch.study_group_id}
            onChange={(value: number) => {
              setFilterSearch((prev) => ({
                ...prev,
                study_group_id: value,
              }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            title="กลุ่มเรียน"
            className={
              isMobile
                ? 'w-full'
                : `w-[calc(50%-10px)] ${!filterSearch.class_id ? 'cursor-not-allowed opacity-50' : ''}`
            }
            disabled={!filterSearch.class_id}
          />
        </div>
        <hr />
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-col">
            <div
              className={`overflow-y-auto ${isMobile ? 'h-[300px]' : 'h-[470px]'} mt-5`}
            >
              {fetching ? (
                <div className="flex h-56 w-full justify-center">
                  <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
                </div>
              ) : records.length === 0 ? (
                <div className="mt-10 flex items-center justify-center text-gray-500">
                  ไม่มีข้อมูล
                </div>
              ) : (
                <>
                  {/* Header row */}
                  <label
                    className={`mb-2 flex w-full items-center gap-2 bg-neutral-100 ${isMobile ? 'px-2' : 'px-5'}`}
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      onChange={() => handleCheckboxChange()}
                      checked={allSelected}
                    />
                    <div
                      className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4'} w-full p-[10px] px-4`}
                    >
                      <div>รหัสนักเรียน</div>
                      {!isMobile && <div>คำนำหน้า</div>}
                      <div>ชื่อจริง</div>
                      {!isMobile && <div>นามสกุล</div>}
                    </div>
                  </label>

                  {/* Student list */}
                  {records.map((item, index) => (
                    <label
                      key={index}
                      className={`inline-flex w-full items-center gap-2 ${isMobile ? 'px-2' : 'px-5'}`}
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={() => handleCheckboxChange(item)}
                        checked={selectedStudents.some((s) => s.user_id === item.user_id)}
                      />
                      <div
                        className={cn(
                          `grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4'} form-input h-10 w-full p-[10px] px-4 !font-normal hover:cursor-pointer hover:border-primary`,
                          selectedStudents.some((s) => s.user_id === item.user_id)
                            ? '!border-2 !border-primary'
                            : 'border-gray-300',
                        )}
                      >
                        <div>{item.student_id}</div>
                        {!isMobile && <div>{item.title}</div>}
                        {!isMobile && <div>{item.first_name}</div>}
                        {isMobile && (
                          <div className="text-nowrap">{`${item.first_name} ${item.last_name}`}</div>
                        )}
                        {!isMobile && <div>{item.last_name}</div>}
                      </div>
                    </label>
                  ))}
                </>
              )}
            </div>

            <div className="mt-5">
              {totalPages > 0 && (
                <CWPagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pagination.limit}
                  setPageSize={setPageSize}
                />
              )}
            </div>
          </div>

          <div
            className={`flex w-full ${isMobile ? 'flex-col-reverse' : 'justify-between'} mt-5 gap-5`}
          >
            <button
              onClick={onClose}
              className={`btn btn-outline-primary flex gap-2 ${isMobile ? 'w-full' : 'w-[150px]'}`}
            >
              ย้อนกลับ
            </button>
            <button
              onClick={() => {
                onSelect(selectedStudents);
                onClose();
              }}
              className={`btn btn-primary ${isMobile ? 'w-full' : 'w-[150px]'}`}
              disabled={selectedStudents.length === 0}
            >
              {`เลือก (${selectedStudents.length})`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalSelectStudent;
