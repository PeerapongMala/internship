import { useState, useEffect, useMemo, SetStateAction } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '@global/component/web/cw-modal/Modal';
import CWSelect from '@component/web/cw-select';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { toDateTimeTH } from '@global/utils/date';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWInputSearch from '@component/web/cw-input-search';
import { GroupUnlock, Pagination, UnlockedGroup } from '@domain/g03/g03-d05/local/type';
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
  allGroups: UnlockedGroup[];
  fetchGroups: (
    page: number,
    limit: number,
    searchField: string,
    searchValue: string,
  ) => Promise<any>;
}

const CWModalSelectGroup = ({
  open,
  onClose,
  onSuccess,
  allGroups,
  fetchGroups,
  children,
  onOk,
  ...rest
}: ModalSelectGroup) => {
  const [selectedRecords, setSelectedRecords] = useState<UnlockedGroup[]>([]);
  const [records, setRecords] = useState<UnlockedGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const { pagination, setPagination } = usePagination({ isModal: true });

  const params = useParams({
    // from: '/teacher/lesson/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId/level/$levelId',
    strict: false,
  });
  console.log('Current params:', params);

  const [searchValue, setSearchValue] = useState('');
  const [searchField, setSearchField] = useState('name');

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

  const columnDefs = useMemo<DataTableColumn<UnlockedGroup>[]>(() => {
    const finalDefs: DataTableColumn<UnlockedGroup>[] = [
      // {
      //     accessor: "index",
      //     title: "#",
      //     render: (record, index) => {
      //         return index + 1;
      //     },
      // },
      // { accessor: 'id', title: 'รหัส' },
      { accessor: 'name', title: 'ชื่อกลุ่มเรียน' },
    ];

    return finalDefs;
  }, []);
  const handleSelectionChange = (selectedRows: SetStateAction<UnlockedGroup[]>) => {
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
      await LessonRestAPI.AssignGroupsToLevel(
        Number(levelId),
        selectedRecords.map((record) => Number(record.id)),
      );
      showMessage('กลุ่มเรียนถูกกำหนดเรียบร้อย', 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      showMessage('ไม่สามารถกำหนดกลุ่มเรียนได้', 'error');
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
        <WCAInputDropdown
          inputPlaceholder={'ค้นหา'}
          inputValue={searchValue}
          onInputChange={(e) => setSearchValue(e.target.value)}
          onInputBtnClick={() => loadGroups()}
          dropdownPlaceholder={'ฟิลด์'}
          dropdownOptions={[
            { value: 'name', label: 'ชื่อกลุ่มเรียน' },
            { value: 'id', label: 'รหัส' },
          ]}
          onDropdownSelect={(value) => {
            setSearchField(value.toString());
            setSearchValue('');
          }}
        />

        <hr className="mt-4" />
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

export default CWModalSelectGroup;
