import { useState, useEffect, useMemo, SetStateAction } from 'react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import Modal, { ModalProps } from '@global/component/web/cw-modal/Modal';
import CWSelect from '@component/web/cw-select';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { toDateTimeTH } from '@global/utils/date';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  Item,
  Pagination,
  SpecialReward,
  SpecialRewardInside,
  Status,
  TypeItem,
} from '../../../type';
import API from '../../../api';
import { FilterQueryParams } from '../../../api/repository';
import CWPagination from '@component/web/cw-pagination';
import CWInput from '@component/web/cw-input';
import CWSelectValue from '@component/web/cw-selectValue';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

interface ModalAddItem extends ModalProps {
  open: boolean;
  onClose: () => void;
  selectedId?: number[];
  onSuccess?: () => void;
}

const CWModalAdditem = ({
  open,
  onClose,
  children,
  onOk,
  selectedId,
  onSuccess,
  ...rest
}: ModalAddItem) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<Item[]>([]);
  const [records, setRecords] = useState<Item[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | undefined>(undefined);
  const [amount, setAmount] = useState<number>(0);
  const [filterSearch, setFilterSearch] = useState<FilterQueryParams>({
    search_text: '',
    subject_id: undefined,
    lesson_id: undefined,
    sub_lesson_id: undefined,
    status: undefined,
    type: '',
  });
  const { pagination, setPagination } = usePagination({
    isModal: true,
  });

  useEffect(() => {
    fetchItems();
  }, [filterSearch, pagination.page, pagination.limit]);

  const fetchItems = async () => {
    setFetching(true);
    try {
      const res = await API.gamification.GetItem({
        page: pagination.page,
        limit: pagination.limit,
        ...filterSearch,
      });
      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count || res.data.length,
        }));
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleAddItem = async () => {
    setFetching(true);
    try {
      const res = await API.gamification.CreateItem({
        level_ids: selectedId || [],
        item_ids: selectedRecords.map((item) => item.id),
        amount: amount,
      });
      console.log(res);
      if (res.status_code === 200) {
        showMessage('เพิ่มไอเทมสำเร็จ', 'success');
        setTimeout(() => {
          onSuccess?.();
          fetchItems();
        }, 500);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setFetching(false);
    }
  };

  const columnDefs = useMemo<DataTableColumn<Item>[]>(() => {
    const finalDefs: DataTableColumn<Item>[] = [
      // {
      //     accessor: "index",
      //     title: "#",
      //     render: (record, index) => {
      //         return index + 1;
      //     },
      // },
      { accessor: 'id', title: '' },
      {
        accessor: 'image_url',
        title: 'รูปภาพ',
        render: ({ image_url }) => (
          <div className="size-8">
            <img src={image_url} alt={image_url} />
          </div>
        ),
      },
      { accessor: 'name', title: '' },
      { accessor: 'description', title: '' },
    ];

    return finalDefs;
  }, [filterSearch]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };
  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, limit: newSize, page: 1 }));
  };
  const handleSelectionChange = (selectedRows: SetStateAction<Item[]>) => {
    setSelectedRecords(selectedRows);
  };
  const handleTypeChange = (value: string) => {
    console.log(value);
    setFilterSearch((prev) => ({ ...prev, type: value }));
  };

  return (
    <Modal
      className="w-[1000px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title={'เลือกไอเทม'}
      {...rest}
    >
      <div className="w-full">
        <div className="mb-5 flex w-full gap-5">
          <CWSelectValue
            label={'ประเภท'}
            title="ประเภทไอเทม"
            className="w-full"
            options={[
              { label: 'Frame', value: 'frame' },
              { label: 'Badge', value: 'badge' },
              { label: 'Reward', value: 'reward' },
            ]}
            value={filterSearch.type}
            onChange={(value) => handleTypeChange(value as string)}
          />
          <CWInput
            label={'จำนวน'}
            placeholder="0"
            className="w-full"
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setAmount(Number(value));
              }
            }}
          />
        </div>
        <hr />
        {/* table */}
        <div className="w-full">
          <DataTable
            className="table-hover overflow-y-auto whitespace-nowrap"
            columns={columnDefs}
            records={records}
            noHeader
            minHeight={200}
            noRecordsText="ไม่พบข้อมูล"
            loaderType="oval"
            loaderBackgroundBlur={4}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={handleSelectionChange}
          />
        </div>
        <div className="z-[50] mt-10 w-full">
          <CWPagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total_count / pagination.limit)}
            onPageChange={handlePageChange}
            pageSize={pagination.limit}
            setPageSize={handlePageSizeChange}
          />
        </div>

        <div className="flex w-full justify-between gap-5 bg-white py-3">
          <button
            onClick={onClose}
            className="btn btn-outline-primary flex w-[150px] gap-2"
          >
            ย้อนกลับ
          </button>
          <button
            onClick={() => {
              if (amount <= 0) {
                showMessage('กรุณากรอกจำนวน', 'error');
                return;
              }
              if (selectedRecords.length <= 0) {
                showMessage('กรุณาเลือกไอเทม', 'error');
                return;
              }
              handleAddItem();
              onClose();
            }}
            className="btn btn-primary flex w-[150px] gap-2"
          >
            เลือก
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CWModalAdditem;
