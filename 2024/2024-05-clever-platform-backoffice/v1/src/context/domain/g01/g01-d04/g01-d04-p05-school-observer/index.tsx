import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import API from '../local/api';
import { toDateTimeTH } from '@global/utils/date';
import CWModalPopupSaveError from '@component/web/cw-modal/cw-modal-popup-save-error';
import CWModalPopupSaveComplete from '@component/web/cw-modal/cw-modal-popup-save-complete';
import CWWhiteBox from '@component/web/cw-white-box';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { BulkUserUpdateRecord, IObserverResponse } from '../local/type';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import showMessage from '@global/utils/showMessage';
import { BulkDataAPIRequest } from '@global/utils/apiResponseHelper';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import downloadCSV from '@global/utils/downloadCSV';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import usePagination from '@global/hooks/usePagination';
interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const SchoolObserver = () => {
  const { schoolId } = useParams({ strict: false });
  const navigate = useNavigate();
  // Side bar
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [selectedTab, setSelectedTab] = useState('all');
  const [inputValueSearch, setInputValueSearch] = useState<{
    search_keyword?: string;
    search_field?: string;
    observer_access_id?: number;
    observer_access_name: string;
  }>({
    search_keyword: '',
    search_field: '',
    observer_access_name: '',
  });
  const [records, setRecords] = useState<IObserverResponse[]>([]);
  const [observerAccessItems, setObserverAccessItems] = useState<
    { observer_access_id: number; name: string }[]
  >([]);
  const [selectedRecords, setSelectedRecords] = useState<IObserverResponse[]>([]);
  const [selectedSingleRecord, setSelectedSingleRecord] = useState<
    IObserverResponse | undefined
  >();
  const { pagination, setPagination } = usePagination();
  // check if any actions are in process
  const [isInAction, setIsInAction] = useState<boolean>(false);
  // check if any feching data in process
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // modal
  const modalArchive = useModal();
  const modalComplete = useModal();
  const modalError = useModal();

  useEffect(() => {
    fetchGetObserverAccessItem();
  }, []);

  useEffect(() => {
    if (schoolId) {
      fetchGetObserverData(schoolId, selectedTab, inputValueSearch);
      setIsFetching(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    schoolId,
    selectedTab,
    inputValueSearch,
    isFetching,
  ]);

  const statusLabels: Record<string, string> = {
    enabled: 'ใช้งาน',
    disabled: 'ไม่ใช้งาน',
    draft: 'แบบร่าง',
  };

  const tabsList = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'draft', label: 'แบบร่าง' },
    { key: 'enabled', label: 'ใช้งาน' },
    { key: 'disabled', label: 'ไม่ใช้งาน' },
  ];

  const columns: DataTableColumn<IObserverResponse>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    {
      accessor: 'id',
      title: 'รหัสบัญชี',
    },
    {
      accessor: 'title',
      title: 'คำนำหน้า',
    },
    {
      accessor: 'first_name',
      title: 'ชื่อ',
    },
    {
      accessor: 'last_name',
      title: 'สกุล',
    },
    {
      accessor: 'email',
      title: 'อีเมล',
    },
    {
      accessor: 'have_password',
      title: 'รหัสผ่าน',
      render: (row: IObserverResponse) =>
        row.have_password ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600" />
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600" />
        ),
    },
    {
      accessor: 'observer_accesses',
      title: 'ความรับผิดชอบ',
      render: (row: IObserverResponse) => {
        return row.observer_accesses.length;
      },
    },
    {
      accessor: 'status',
      title: 'สถานะ',
      render: (row: any) => {
        const statusText = row.status.toLowerCase();
        const badgeClass =
          statusText === 'enabled'
            ? 'badge-outline-success'
            : statusText === 'disabled'
              ? 'badge-outline-danger'
              : 'badge-outline-dark';
        return (
          <span className={`badge ${badgeClass} flex w-16 items-center justify-center`}>
            {statusLabels[statusText] || 'ไม่ระบุสถานะ'}
          </span>
        );
      },
    },
    {
      accessor: 'last_login',
      title: 'ใช้งานล่าสุด',
      render: (row: IObserverResponse) => {
        const lastLoginDate = row?.last_login ?? null;
        return lastLoginDate ? toDateTimeTH(lastLoginDate) : '-';
      },
    },
    {
      accessor: 'view',
      title: 'ดูข้อมูล',
      render: (row: IObserverResponse) => (
        <button
          type="button"
          className="w-2 whitespace-nowrap !px-2"
          onClick={() =>
            navigate({
              to: `./observer/${row.id}`,
            })
          }
        >
          <IconSearch />
        </button>
      ),
    },
    {
      accessor: 'archive',
      title: 'ปิดบัญชี',
      render: (row: IObserverResponse) => (
        <div className="flex items-center justify-center">
          {/* disable on re-enabled action */}
          {row.status === 'disabled' ? (
            <button className="flex gap-1" onClick={() => handleRestoreObserver(row)}>
              <IconArrowBackward className="text-neutral-600" />
            </button>
          ) : (
            <button
              className="flex gap-1"
              onClick={() => {
                setSelectedSingleRecord(row);
                modalArchive.open();
              }}
            >
              <IconArchive />
            </button>
          )}
        </div>
      ),
    },
  ];

  const fetchGetObserverAccessItem = async () => {
    try {
      const response = (await API.schoolObserver.GetObserverAccessList()) as {
        data: any[];
        status_code: number;
      };

      if (response.status_code === 200) {
        setObserverAccessItems(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch observer', error);
    }
  };

  const fetchGetObserverData = async (
    schoolId: string,
    status?: string,
    search?: {
      search_keyword?: string;
      search_field?: string;
      observer_access_id?: number;
      observer_access_name: string;
    },
  ) => {
    try {
      const query: any = {
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 25,
        status: status !== 'all' ? status : '',
        observer_access_id: search?.observer_access_id ?? '',
      };

      // if search field and search keyword aren't empty
      if (search?.search_field && search?.search_keyword) {
        // put it in query
        const field = search.search_field;
        query[field] = search.search_keyword;
      }

      const response = (await API.schoolObserver.Gets(schoolId, query)) as {
        data: IObserverResponse[];
        status_code: number;
        _pagination: { total_count: number };
      };

      if (response.status_code === 200) {
        setRecords(response.data);
        setPagination({
          ...pagination,
          total_count: response._pagination.total_count,
        });
      }
    } catch (error) {
      console.error('Failed to fetch observer', error);
    }
  };

  const handleArchiveObserver = () => {
    if (selectedSingleRecord) {
      setIsInAction(true);
      // Prepare FormData
      const formData = new FormData();
      formData.append('status', 'disabled');
      formData.append('email', selectedSingleRecord.email);

      API.schoolObserver
        .Update(selectedSingleRecord.id, formData)
        .then((res) => {
          if (res.status_code === 200) {
            showMessage('จัดเก็บถาวรสำเร็จ', 'success');
            setIsFetching(true);
          } else {
            showMessage('จัดเก็บถาวรไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
          }
        })
        .catch((err) => {
          console.error(err);
          showMessage('จัดเก็บถาวรไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        })
        .finally(() => {
          setSelectedSingleRecord(undefined);
          setIsInAction(false);
          modalArchive.close();
        });
    } else {
      modalArchive.close();
    }
  };

  const handleRestoreObserver = (selectedSingleRecord: IObserverResponse) => {
    setIsInAction(true);
    // Prepare FormData
    const formData = new FormData();
    formData.append('status', 'enabled');
    formData.append('email', selectedSingleRecord.email);

    API.schoolObserver
      .Update(selectedSingleRecord.id, formData)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('กู้คืนสำเร็จ', 'success');
          setIsFetching(true);
          if (schoolId) {
            fetchGetObserverData(schoolId, selectedTab, inputValueSearch);
          }
        } else {
          showMessage('กู้คืนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showMessage('กู้คืนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      })
      .finally(() => {
        setIsInAction(false);
        setIsFetching(false);
      });
  };

  const handleBulkArchiveObserver = () => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกผู้สังเกตการณ์อย่างน้อย 1 ท่าน', 'info');
      return;
    }
    const requestBody: BulkDataAPIRequest<BulkUserUpdateRecord> = {
      bulk_edit_list: selectedRecords.map((record) => ({
        user_id: record.id,
        status: 'disabled',
      })),
    };
    API.schoolObserver
      .BulkEdit(requestBody)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('จัดเก็บถาวรสำเร็จ', 'success');
          setIsFetching(true);
          setSelectedSingleRecord(undefined);
          setSelectedRecords([]);
        } else {
          showMessage('จัดเก็บถาวรไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showMessage('จัดเก็บถาวรไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      })
      .finally(() => {
        setIsInAction(false);
        modalArchive.close();
      });
  };

  const handleDownloadCSV = async (data: Record<string, any>) => {
    if (!data.dateFrom || !data.dateTo) {
      console.error('Missing required date range');
      showMessage('กรุณาระบุช่วงวันที่', 'error');
      return;
    }

    try {
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const microseconds = String(Math.floor(Math.random() * 999999)).padStart(6, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${microseconds}Z`;
      };

      const query = {
        start_date: formatDate(data.dateFrom),
        end_date: formatDate(data.dateTo),
      };

      const res = await API.schoolObserver.DownloadCSV(schoolId, query);
      downloadCSV(res, `${getDateTime()}_observers`);
      showMessage('ดาวน์โหลดสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to start CSV download:', error);
      showMessage('ดาวน์โหลดล้มเหลว', 'error');
    }
  };

  const handleUploadCSV = (file?: File | undefined) => {
    if (file) {
      setIsInAction(true);
      API.schoolObserver
        .UploadCSV(schoolId, { csv_file: file })
        .then((res) => {
          if (res.status_code === 200 || res.status_code === 201) {
            showMessage('อัพโหลดข้อมูลสำเร็จ', 'success');
            setIsFetching(true);
          } else {
            showMessage('อัพโหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
          }
        })
        .catch((err) => {
          console.error(err);
          showMessage('อัพโหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        })
        .finally(() => {
          setIsInAction(false);
        });
    }
  };

  return (
    <>
      <CWModalPopupSaveError
        open={modalError.isOpen}
        onClose={() => {
          modalError.close();
        }}
      />

      <CWModalPopupSaveComplete
        open={modalComplete.isOpen}
        onClose={() => {
          modalComplete.close();
        }}
      />

      <div className="py-5 font-noto-sans-thai">
        <CWWhiteBox className="flex flex-col gap-5">
          <CWOHeaderTableButton
            bulkEditDisabled={selectedRecords.length === 0}
            bulkEditActions={[
              {
                label: (
                  <div className="flex gap-2">
                    <IconArchive />
                    <div>ปิดใช้งาน</div>
                  </div>
                ),
                onClick: handleBulkArchiveObserver,
              },
              // {
              //   label: "เปิดใช้งานทั้งหมด",
              //   onClick: handleBulkEnabledTeachers,
              // },
            ]}
            // Continue after getting Ui
            onBtnClick={() => {
              navigate({
                to: `./observer/create`,
              });
            }}
            btnIcon={<IconPlus />}
            btnLabel={`เพิ่มผู้สังเกตการณ์`}
            onDownload={handleDownloadCSV}
            onUpload={handleUploadCSV}
            inputSearchType="input-dropdown"
            searchDropdownOptions={[
              {
                label: 'รหัสบัญชี',
                value: 'id',
              },
              {
                label: 'คำนำหน้า',
                value: 'title',
              },
              {
                label: 'ชื่อ',
                value: 'first_name',
              },
              {
                label: 'สกุล',
                value: 'last_name',
              },
              {
                label: 'อีเมล',
                value: 'email',
              },
            ]}
            onSearchDropdownSelect={(value) => {
              setInputValueSearch({
                ...inputValueSearch,
                search_field: `${value}`,
              });
            }}
            onSearchChange={(evt) => {
              // on input search change
              const text = evt.target.value;
              setInputValueSearch({
                ...inputValueSearch,
                search_keyword: text,
              });
            }}
          />

          <div className="w-1/3 xl:w-1/4">
            <WCADropdown
              placeholder={
                inputValueSearch?.observer_access_id
                  ? inputValueSearch?.observer_access_name
                  : 'ความรับผิดชอบ'
              }
              options={['ทั้งหมด', ...observerAccessItems.map((item) => item.name)]}
              onSelect={(selected: string) => {
                if (selected === 'ทั้งหมด') {
                  setInputValueSearch({
                    ...inputValueSearch,
                    observer_access_id: undefined,
                    observer_access_name: '',
                  });
                } else {
                  const observerAccess = observerAccessItems.find(
                    (item) => item.name === selected,
                  );
                  if (observerAccess)
                    setInputValueSearch({
                      ...inputValueSearch,
                      observer_access_id: observerAccess?.observer_access_id,
                      observer_access_name: observerAccess?.name,
                    });
                }
              }}
            />
          </div>

          <CWMTabs
            items={tabsList.map((t) => t.label)}
            currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
            onClick={(index) => setSelectedTab(tabsList[index].key)}
          />

          <DataTable
            className="table-hover whitespace-nowrap"
            records={records}
            columns={columns}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            highlightOnHover
            withTableBorder
            withColumnBorders
            height={'calc(100vh - 350px)'}
            noRecordsText="ไม่พบข้อมูล"
            totalRecords={pagination.total_count}
            recordsPerPage={pagination.limit}
            page={pagination.page}
            onPageChange={(page) => {
              setPagination((prev: Pagination) => ({
                ...prev,
                page,
              }));
            }}
            onRecordsPerPageChange={(limit: number) => {
              setPagination((prev: Pagination) => ({
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
        </CWWhiteBox>

        <CWModalArchive
          open={modalArchive.isOpen}
          onOk={handleArchiveObserver}
          onClose={() => {
            modalArchive.close();
          }}
        />
      </div>
    </>
  );
};

export default SchoolObserver;
