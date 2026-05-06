import { useState, useEffect, useMemo, SetStateAction } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '@global/component/web/cw-modal/Modal';
import CWSelect from '@component/web/cw-select';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { toDateTimeTH } from '@global/utils/date';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWInputSearch from '@component/web/cw-input-search';
import { GroupUnlock, Pagination, StudentUnlock } from '@domain/g03/g03-d05/local/type';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import CWPagination from '@component/web/cw-pagination';
import LessonRestAPI from '../../../../local/api/group/lesson/restapi';
import showMessage from '@global/utils/showMessage';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';
import usePagination from '@global/hooks/usePagination';

interface ModalSelectGroup extends ModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  allGroups: StudentUnlock[];
  fetchGroups: (
    page: number,
    limit: number,
    searchField: string,
    searchValue: string,
  ) => Promise<any>;
}

const CWModalSelectStudent = ({
  open,
  onClose,
  onSuccess,
  allGroups,
  fetchGroups,
  children,
  onOk,
  ...rest
}: ModalSelectGroup) => {
  const [selectedRecords, setSelectedRecords] = useState<StudentUnlock[]>([]);
  const [records, setRecords] = useState<StudentUnlock[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchField, setSearchField] = useState('first_name');
  const { pagination, setPagination } = usePagination({ isModal: true });

  const params = useParams({
    // from: '/teacher/lesson/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId/level/$levelId',
    strict: false,
  });
  console.log('Current params:', params);

  useEffect(() => {
    console.log('Current selectedRecords:', selectedRecords);
  }, [selectedRecords]);

  const classId = params.classId;
  const lessonId = params.lessonId;
  const sublessonId = params.sublessonId;
  const levelId = params.levelId;
  const subjectId = params.subjectId;
  useEffect(() => {
    if (open && allGroups.length > 0 && records.length > 0) {
      const preSelectedGroups = allGroups.filter((group) =>
        records.some((record) => String(record.id) === String(group.id)),
      );
      setSelectedRecords(preSelectedGroups);
    }
  }, [open, allGroups, records]);

  const loadGroups = async () => {
    if (open) {
      setLoading(true);
      const response = await fetchGroups(
        pagination.page,
        pagination.limit,
        searchField,
        searchValue,
      );
      if (response) {
        setRecords(response.data);
        setPagination((prev) => ({
          ...prev,
          total_count: response._pagination.total_count,
        }));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [open, pagination.page, pagination.limit, searchValue]);

  const columnDefs = useMemo<DataTableColumn<StudentUnlock>[]>(() => {
    const finalDefs: DataTableColumn<StudentUnlock>[] = [
      // {
      //     accessor: "index",
      //     title: "#",
      //     render: (record, index) => {
      //         return index + 1;
      //     },
      // },
      { accessor: 'id', title: 'รหัส' },
      { accessor: 'title', title: 'คำนำหน้า', width: 200 },
      { accessor: 'first_name', title: 'ชื่อ' },
      { accessor: 'last_name', title: 'นามสกุล' },
    ];

    return finalDefs;
  }, []);
  const handleSelectionChange = (selectedRows: SetStateAction<StudentUnlock[]>) => {
    setSelectedRecords(selectedRows);
  };
  const paginatedRecords = useMemo(() => {
    return records.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit,
    );
  }, [records, pagination.page, pagination.limit]);

  const totalPages = Math.ceil(pagination.total_count / pagination.limit);
  const setCurrentPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };
  const setPageSize = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size }));
  };

  const handleAssignGroups = async () => {
    try {
      setLoading(true);
      const studentIds = selectedRecords.map((record) => record.id);
      console.log('studentIds:', studentIds);
      await LessonRestAPI.AssignStudentsToLevel(
        Number(levelId),
        studentIds,
        Number(classId),
      );
      showMessage('นักเรียนถูกกำหนดเรียบร้อย', 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      showMessage('ไม่สามารถกำหนดนักเรียนได้', 'error');
      console.error('Failed to assign groups:', error);
    } finally {
      setLoading(false);
    }
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
          <div className="relative w-full">
            <WCAInputDropdown
              inputPlaceholder={'ค้นหา'}
              inputValue={searchValue}
              onInputChange={(e) => setSearchValue(e.target.value)}
              onInputBtnClick={() => loadGroups()}
              dropdownPlaceholder={'ฟิลด์'}
              dropdownOptions={[
                { value: 'first_name', label: 'ชื่อ' },
                { value: 'last_name', label: 'นามสกุล' },
                { value: 'id', label: 'รหัส' },
              ]}
              onDropdownSelect={(value) => {
                setSearchField(value.toString());
                setSearchValue('');
              }}
            />{' '}
            <button
              type="button"
              className="!absolute right-0 mr-2 h-full"
              // onClick={onClick}
            >
              <IconSearch className="!h-5 !w-5" />
            </button>
          </div>
        </div>

        <hr />
        {/* table */}
        <div className="datatables mt-5 flex flex-col">
          <div className="h-[300px] overflow-y-auto">
            <DataTable
              className="table-hover whitespace-nowrap"
              columns={columnDefs}
              records={records}
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={handleSelectionChange}
            />
          </div>

          <div className="mt-5">
            <CWPagination
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pagination.limit}
              setPageSize={setPageSize}
            />
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
            onClick={handleAssignGroups}
            disabled={selectedRecords.length === 0 || loading}
            className="btn btn-primary flex w-[150px] gap-2"
          >
            {loading ? 'กำลังบันทึก...' : 'เลือก'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalSelectStudent;
