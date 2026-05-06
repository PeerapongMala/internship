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
import { ModalStudyGroup } from '@domain/g03/g03-d07-v2/local/type';
import { getUserData } from '@global/utils/store/getUserData';
import usePagination from '@global/hooks/usePagination';

interface ModalSelectStudyGroup extends ModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selectedStudents: ModalStudyGroup[]) => void;
  initialSelected?: ModalStudyGroup[];
}

const CWModalSelectStudyGroup = ({
  open,
  onClose,
  children,
  onSelect,
  onOk,
  initialSelected = [],
  ...rest
}: ModalSelectStudyGroup) => {
  const userData = getUserData();
  const academic_year = userData?.academic_year;
  const [filterSearch, setFilterSearch] = useState<FilterQueryParams>({
    academic_year: academic_year ?? undefined,
    year: '',
    class_id: undefined,
    study_group_id: undefined,
  });

  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<ModalStudyGroup[]>([]);

  const [academicYear, setAcademicYear] = useState<academicYear[]>([]);
  const [year, setYear] = useState<Year[]>([]);
  const [classroom, setClassroom] = useState<any[]>([]);
  const [studyGroup, setStudyGroup] = useState<StudyGroupFilter[]>([]);

  const [allSelected, setAllSelected] = useState(false);

  const [selectedStudyGroup, setSelectedStudyGroup] = useState<ModalStudyGroup[]>([]);

  const { pagination, setPagination } = usePagination({ isModal: true });

  const totalPages = Math.ceil(pagination.total_count / pagination.limit);

  useEffect(() => {
    if (initialSelected) {
      setSelectedStudyGroup(initialSelected);
    }
  }, [initialSelected]);

  const handleCheckboxChange = (StudyGroup?: ModalStudyGroup) => {
    if (!StudyGroup) {
      // This is the "select all" case
      if (allSelected) {
        setSelectedStudyGroup([]);
      } else {
        setSelectedStudyGroup(
          records.map((record) => ({
            study_group_id: record.study_group_id,
            study_group_name: record.study_group_name,
            class_year: record.class_year,
            class_name: record.class_name,
            student_count: record.student_count,
          })),
        );
      }
      setAllSelected(!allSelected);
    } else {
      // This is the individual checkbox case
      setSelectedStudyGroup((prev) => {
        const existing = prev.find((s) => s.study_group_id === StudyGroup.study_group_id);
        if (existing) {
          return prev.filter((s) => s.study_group_id !== StudyGroup.study_group_id);
        } else {
          return [
            ...prev,
            {
              study_group_id: StudyGroup.study_group_id,
              study_group_name: StudyGroup.study_group_name,
              class_year: StudyGroup.class_year,
              class_name: StudyGroup.class_name,
              student_count: StudyGroup.student_count,
            },
          ];
        }
      });
      // When manually selecting items, we should unset the "allSelected" state
      setAllSelected(false);
    }
  };
  useEffect(() => {
    if (records.length > 0 && selectedStudyGroup.length === records.length) {
      const allRecordsSelected = records.every((record) =>
        selectedStudyGroup.some((s) => s.study_group_id === record.study_group_id),
      );
      setAllSelected(allRecordsSelected);
    } else {
      setAllSelected(false);
    }
  }, [records, selectedStudyGroup]);

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
      .GetsStudyGroupModal({
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
      title={'เลือกกลุ่มเรียน'}
      {...rest}
    >
      <div className="w-full">
        <div className="mb-5 flex w-full gap-5">
          <CWSelectValue
            placeholder="เลือกปีการศึกษา"
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
            className="w-[50%]"
          />

          <CWSelectValue
            placeholder="เลือกชั้นปี"
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
            className={`w-[50%] ${!filterSearch.academic_year ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!filterSearch.academic_year}
          />

          <CWSelectValue
            placeholder="เลือกห้อง"
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
            className={`w-[50%] ${!filterSearch.year ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!filterSearch.year}
          />
        </div>
        <hr />
        <div className="flex w-full flex-col">
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
                <>
                  {/* Add the select all header row */}
                  <label className="mb-2 flex w-full items-center gap-2 bg-neutral-100 px-5">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      onChange={() => handleCheckboxChange()}
                      checked={allSelected}
                    />
                    <div className="grid w-full grid-cols-4 p-[10px] px-4">
                      <div>รหัสกลุ่มเรียน</div>
                      <div>ชื่อกลุ่มเรียน</div>
                      <div>ชั้นปี</div>
                      <div>ห้อง</div>
                    </div>
                  </label>

                  {/* Study list */}
                  {records.map((item, index) => (
                    <label
                      key={index}
                      className="inline-flex w-full items-center gap-2 px-5"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        onChange={() => handleCheckboxChange(item)}
                        checked={selectedStudyGroup.some(
                          (s) => s.study_group_id === item.study_group_id,
                        )}
                      />
                      <div
                        className={cn(
                          'form-input grid h-10 w-full grid-cols-4 p-[10px] px-4 !font-normal hover:cursor-pointer hover:border-primary',
                          selectedStudyGroup.some(
                            (s) => s.study_group_id === item.study_group_id,
                          )
                            ? '!border-2 !border-primary'
                            : 'border-gray-300',
                        )}
                      >
                        <div>{item.study_group_id}</div>
                        <div>{item.study_group_name}</div>
                        <div>{item.class_year}</div>
                        <div>{item.class_name}</div>
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

          <div className="mt-5 flex w-full justify-between gap-5">
            <button
              onClick={onClose}
              className="btn btn-outline-primary flex w-[150px] gap-2"
            >
              ย้อนกลับ
            </button>
            <button
              onClick={() => {
                onSelect(selectedStudyGroup);
                onClose();
              }}
              className="btn btn-primary w-[150px]"
              disabled={selectedStudyGroup.length === 0}
            >
              {`เลือก (${selectedStudyGroup.length})`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalSelectStudyGroup;
