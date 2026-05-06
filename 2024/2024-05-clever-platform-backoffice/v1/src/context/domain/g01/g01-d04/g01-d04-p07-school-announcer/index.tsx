import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import StoreGlobal from '@global/store/global';
import { useDebouncedValue } from '@mantine/hooks';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BulkUserUpdateRecord, SchoolAnnouncer } from '../local/type';
import { toDateTimeTH } from '@global/utils/date';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { BulkDataAPIRequest } from '@global/utils/apiResponseHelper';
import CWWhiteBox from '@component/web/cw-white-box';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
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

const SchoolAnnouncerPage = () => {
  const navigate = useNavigate();
  const { schoolId } = useParams({ strict: false });

  // table record and pagination controller
  const [record, setRecord] = useState<SchoolAnnouncer[]>([]);
  const { pagination, setPagination } = usePagination();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedRecords, setSelectedRecords] = useState<SchoolAnnouncer[]>([]);
  const [selectedSingleRecord, setSelectedSingleRecord] = useState<SchoolAnnouncer>();
  // check if any actions are in process
  const [isInAction, setIsInAction] = useState<boolean>(false);
  // check if any feching data in process
  const [isFetching, setIsFetching] = useState<boolean>(false);

  // search text & field
  const [searchField, setSearchField] = useState<string>();
  const [searchText, setSearchText] = useState<string>('');
  // updated search text after debouncing time
  const [debouncedSearchText] = useDebouncedValue(searchText, 200);

  // modal
  const modalArchive = useModal();

  // Side bar effect
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  // API gets
  useEffect(() => {
    const query: any = {
      page: pagination.page,
      limit: pagination.limit,
      status: selectedTab === 'all' ? undefined : selectedTab,
    };
    if (debouncedSearchText && searchField) {
      query[searchField] = debouncedSearchText;
    }

    API.schoolAnnouncer
      .Gets(schoolId, query)
      .then((res) => {
        if (res.status_code === 200) {
          setRecord(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res._pagination.total_count,
          }));
        }
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [
    selectedTab,
    searchField,
    debouncedSearchText,
    pagination.page,
    pagination.limit,
    isFetching,
  ]);

  const handleArchiveSchoolAnnouncer = () => {
    if (!isInAction && selectedSingleRecord) {
      setIsInAction(true);
      API.schoolTeacher
        .Update(selectedSingleRecord.id, {
          email: selectedSingleRecord.email,
          status: 'disabled',
        })
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

  const handleEnabledSchoolAnnouncer = (id: string, email: string | undefined) => {
    if (!email) {
      showMessage('ไม่พบอีเมลผู้ใช้', 'error');
      return;
    }

    API.schoolTeacher
      .Update(id, {
        email,
        status: 'enabled',
      })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('เปิดใช้งานสำเร็จ', 'success');
          setIsFetching(true);
        } else {
          showMessage('เปิดใช้งานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showMessage('เปิดใช้งานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      });
  };

  const handleBulkArchiveSchoolAnnouncer = () => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกผู้ประกาศอย่างน้อย 1 ท่าน', 'info');
      return;
    }
    const requestBody: BulkDataAPIRequest<BulkUserUpdateRecord> = {
      bulk_edit_list: selectedRecords.map((record) => ({
        user_id: record.id,
        status: 'disabled',
      })),
    };
    API.schoolAnnouncer
      .BulkEdit(requestBody)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('จัดเก็บถาวรสำเร็จ', 'success');
          setIsFetching(true);
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
        setSelectedSingleRecord(undefined);
        setIsInAction(false);
        modalArchive.close();
      });
  };

  const handleBulkEnabledSchoolAnnouncer = () => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกผู้ประกาศอย่างน้อย 1 ท่าน', 'info');
      return;
    }
    const requestBody: BulkDataAPIRequest<BulkUserUpdateRecord> = {
      bulk_edit_list: selectedRecords.map((record) => ({
        user_id: record.id,
        status: 'enabled',
      })),
    };
    API.schoolAnnouncer
      .BulkEdit(requestBody)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('เปิดใช้งานสำเร็จ', 'success');
          setIsFetching(true);
          setSelectedRecords([]);
        } else {
          showMessage('เปิดใช้งานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showMessage('เปิดใช้งานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      })
      .finally(() => {
        setSelectedSingleRecord(undefined);
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

      const res = await API.schoolAnnouncer.DownloadCSV(schoolId, query);
      downloadCSV(res, `${getDateTime()}_announcers`);
      showMessage('ดาวน์โหลดสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to start CSV download:', error);
      showMessage('ดาวน์โหลดล้มเหลว', 'error');
    }
  };

  const handleUploadCSV = (file?: File | undefined) => {
    if (file) {
      API.schoolAnnouncer
        .UploadCSV(schoolId, { csv_file: file })
        .then((res) => {
          if (res.status_code === 200 || res.status_code === 201) {
            showMessage('อัพโหลดข้อมูลสำเร็จ', 'success');
            setIsFetching(true);
            setSelectedRecords([]);
          } else {
            showMessage('อัพโหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
          }
        })
        .catch((err) => {
          console.error(err);
          showMessage('อัพโหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        })
        .finally(() => {
          setSelectedSingleRecord(undefined);
          setIsInAction(false);
          modalArchive.close();
        });
    }
  };

  const tabsList = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'draft', label: 'แบบร่าง' },
    { key: 'enabled', label: 'ใช้งาน' },
    { key: 'disabled', label: 'ไม่ใช้งาน' },
  ];

  const statusLabels: Record<string, string> = {
    enabled: 'ใช้งาน',
    disabled: 'ไม่ใช้งาน',
    draft: 'แบบร่าง',
  };

  const columns: DataTableColumn<SchoolAnnouncer>[] = [
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
      render: (row: SchoolAnnouncer) =>
        row.have_password ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600" />
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600" />
        ),
    },
    {
      accessor: 'status',
      title: 'สถานะ',
      render: (row: SchoolAnnouncer) => {
        const statusText = row.status;
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
      render: (row: SchoolAnnouncer) => {
        return row?.last_login ? toDateTimeTH(new Date(row.last_login)).toString() : '-';
      },
    },
    {
      accessor: 'viewData',
      title: 'ดูข้อมูล',
      render: (row: SchoolAnnouncer) => (
        <button
          type="button"
          className="w-2 whitespace-nowrap !px-2"
          onClick={() =>
            navigate({
              to: `./announcer/${row.id}`,
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
      render: (row: SchoolAnnouncer) => {
        // todo: disable on re-enabled action
        return row.status === 'disabled' ? (
          <div
            onClick={() => handleEnabledSchoolAnnouncer(row.id, row.email)}
            className="flex cursor-pointer gap-2"
          >
            <IconArrowBackward />
          </div>
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
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5 py-4 font-noto-sans-thai">
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
              onClick: handleBulkArchiveSchoolAnnouncer,
            },
            {
              label: 'เปิดใช้งานทั้งหมด',
              onClick: handleBulkEnabledSchoolAnnouncer,
            },
          ]}
          // Continue after getting Ui
          onBtnClick={() => {
            navigate({
              to: `./announcer/create`,
              params: {
                schoolId,
              },
            });
          }}
          btnIcon={<IconPlus />}
          btnLabel={`เพิ่มฝ่ายประชาสัมพันธ์`}
          onDownload={handleDownloadCSV}
          onUpload={handleUploadCSV}
          inputSearchType="input-dropdown"
          searchDropdownOptions={[
            {
              label: 'ชื่อ',
              value: 'first_name',
            },
            {
              label: 'สกุล',
              value: 'last_name',
            },
          ]}
          onSearchDropdownSelect={(value) => {
            setSearchField(`${value}`);
          }}
          onSearchChange={(evt) => {
            // on input search change
            const text = evt.target.value;
            setSearchText(text);
          }}
        />

        <CWMTabs
          items={tabsList.map((t) => t.label)}
          currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
          onClick={(index) => setSelectedTab(tabsList[index].key)}
        />

        <DataTable
          className="table-hover whitespace-nowrap"
          records={record}
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
        onOk={handleArchiveSchoolAnnouncer}
        onClose={() => {
          modalArchive.close();
        }}
      />
    </div>
  );
};

export default SchoolAnnouncerPage;
