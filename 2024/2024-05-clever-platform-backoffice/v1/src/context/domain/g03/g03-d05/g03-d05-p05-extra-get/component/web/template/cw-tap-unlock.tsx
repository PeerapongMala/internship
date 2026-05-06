import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import {
  GroupUnlock,
  StudentUnlock,
  UnlockedGroup,
  Pagination,
} from '@domain/g03/g03-d05/local/type';
import showMessage from '@global/utils/showMessage';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import CWModalSelectGroup from './cw-modal-selectgroup';
import CWModalSelectStudent from './cw-modal-selectstudent';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import { toDateTimeTH } from '@global/utils/date';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import LessonRestAPI from '../../../../local/api/group/lesson/restapi';
import ModalAction from './wc-o-modal-action';
import ExtraRestAPI from '@domain/g03/g03-d05/local/api/group/extra/restapi';
import CWModalCustom from '@component/web/cw-modal/cw-modal-custom';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

interface CWUnlockProps {
  unlockedGroups: UnlockedGroup[];
  setUnlockedGroups: (groups: UnlockedGroup[]) => void;
  allGroups: GroupUnlock[];
  fetchGroups: (
    page: number,
    limit: number,
    searchField: string,
    searchValue: string,
  ) => Promise<any>;
}

export const CWUnlock = ({
  unlockedGroups,
  setUnlockedGroups,
  allGroups,
  fetchGroups,
}: CWUnlockProps) => {
  const modalSelectGroup = useModal();
  const modalSelectStudent = useModal();
  const modalDetetStudy = useModal();
  const modalDetetStudent = useModal();
  const [records, setRecords] = useState<UnlockedGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const params = useParams({
    // from: '/teacher/lesson/$classId/subject/$subjectId/extra/$extraId',
    strict: false,
  });

  const classId = params.classId;
  const lessonId = params.extraId;
  const [studentRecords, setStudentRecords] = useState<StudentUnlock[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);

  const { pagination: studentPagination, setPagination: setStudentPagination } =
    usePagination();

  const [selectedRecordStudent, setSelectedRecordStudent] = useState<StudentUnlock[]>([]);
  const [selectedRecordStudentNoUnlock, setSelectedRecordStudentNoUnlock] = useState<
    StudentUnlock[]
  >([]);
  const [selectedRecords, setSelectedRecords] = useState<UnlockedGroup[]>([]);
  const [selectedGroupToDelete, setSelectedGroupToDelete] =
    useState<UnlockedGroup | null>(null);
  const [selectedStudentToDelete, setSelectedStudentToDelete] =
    useState<StudentUnlock | null>(null);

  const handleSelectionChange = (selectedRows: SetStateAction<UnlockedGroup[]>) => {
    setSelectedRecords(selectedRows);
  };

  const fetchUnlockedGroups = async () => {
    try {
      setLoading(true);
      const response = await ExtraRestAPI.GetsUnlockStudyGroupA27(classId, lessonId, {
        page: pagination.page,
        limit: pagination.limit,
      });
      setRecords(response.data);
      setPagination((prev) => ({
        ...prev,
        total_count: response._pagination.total_count,
      }));
    } catch (error) {
      console.error('Failed to fetch unlocked groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setStudentLoading(true);
      const response = await ExtraRestAPI.GetsUnlockStudentA30(classId, lessonId, {
        page: studentPagination.page,
        limit: studentPagination.limit,
      });
      setStudentRecords(response.data);
      setStudentPagination((prev) => ({
        ...prev,
        total_count: response._pagination.total_count,
      }));
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setStudentLoading(false);
    }
  };

  useEffect(() => {
    fetchUnlockedGroups();
    fetchStudents();
  }, [
    lessonId,
    pagination.page,
    pagination.limit,
    studentPagination.page,
    studentPagination.limit,
  ]);

  const columnDefsGroupUnlock = useMemo<DataTableColumn<UnlockedGroup>[]>(() => {
    const finalDefs: DataTableColumn<UnlockedGroup>[] = [
      {
        accessor: 'index',
        title: '#',
        width: 80,
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'study_group_name', title: 'ชื่อกลุ่มนักเรียน', width: 300 },
      { accessor: 'year', title: 'ชั้นปี', width: 150 },
      { accessor: 'class', title: 'ห้อง', width: 150 },
      { accessor: 'student_count', title: 'นักเรียน(คน)', width: 150 },
      {
        accessor: 'delete',
        title: 'เอาออก',
        render: (record) => (
          <button
            onClick={() => {
              setSelectedGroupToDelete(record);
              modalDetetStudy.open();
            }}
          >
            <IconClose />
          </button>
        ),
      },
    ];
    return finalDefs;
  }, []);

  const totalPages = Math.ceil(pagination.total_count / pagination.limit);

  const setCurrentPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const setPageSize = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size }));
  };

  const columnDefsStudentUnlock = useMemo<DataTableColumn<StudentUnlock>[]>(() => {
    const finalDefs: DataTableColumn<StudentUnlock>[] = [
      {
        accessor: 'index',
        title: '#',
        width: 80,
        render: (record, index) => {
          return index + 1;
        },
      },
      // { accessor: 'id', title: 'รหัสบัญชี' },
      { accessor: 'title', title: 'คำนำหน้า', width: 150 },
      { accessor: 'first_name', title: 'ชื่อ', width: 200 },
      { accessor: 'last_name', title: 'นามสกุล', width: 150 },
      {
        accessor: 'last_login',
        title: 'ใช้งานล่าสุด',
        width: 150,
        render: (row: StudentUnlock) => {
          return row.last_login
            ? new Date(row.last_login).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })
            : '-';
        },
      },
      {
        accessor: 'delete',
        title: 'เอาออก',
        render: (record) => (
          <button
            onClick={() => {
              setSelectedStudentToDelete(record);
              modalDetetStudent.open();
            }}
          >
            <IconClose />
          </button>
        ),
      },
    ];
    return finalDefs;
  }, []);

  const handleSelectionChangeStudentUnlock = (selectedRows: StudentUnlock[]) => {
    setSelectedRecordStudent(selectedRows);
  };

  const handleSuccess = () => {
    fetchUnlockedGroups();
  };

  const handleBulkDeleteUnlockedGroups = async () => {
    try {
      await ExtraRestAPI.DeleteStudyGroupA28(classId, lessonId, {
        study_group_ids: selectedRecords.map((record) => Number(record.id)),
      });

      await fetchUnlockedGroups();
      setSelectedRecords([]);
      showMessage('ลบกลุ่มเรียนสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to delete students:', error);
      showMessage('ไม่สามารถลบกลุ่มเรียนได้', 'error');
    }
  };

  const handleDeleteUnlockedGroups = async () => {
    try {
      if (!selectedGroupToDelete) return;

      await ExtraRestAPI.DeleteStudyGroupA28(classId, lessonId, {
        study_group_ids: [Number(selectedGroupToDelete.id)],
      });
      modalDetetStudy.close();
      await fetchUnlockedGroups();
      setSelectedRecords([]);
      showMessage('ลบกลุ่มเรียนสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to delete students:', error);
      showMessage('ไม่สามารถลบกลุ่มเรียนได้', 'error');
    }
  };

  const handleBulkDeleteStudents = async () => {
    try {
      const studentIds = selectedRecordStudent.map((student) => student.id);

      // TODO: classId  ตอนนี้ยังไม่ถูกต้อง
      await LessonRestAPI.DeleteUnlockedStudents(classId, Number(lessonId), studentIds);

      await fetchStudents();
      setSelectedRecordStudent([]);
      showMessage('ลบนักเรียนสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to delete students:', error);
      showMessage('ไม่สามารถลบนักเรียนได้', 'error');
    }
  };
  const handleDeleteUnlockedStudent = async () => {
    try {
      if (!selectedStudentToDelete) return;
      console.log({ selectedStudentToDelete: selectedStudentToDelete });

      await ExtraRestAPI.DeleteStudentA31(classId, lessonId, {
        student_ids: [selectedStudentToDelete.id],
      });
      modalDetetStudent.close();
      await fetchStudents();
      setSelectedRecords([]);
      showMessage('ลบกลุ่มเรียนสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to delete students:', error);
      showMessage('ไม่สามารถลบกลุ่มเรียนได้', 'error');
    }
  };

  // const handleDeleteStudents = async (studentIds: string) => {
  //   try {
  //     // TODO: classId  ตอนนี้ยังไม่ถูกต้อง
  //     await LessonRestAPI.DeleteUnlockedStudents(classId, Number(levelId), [studentIds]);

  //     await fetchStudents();
  //     setSelectedRecordStudent([]);
  //     showMessage('ลบนักเรียนสำเร็จ', 'success');
  //   } catch (error) {
  //     console.error('Failed to delete students:', error);
  //     showMessage('ไม่สามารถลบนักเรียนได้', 'error');
  //   }
  // };

  const fetchStudentsNoUnlock = async (
    page: number,
    limit: number,
    searchField: string,
    searchValue: string,
  ) => {
    try {
      const response = await LessonRestAPI.GetStudentsNoUnlock(
        classId,
        page,
        limit,
        searchField,
        searchValue,
      );
      setSelectedRecordStudentNoUnlock(response.data);
      return response;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      return null;
    } finally {
    }
  };

  return (
    <div className="w-full">
      <CWWhiteBox>
        {/* กลุ่มเรียนที่ปลดล็อคด่าน */}
        <div className="w-full">
          <div className="flex gap-5">
            <div>
              <CWButton
                icon={<IconPlus />}
                title="เพิ่มกลุ่มเรียน"
                onClick={modalSelectGroup.open}
              />
              <CWModalSelectGroup
                open={modalSelectGroup.isOpen}
                onClose={modalSelectGroup.close}
                onSuccess={handleSuccess}
                allGroups={records}
                fetchGroups={fetchGroups}
              />
            </div>
          </div>

          <div className="mt-5 w-full">
            {/* <h1 className="mb-3 text-xl font-bold">กลุ่มเรียนที่ปลดล็อค</h1> */}
            <DataTable
              className="table-hover whitespace-nowrap"
              columns={columnDefsGroupUnlock}
              records={records}
              minHeight={200}
              // TODO bulkedit
              // selectedRecords={selectedRecords}
              // onSelectedRecordsChange={handleSelectionChange}
              loaderType="oval"
              loaderBackgroundBlur={4}
              fetching={loading}
              totalRecords={pagination.total_count}
              recordsPerPage={pagination.limit}
              page={pagination.page}
              onPageChange={(page) => {
                setPagination((prev) => ({
                  ...prev,
                  page,
                }));
              }}
              onRecordsPerPageChange={(limit) => {
                setPagination((prev) => ({
                  ...prev,
                  limit,
                  page: 1,
                }));
              }}
              recordsPerPageOptions={[10, 25, 50, 100]}
              paginationText={({ from, to, totalRecords }) =>
                `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
              }
            />
          </div>
        </div>
        {/* นักเรียนที่ปลดล็อคด่าน */}
        <div className="w-full">
          <div className="flex gap-5">
            <div>
              <CWButton
                icon={<IconPlus />}
                title="เพิ่มนักเรียน"
                onClick={modalSelectStudent.open}
              />
              <CWModalSelectStudent
                open={modalSelectStudent.isOpen}
                onClose={modalSelectStudent.close}
                onSuccess={fetchStudents}
                allGroups={studentRecords}
                fetchGroups={(page, limit, searchField, searchValue) =>
                  LessonRestAPI.GetStudentsNoUnlock(
                    classId,
                    page,
                    limit,
                    searchField,
                    searchValue,
                  )
                }
              />
            </div>
          </div>

          <div className="mt-5 w-full">
            {/* <h1 className="mb-3 text-xl font-bold">นักเรียนที่ปลดล็อค</h1> */}
            <DataTable
              className="table-hover whitespace-nowrap"
              columns={columnDefsStudentUnlock}
              records={studentRecords}
              minHeight={200}
              // TODO bulkedit
              // selectedRecords={selectedRecordStudent}
              // onSelectedRecordsChange={handleSelectionChangeStudentUnlock}
              loaderType="oval"
              loaderBackgroundBlur={4}
              fetching={studentLoading}
              totalRecords={studentPagination.total_count}
              recordsPerPage={studentPagination.limit}
              page={studentPagination.page}
              onPageChange={(page) => {
                setStudentPagination((prev) => ({
                  ...prev,
                  page,
                }));
              }}
              onRecordsPerPageChange={(limit) => {
                setStudentPagination((prev) => ({
                  ...prev,
                  limit,
                  page: 1,
                }));
              }}
              recordsPerPageOptions={pageSizeOptions}
              paginationText={({ from, to, totalRecords }) =>
                `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
              }
            />
          </div>
        </div>

        <CWModalCustom
          open={modalDetetStudy.isOpen}
          onClose={modalDetetStudy.close}
          title="ลบกลุ่มเรียน"
          cancelButtonName="ยกเลิก"
          buttonName="ยืนยัน"
          variant="danger"
          onOk={handleDeleteUnlockedGroups}
        >
          <div className="flex flex-col gap-4">
            ข้อมูลที่คุณเลือกจะถูกซ่อนจากหน้านี้ถาวร
            คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
          </div>
        </CWModalCustom>
        <CWModalCustom
          open={modalDetetStudent.isOpen}
          onClose={modalDetetStudent.close}
          title="ลบนักเรียน"
          cancelButtonName="ยกเลิก"
          buttonName="ยืนยัน"
          variant="danger"
          onOk={handleDeleteUnlockedStudent}
        >
          <div className="flex flex-col gap-4">
            ข้อมูลที่คุณเลือกจะถูกซ่อนจากหน้านี้ถาวร
            คุณไม่สามารถเรียกคืนข้อมูลที่จัดเก็บมาแสดงในหน้านี้ได้อีก
          </div>
        </CWModalCustom>
      </CWWhiteBox>
    </div>
  );
};
