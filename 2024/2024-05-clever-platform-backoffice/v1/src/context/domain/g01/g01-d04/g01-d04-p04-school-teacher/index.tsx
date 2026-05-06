import IconSearch from '@component/web/atom/wc-a-icons/IconSearch.tsx';
import CWButton from '@component/web/cw-button';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWWhiteBox from '@component/web/cw-white-box';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive.tsx';
import IconLink from '@core/design-system/library/component/icon/IconLink.tsx';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { BulkDataAPIRequest } from '@global/utils/apiResponseHelper';
// import CWOHeaderTableButton from "@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button";
import { toDateTimeTH } from '@global/utils/date.ts';
import showMessage from '@global/utils/showMessage';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobal from '@store/global';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist.ts';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import downloadCSV from '@global/utils/downloadCSV';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';

import API from '../local/api';
import { BulkUserUpdateRecord, TeacherRecord } from '../local/type';
import config from '@core/config';

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

const SchoolTeacher = () => {
  const navigate = useNavigate();

  const { schoolId } = useParams({ strict: false });

  // table record and pagination controller
  const [record, setRecord] = useState<TeacherRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 25,
    total_count: 0,
  });
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedRecords, setSelectedRecords] = useState<TeacherRecord[]>([]);
  const [selectedSingleRecord, setSelectedSingleRecord] = useState<TeacherRecord>();
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
  // const modalEnable = useModal();

  // show controller nav
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    const query: any = {
      page: pagination.page,
      limit: pagination.limit,
      status: selectedTab === 'all' ? undefined : selectedTab,
    };
    if (debouncedSearchText && searchField) {
      query[searchField] = debouncedSearchText;
    }

    API.schoolTeacher
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

  const handleArchiveTeacher = () => {
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

  const handleEnableAccount = async (userId: string, email: string | undefined) => {
    if (!email) {
      showMessage('ไม่พบอีเมลผู้ใช้', 'error');
      return;
    }

    try {
      await API.schoolTeacher.Update(userId, {
        email,
        status: 'enabled',
      });
      setIsFetching(true);
      showMessage('เปิดบัญชีสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to enable account:', error);
      showMessage('ไม่สามารถเปิดบัญชีได้', 'error');
    }
  };

  // const handleEnableTeacher = () => {
  //   if (!isInAction && selectedSingleRecord) {
  //     setIsInAction(true);
  //     API.schoolTeacher
  //       .Update(selectedSingleRecord.id, {
  //         email: selectedSingleRecord.email,
  //         status: "enabled",
  //       })
  //       .then((res) => {
  //         if (res.status_code === 200) {
  //           showMessage("เปิดใช้งานสำเร็จ", "success");
  //           setIsFetching(true);
  //         } else {
  //           showMessage("เปิดใช้งานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
  //         }
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //         showMessage("เปิดใช้งานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
  //       })
  //       .finally(() => {
  //         setSelectedSingleRecord(undefined);
  //         setIsInAction(false);
  //         modalEnable.close();
  //       });
  //   } else {
  //     modalEnable.close();
  //   }
  // };

  const handleBulkArchiveTeachers = () => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกครูอย่างน้อย 1 ท่าน', 'info');
      return;
    }
    const requestBody: BulkDataAPIRequest<BulkUserUpdateRecord> = {
      bulk_edit_list: selectedRecords.map((record) => ({
        user_id: record.id,
        status: 'disabled',
      })),
    };
    API.schoolTeacher
      .BulkUpdate(requestBody)
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

  const handleBulkEnabledTeachers = () => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกครูอย่างน้อย 1 ท่าน', 'info');
      return;
    }

    const requestBody: BulkDataAPIRequest<BulkUserUpdateRecord> = {
      bulk_edit_list: selectedRecords.map((record) => ({
        user_id: record.id,
        status: 'enabled',
      })),
    };
    setIsInAction(true);
    API.schoolTeacher
      .BulkUpdate(requestBody)
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
        setIsInAction(false);
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

      const res = await API.schoolTeacher.DownloadCSV(schoolId, query);
      downloadCSV(res, `${getDateTime()}_teachers`);
      showMessage('ดาวน์โหลดสำเร็จ', 'success');
    } catch (error) {
      console.error('Failed to start CSV download:', error);
      showMessage('ดาวน์โหลดล้มเหลว', 'error');
    }
  };

  const handleUploadCSV = (file?: File | undefined) => {
    if (file) {
      API.schoolTeacher
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

  const handlerAdminLoginAs = (targetId: string) => {
    API.schoolTeacher
      .AdminLoginAs(targetId)
      .then((res) => {
        if (res.status_code === 200) {
          const storeMethods =
            StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface'];
          storeMethods.setTargetData({
            ...res.data[0],
            access_token: res.data[0].target_user_access_token,
          });
          storeMethods.setAccessToken(res.data[0].target_user_access_token);
          storeMethods.setIsLoginAs(true);
          storeMethods.setTeacherRoles(res.data[0].teacher_roles);

          navigate({
            to: '/teacher/dashboard',
          });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          alert('ไม่สามารถล็อกอินในมุมมองของครูได้');
        }
      })
      .catch((error) => {
        console.error('Error during admin login as teacher:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
      });
  };

  const tabsList = [
    { key: 'all', label: 'ทั้งหมด' },
    { key: 'draft', label: 'แบบร่าง' },
    { key: 'enabled', label: 'ใช้งาน' },
    { key: 'disabled', label: 'ไม่ใช้งาน' },
  ];

  const columns: DataTableColumn<TeacherRecord>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    { accessor: 'id', title: 'รหัสบัญชี' },
    { accessor: 'title', title: 'คำนำหน้าชื่อ' },
    { accessor: 'first_name', title: 'ชื่อ' },
    { accessor: 'last_name', title: 'นามสกุล' },
    { accessor: 'email', title: 'อีเมล' },
    {
      accessor: 'line_user_id',
      title: 'LINE ID',
      render: (row: any) =>
        row.line_user_id ? (
          <IconLink className="text-primary" />
        ) : (
          <IconLink className="text-neutral-300" />
        ),
    },
    {
      accessor: 'status',
      title: 'สถานะ',
      render: (row: TeacherRecord) => {
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
      accessor: 'have_password',
      title: 'รหัสผ่าน',
      render: (row: TeacherRecord) =>
        row.have_password ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600" />
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600" />
        ),
    },
    {
      accessor: 'last_login',
      title: 'ใช้งานล่าสุด',
      render: (row: TeacherRecord) => {
        return row?.last_login ? toDateTimeTH(new Date(row.last_login)).toString() : '-';
      },
    },
    {
      accessor: '',
      title: 'Log in',
      render: (row: TeacherRecord) => {
        return (
          <CWButton
            title="Login"
            onClick={() => {
              handlerAdminLoginAs(row.id);
            }}
            className="h-fit w-fit"
          />
        );
      },
    },
    {
      accessor: 'view',
      title: 'ดู',
      render: (row: TeacherRecord) => {
        const { id } = row;
        return (
          <Link to={`./teacher/${id}`} className="flex items-center">
            <IconSearch />
          </Link>
        );
      },
    },
    {
      accessor: 'archive',
      title: 'ปิดบัญชี',
      render: (row: TeacherRecord) => {
        return row.status === 'disabled' ? (
          <div
            onClick={() => {
              handleEnableAccount(row.id, row.email);
            }}
            className="flex gap-2"
          >
            <IconCornerUpLeft />
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

  const statusLabels: Record<string, string> = {
    enabled: 'ใช้งาน',
    disabled: 'ไม่ใช้งาน',
    draft: 'แบบร่าง',
  };

  return (
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
              onClick: handleBulkArchiveTeachers,
            },
            {
              label: 'เปิดใช้งานทั้งหมด',
              onClick: handleBulkEnabledTeachers,
            },
          ]}
          // Continue after getting Ui
          onBtnClick={() => {
            navigate({
              to: `./teacher/create`,
              params: {
                schoolId,
              },
            });
          }}
          btnIcon={<IconPlus />}
          btnLabel={`เพิ่มครู`}
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
          fetching={isFetching}
        />
      </CWWhiteBox>
      <CWModalArchive
        open={modalArchive.isOpen}
        onOk={handleArchiveTeacher}
        onClose={() => {
          modalArchive.close();
        }}
      />
      {/* <CWModalEnable
        open={modalEnable.isOpen}
        onOk={handleEnableTeacher}
        onClose={() => {
          modalEnable.close();
        }}
      /> */}
    </div>
  );
};

export default SchoolTeacher;
