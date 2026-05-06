import { useEffect, useState, useMemo, SetStateAction, useRef, useCallback } from 'react';
import {
  Curriculum,
  GetDataCard,
  Pagination,
  SpecialRewardInside,
  Status,
} from '../local/type';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import CWButton from '@component/web/cw-button';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobalPersist from '@store/global/persist';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import showMessage from '@global/utils/showMessage';
import StoreGlobal from '@store/global';
import GamificationSpecialHeader from './components/web/template/cw-header';
import CWWhiteBox from '@component/web/cw-white-box';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import CWModalAdditem from '../local/components/web/modal/cw-modal-item';
import CWModalEditAmount from '../local/components/web/modal/cw-modal-edit';
import API from '../local/api';
import CWModalDeltet from '../local/components/web/modal/cw-modal-delete';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';

import usePagination from '@global/hooks/usePagination';

const useModaldata = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const open = (newSelectedIds: number[]) => {
    setSelectedIds(newSelectedIds);
    setIsOpen(true);
  };
  const close = () => {
    setSelectedIds([]);
    setIsOpen(false);
  };
  return { isOpen, selectedIds, open, close };
};

const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const { specialId } = useParams({ strict: false });
  // search
  const [searchText, setSearchText] = useState({
    key: '',
    value: '',
  });
  const [debouncedFilterSearch] = useDebouncedValue(searchText, 300);

  // modal
  const modalDelete = useModaldata();
  const modalAdditem = useModaldata();

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<SpecialRewardInside[]>([]);
  const [records, setRecords] = useState<SpecialRewardInside[]>([]);
  const [dataCard, setDataCard] = useState<GetDataCard[]>([]);

  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedData, setSelectedData] = useState<SpecialRewardInside[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [idsToDelete, setIdsToDelete] = useState<number[]>([]);

  const searchDropdownOptions = [
    { label: 'ชื่อไอเทม', value: 'name' },
    { label: 'คำอธิบาย', value: 'description' },
    // { label: 'จำนวน', value: 'amount' },
  ];
  const dropdownPlaceholder =
    searchDropdownOptions && searchDropdownOptions.length > 0
      ? searchDropdownOptions[0].label
      : 'ฟิลด์';
  const fetchSpecialRewards = useCallback(async () => {
    setFetching(true);
    try {
      const res = await API.gamification.GetsSpecialRewardInside(Number(specialId), {
        page: pagination.page,
        limit: pagination.limit,
        [debouncedFilterSearch.key]: debouncedFilterSearch.value,
      });

      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count || res.data.length,
        }));
      } else if (res.status_code === 401) {
        navigate({ to: '/' });
      } else {
        showMessage(res.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error fetching special rewards:', error);
      showMessage('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
      setFetching(false);
    }
  }, [specialId, pagination.limit, pagination.page, debouncedFilterSearch]);

  useEffect(() => {
    fetchSpecialRewards();
  }, [fetchSpecialRewards, debouncedFilterSearch]);
  useEffect(() => {
    fetchGetDataCard();
  }, []);

  const handleOpenModal = (id: number) => {
    setSelectedIds([id]);
    modalAdditem.open([id]);
  };
  const handleUpdateItems = () => {
    fetchSpecialRewards();
  };

  const handleOpenModalEdit = (data: SpecialRewardInside) => {
    openModal();
    setSelectedData([data]);
  };

  const fetchGetDataCard = async () => {
    if (!specialId) return;
    setFetching(true);
    try {
      const res = await API.gamification.GetDataCard(specialId);
      if (res.status_code === 200) {
        setDataCard(res.data);
      } else {
        showMessage('ไม่สามารถดึงข้อมูลการ์ดได้', 'error');
      }
    } catch (error) {
      console.error('Error fetching data card:', error);
      showMessage('เกิดข้อผิดพลาดในการดึงข้อมูลการ์ด', 'error');
    } finally {
      setFetching(false);
    }
  };

  const columnDefs = useMemo<DataTableColumn<SpecialRewardInside>[]>(() => {
    const finalDefs: DataTableColumn<SpecialRewardInside>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'id', title: 'รหัสไอเทม' },
      {
        accessor: 'image_url',
        title: 'รูปภาพ',
        render: ({ image_url }) => (
          <div className="size-8">
            <img src={image_url} alt={image_url} />
          </div>
        ),
      },
      { accessor: 'name', title: 'ชื่อไอเทม' },
      { accessor: 'description', title: 'คำอธิบาย' },
      { accessor: 'amount', title: 'จำนวน' },
      {
        accessor: 'updated_at',
        title: 'แก้ไขล่าสุด',
        render: ({ updated_at }) => {
          return updated_at ? toDateTimeTH(updated_at) : '-';
        },
      },
      {
        accessor: 'updated_by',
        title: 'แก้ไขล่าสุดโดย',
        render: ({ updated_by }) => {
          return updated_by ?? '-';
        },
      },
      {
        accessor: 'status',
        title: 'สถานะ',
        render: ({ status }) => {
          if (status === Status.IN_USE)
            return <span className="badge badge-outline-success">เผยแพร่</span>;
          else if (status === Status.DRAFT)
            return <span className="badge badge-outline-dark">แบบร่าง</span>;
          else if (status === Status.NOT_IN_USE)
            return <span className="badge badge-outline-danger">ไม่ใช้งาน</span>;
        },
      },
      {
        accessor: 'edit',
        title: 'แก้ไข',

        render: (record) => (
          <button
            type="button"
            onClick={() => {
              handleOpenModalEdit(record);
            }}
          >
            <IconPen />
          </button>
        ),
      },
      {
        accessor: 'delete',
        title: 'ลบ',
        render: ({ id }) => {
          return (
            <button
              type="button"
              onClick={() => {
                modalDelete.open([id]);
              }}
            >
              <IconTrash />
            </button>
          );
        },
      },
    ];

    return finalDefs;
  }, []);
  const handleSelectionChange = (selectedRows: SetStateAction<SpecialRewardInside[]>) => {
    if (Array.isArray(selectedRows)) {
      setSelectedRecords(selectedRows);
    }
  };

  const handleBulkEditDelete = (selectedRecordsToDelete: SpecialRewardInside[]) => {
    if (selectedRecordsToDelete.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }
    const idsToDelete = selectedRecordsToDelete.map((item) => item.id);

    setIdsToDelete(idsToDelete);

    modalDelete.open(idsToDelete);
  };
  const handleDelete = (id: number[]) => {
    if (!id || id.length === 0) {
      showMessage('ไม่มีไอดีที่จะลบ', 'error');
      return;
    }
    setFetching(true);
    API.gamification
      .DeleteItem(specialId, id)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('ลบไอเท็มสำเร็จ', 'success');
          modalDelete.close();
          fetchSpecialRewards();

          setSelectedRecords((prev) => prev.filter((record) => !id.includes(record.id)));
        } else {
          showMessage('เกิดข้อผิดพลาดในการลบ', 'error');
        }
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        showMessage('เกิดข้อผิดพลาด', 'error');
      })
      .finally(() => {
        setFetching(false);
      });
  };

  return (
    <div className="w-full">
      <GamificationSpecialHeader dataCard={dataCard} />

      <CWWhiteBox className="mt-5 w-full">
        <div className="w-full">
          <div>
            <div className="flex w-full gap-3">
              <div className="dropdown">
                <Dropdown
                  placement={'bottom-start'}
                  btnClassName="btn btn-primary dropdown-toggle gap-1"
                  button={
                    <>
                      Bulk Edit
                      <IconCaretDown />
                    </>
                  }
                  disabled={selectedRecords.length === 0}
                >
                  <ul className="!min-w-[170px]">
                    <li>
                      <button
                        type="button"
                        className="w-full"
                        onClick={() => handleBulkEditDelete(selectedRecords)}
                      >
                        <div className="flex w-full justify-between">
                          <span>ลบไอเทม</span>
                          <IconTrash />
                        </div>
                      </button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
              <CWButton
                icon={<IconPlus />}
                title="เพิ่มไอเทม"
                onClick={() => handleOpenModal(Number(specialId))}
              />
              <p className="border-0 border-l border-neutral-300" />
              <WCAInputDropdown
                inputPlaceholder={'ค้นหา'}
                onInputChange={(evt) => {
                  const value = evt.currentTarget.value;
                  setSearchText((prev) => ({
                    ...prev,
                    value,
                  }));
                }}
                inputValue={searchText.value || ''}
                dropdownOptions={searchDropdownOptions}
                dropdownPlaceholder={dropdownPlaceholder}
                onDropdownSelect={(value) => {
                  setSearchText((prev) => ({
                    ...prev,
                    key: `${value}`,
                  }));
                }}
              />
            </div>
          </div>

          <div className="mt-5 w-full">
            <DataTable
              fetching={fetching}
              className="table-hover whitespace-nowrap"
              columns={columnDefs}
              records={records}
              minHeight={200}
              height={'calc(100vh - 350px)'}
              noRecordsText="ไม่พบข้อมูล"
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={handleSelectionChange}
              totalRecords={pagination.total_count}
              recordsPerPage={pagination.limit}
              page={pagination.page}
              onPageChange={(page) => setPagination((prev: any) => ({ ...prev, page }))}
              onRecordsPerPageChange={(limit) =>
                setPagination({
                  page: 1,
                  limit,
                  total_count: pagination.total_count,
                })
              }
              recordsPerPageOptions={pageSizeOptions}
              paginationText={({ from, to, totalRecords }) =>
                `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
              }
              loaderType="oval"
              loaderBackgroundBlur={4}
            />
          </div>
        </div>
        <CWModalDeltet
          open={modalDelete.isOpen}
          onConfirm={() => handleDelete(modalDelete.selectedIds)}
          onClose={() => {
            modalDelete.close();
            setIdsToDelete([]);
          }}
          id={modalDelete.selectedIds}
        />
        <CWModalAdditem
          selectedId={selectedIds}
          open={modalAdditem.isOpen}
          onClose={modalAdditem.close}
          onSuccess={handleUpdateItems}
        />
        <CWModalEditAmount
          open={isOpen}
          onClose={closeModal}
          selectedData={selectedData}
          levelId={specialId}
          onSuccess={handleUpdateItems}
        />
      </CWWhiteBox>
    </div>
  );
};

export default DomainJSX;
