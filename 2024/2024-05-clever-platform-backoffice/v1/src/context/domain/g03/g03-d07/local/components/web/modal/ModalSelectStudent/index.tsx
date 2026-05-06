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
import API from '@domain/g03/g03-d07/local/api';
import { FilterQueryParams } from '@domain/g03/g03-d07/local/api/repository';
import CWSelectValue from '@component/web/cw-selectValue';
import usePagination from '@global/hooks/usePagination';

interface ModalSelectStudent extends ModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selectedStudents: { user_id: string; student_id: string }[]) => void;
}

const CWModalSelectStudent = ({
  open,
  onClose,
  children,
  onSelect,
  onOk,
  ...rest
}: ModalSelectStudent) => {
  const [filterSearch, setFilterSearch] = useState<FilterQueryParams>({
    academic_year: undefined,
    year: '',
    class_name: undefined,
  });

  const [fetching, setFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<Student[]>([]);

  const [academicYear, setAcademicYear] = useState<academicYear[]>([]);
  const [year, setYear] = useState<Year[]>([]);
  const [classroom, setClassroom] = useState<any[]>([]);

  const [selectedStudents, setSelectedStudents] = useState<
    { user_id: string; student_id: string }[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { pagination, setPagination } = usePagination({ isModal: true });

  const totalPages = Math.ceil(pagination.total_count / pagination.limit);

  const handleCheckboxChange = (student: Student) => {
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
          },
        ];
      }
    });
  };

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
      .GetYear({ limit: -1 })
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
      .GetClass({ limit: -1 })
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
  }, []);

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
      className="w-[1000px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={'เลือกนักเรียน'}
      {...rest}
    >
      <div className="w-full">
        <div className="mb-5 flex w-full gap-5">
          <CWSelectValue
            options={academicYear.map((s) => ({
              label: `ปี ${s.academic_year}`,
              value: s.academic_year,
            }))}
            value={filterSearch.academic_year}
            onChange={(value: number) => {
              setFilterSearch((prev) => ({
                ...prev,
                academic_year: value,
                year: '',
                class_name: undefined,
              }));
            }}
            title="ปีการศึกษา"
            className="w-[50%]"
          />

          <CWSelectValue
            options={year.map((s) => ({ label: `ชั้น ${s.year}`, value: s.year }))}
            value={filterSearch.year}
            onChange={(value: string) => {
              setFilterSearch((prev) => ({
                ...prev,
                year: value,
                class_name: undefined,
              }));
            }}
            title="ชั้นปี"
            className={`w-[50%] ${!filterSearch.academic_year ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!filterSearch.academic_year}
          />

          <CWSelectValue
            options={classroom.map((s) => ({
              label: `ห้องที่ ${s.class_name}`,
              value: s.class_name,
            }))}
            value={filterSearch.class_name}
            onChange={(value: number) => {
              setFilterSearch((prev) => ({
                ...prev,
                class_name: value,
              }));
            }}
            title="ห้อง"
            className={`w-[50%] ${!filterSearch.year ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!filterSearch.year}
          />
        </div>
        <hr />
        <div className="flex w-full flex-col">
          <div className="mt-5 h-[470px] overflow-y-auto">
            {fetching ? (
              <div className="flex h-56 w-full justify-center">
                <span className="m-auto mb-10 inline-block h-12 w-12 animate-spin rounded-full border-4 border-transparent border-l-primary align-middle"></span>
              </div>
            ) : records.length === 0 ? (
              <div className="mt-10 flex items-center justify-center text-gray-500">
                ไม่มีข้อมูล
              </div>
            ) : (
              records.map((item, index) => (
                <label key={index} className="inline-flex w-full items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    onChange={() => handleCheckboxChange(item)}
                    checked={selectedStudents.some((s) => s.user_id === item.user_id)}
                  />
                  <div
                    className={cn(
                      'form-input grid h-10 w-full grid-cols-4 p-[10px] px-4 !font-normal',
                      selectedStudents.some((s) => s.user_id === item.user_id)
                        ? '!border-2 !border-primary'
                        : 'border-gray-300',
                    )}
                  >
                    <div>ID: {item.student_id}</div>
                    <div>{item.title}</div>
                    <div>{item.first_name}</div>
                    <div>{item.last_name}</div>
                  </div>
                </label>
              ))
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

        <div className="mt-5 flex w-full justify-between gap-5">
          <button
            onClick={onClose}
            className="btn btn-outline-primary flex w-[150px] gap-2"
          >
            ย้อนกลับ
          </button>
          <button
            onClick={() => {
              onSelect(selectedStudents);
              onClose();
            }}
            className="btn btn-primary w-[150px]"
            disabled={selectedStudents.length === 0}
          >
            เลือก
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalSelectStudent;
