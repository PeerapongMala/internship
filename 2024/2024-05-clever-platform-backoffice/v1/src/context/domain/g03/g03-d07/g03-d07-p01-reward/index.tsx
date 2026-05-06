import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import {
  Curriculum,
  FilterSubject,
  IDownloadCsv,
  RewardTeacher,
  Status,
  StatusReward,
  TeacherReward,
} from '../local/type';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';

import { Link, useNavigate } from '@tanstack/react-router';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobalPersist from '@store/global/persist';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import showMessage from '@global/utils/showMessage';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import StoreGlobal from '@store/global';
import Header from '../local/components/web/template/cw-t-header';
import Tabs from '@component/web/cw-tabs';
import CWWhiteBox from '@component/web/cw-white-box';
import CWButton from '@component/web/cw-button';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import IconUpload from '@component/web/atom/wc-a-icons/IconUpload';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import API from '../local/api';
import { FilterQueryParams } from '../local/api/repository';
import IconForward from '@core/design-system/library/component/icon/IconForward';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';
import useModal from '@global/utils/useModal';
import CWModalCallback from '../local/components/web/modal/ModalCallback';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/line/teacher/reward') {
        navigate({ to: '/line/teacher/reward' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const modalDownload = useModal();
  const modalArchive = useModal();

  const ClickToRewardCreate = () => {
    navigate({ to: '/teacher/reward/create' });
  };
  const [filterSearch, setFilterSearch] = useState<FilterQueryParams>({});
  const [searchText, setSearchText] = useState({
    key: '',
    value: '',
  });
  const [debouncedFilterSearch] = useDebouncedValue(searchText, 300);
  const searchDropdownOptions = [
    { label: 'รหัสรางวัล', value: 'id' },
    { label: 'ชื่อรางวัล', value: 'item_name' },
    { label: 'จำนวน', value: 'amount' },
    { label: 'รหัสนักเรียน', value: 'student_id' },
    // { label: 'ชื่อ', value: 'first_name' },
    // { label: 'นามสกุล', value: 'last_name' },
    { label: 'ปีการศึกษา', value: 'academic_year' },
    // { label: 'ชั้นปี', value: 'year' },
  ];

  const dropdownPlaceholder =
    searchDropdownOptions && searchDropdownOptions.length > 0
      ? searchDropdownOptions[0].label
      : 'ฟิลด์';

  const [subjectData, setSubjectData] = useState<FilterSubject[]>([]);

  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<TeacherReward[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<TeacherReward[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const refUpload = useRef<HTMLInputElement>(null);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  // get subject
  useEffect(() => {
    setFetching(true);
    API.reward
      .GetSubject({})
      .then((res) => {
        if (res.status_code === 200) {
          setSubjectData(res.data);
          if (res.data.length > 0) {
            setFilterSearch((prev) => ({
              ...prev,
              subject_id: res.data[0].subject_id,
            }));
          }
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
    fetchRewards();
  }, [filterSearch, debouncedFilterSearch, pagination.page, pagination.limit]);

  const fetchRewards = async () => {
    try {
      setFetching(true);

      const payload: FilterQueryParams = {
        page: debouncedFilterSearch.key ? 1 : pagination.page,
        limit: pagination.limit,
        ...filterSearch,
      };

      if (debouncedFilterSearch.key && debouncedFilterSearch.value) {
        payload[debouncedFilterSearch.key] = debouncedFilterSearch.value;
      }

      const res = await API.reward.GetsReward(payload);

      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count || res.data.length,
        }));
      } else if (res.status_code === 401) {
        navigate({ to: '/' });
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleCallBack = (id: number) => {
    setFetching(true);
    API.reward
      .CallBack(id)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('เรียกคืนสำเร็จ', 'success');
          fetchRewards();
        } else {
          showMessage('เกิดข้อผิดพลาดในการเรียกคืน', 'error');
        }
      })
      .catch((error) => {
        showMessage('เกิดข้อผิดพลาดในการเรียกคืน', 'error');
      })
      .finally(() => {
        setFetching(false);
      });
  };

  const modalRecall = useModal();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const modalBulkEdit = useModal(); // สร้าง Modal สำหรับ Bulk Edit
  const [bulkEditStatus, setBulkEditStatus] = useState<StatusReward | null>(null);
  const modalBulkEditConfirm = useModal();

  const confirmRecall = (id: number) => {
    setSelectedId(id);
    modalRecall.open();
  };

  const handleConfirmRecall = () => {
    if (selectedId !== null) {
      handleCallBack(selectedId);
      modalRecall.close();
    }
  };

  const handleBulkEdit = (status: StatusReward) => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อเรียกคืน', 'error');
      return;
    }

    // เปิด Modal ยืนยันก่อนทำการ Recall
    modalBulkEditConfirm.open();
  };

  const handleConfirmBulkEdit = () => {
    const updatedRecords = selectedRecords.map((record) => ({
      id: record.id,
      status: StatusReward.RECALL, // ตั้งค่าสถานะเป็น RECALL
    }));

    setFetching(true);
    API.reward
      .BulkEdit(updatedRecords as [])
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('เรียกคืนสำเร็จ');
          setSelectedRecords([]); // ล้างรายการที่เลือก
          fetchRewards(); // ดึงข้อมูลใหม่
        } else {
          showMessage('การเรียกคืนล้มเหลว', 'error');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        showMessage('เกิดข้อผิดพลาดในการเรียกคืน', 'error');
      })
      .finally(() => {
        setFetching(false);
        modalBulkEditConfirm.close(); // ปิด Modal หลังจากดำเนินการเสร็จสิ้น
      });
  };

  const columnDefs = useMemo<DataTableColumn<TeacherReward>[]>(() => {
    const finalDefs: DataTableColumn<TeacherReward>[] = [
      { accessor: 'id', title: 'รหัสรางวัล' },
      { accessor: 'item_name', title: 'ชื่อรางวัล' },
      { accessor: 'amount', title: 'จำนวน' },
      { accessor: 'item_type', title: 'ประเภท' },
      {
        accessor: 'student_id',
        title: 'รหัสนักเรียน',
        render: ({ student_id }) => <span title={student_id}>{student_id}</span>,
      },
      { accessor: 'student_title', title: 'คำนำหน้า' },
      { accessor: 'student_first_name', title: 'ชื่อ' },
      { accessor: 'student_last_name', title: 'นามสกุล' },
      { accessor: 'academic_year', title: 'ปีการศึกษา' },
      { accessor: 'year', title: 'ชั้นปี' },
      { accessor: 'class_name', title: 'ห้อง' },
      {
        accessor: 'status',
        title: 'สถานะ',
        render: ({ status }) => {
          if (status === StatusReward.IN_USE)
            return <span className="badge badge-outline-success">ใช้งาน</span>;
          else if (status === StatusReward.RECALL)
            return <span className="badge badge-outline-danger">เรียกคืน</span>;
          else if (status === StatusReward.RECEIVED)
            return <span className="badge badge-outline-info">ได้รับแล้ว</span>;
          else if (status === StatusReward.SEND)
            return <span className="badge badge-outline-warning">ส่งแล้ว</span>;
        },
      },
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
        render: ({ created_at }) => {
          return created_at ? toDateTimeTH(created_at) : '-';
        },
      },

      {
        accessor: 'callback',
        title: 'เรียกคืน',
        render: ({ id, status }) => {
          const isDisabled =
            status === StatusReward.RECALL || status === StatusReward.RECEIVED;

          return (
            <button
              type="button"
              onClick={() => confirmRecall(id)}
              disabled={isDisabled}
              className={`rounded-md p-2 transition ${
                isDisabled ? 'cursor-not-allowed text-gray-200' : 'text-black'
              }`}
            >
              <IconCornerUpLeft />
            </button>
          );
        },
      },
    ];
    return finalDefs;
  }, [filterSearch, searchText]);

  const handleSelectionChange = (selectedRows: SetStateAction<TeacherReward[]>) => {
    setSelectedRecords(selectedRows);
  };

  const isSelectable = (record: TeacherReward) => {
    return (
      record.status !== StatusReward.RECEIVED && record.status !== StatusReward.RECALL
    );
  };
  const rowClassName = (record: TeacherReward) => {
    if (
      record.status === StatusReward.RECEIVED ||
      record.status === StatusReward.RECALL
    ) {
      return 'cursor-not-allowed';
    }
    return '';
  };
  const handleSubjectChange = (selected: string) => {
    const selectedSubject = subjectData.find((s) => `วิชา${s.subject_name}` === selected);
    if (selectedSubject) {
      setFilterSearch((prev) => ({
        ...prev,
        subject_id: selectedSubject.subject_id,
        searchValue: '',
      }));
    }
  };
  const onConfirmDownload = () => {
    if (!startDate || !endDate) {
      showMessage('โปรดเลือกวันที่', 'warning');
      return;
    }

    const payload: IDownloadCsv = {
      start_date: startDate,
      end_date: endDate,
    };
    if (filterSearch.subject_id) {
      payload.subject_id = Number(filterSearch.subject_id);
    }
    API.reward
      .DownloadCSV(payload)
      .then((res) => {
        showMessage('เกิดข้อผิดพลาดในการดาวน์โหลด', 'success');
        modalDownload.close();
        setStartDate('');
        setEndDate('');
      })
      .catch((error) => {
        console.error('Error downloading CSV:', error);
        showMessage('เกิดข้อผิดพลาดในการดาวน์โหลด', 'error');
      });
  };

  return (
    <div className="w-full">
      <Header />
      <div>
        <Tabs
          currentTab={filterSearch.status}
          setCurrentTab={(value) => {
            setFilterSearch((prev) => ({
              ...prev,
              status: value as StatusReward,
            }));
          }}
          tabs={[
            { label: 'ทั้งหมด', value: undefined },
            { label: 'ส่งแล้ว', value: StatusReward.SEND },
            { label: 'ได้รับแล้ว', value: StatusReward.RECEIVED },
            // { label: "ใช้แล้ว", value: StatusReward.IN_USE },
            { label: 'เรียกคืน', value: StatusReward.RECALL },
          ]}
        />
      </div>

      <div className="my-5">
        <div className="w-[250px]">
          <WCADropdown
            placeholder={
              filterSearch.subject_id
                ? `วิชา${subjectData.find((s) => s.subject_id === filterSearch.subject_id)?.subject_name}`
                : 'เลือกวิชา'
            }
            options={subjectData.map((s) => `วิชา${s.subject_name}`)}
            onSelect={handleSubjectChange}
          />
        </div>
      </div>

      <CWWhiteBox>
        <div className="flex w-full justify-between gap-3">
          <div className="flex gap-3">
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
                      onClick={() => handleBulkEdit(StatusReward.RECALL)}
                    >
                      <div className="flex w-full justify-between">
                        <span>เรียกคืน</span>
                        <IconCornerUpLeft />
                      </div>
                    </button>
                  </li>
                </ul>
              </Dropdown>
            </div>

            <CWButton
              icon={<IconForward />}
              title="ให้รางวัล"
              className="h-[38px]"
              onClick={ClickToRewardCreate}
            />
            <p className="border-0 border-l border-neutral-300" />
            <div className="">
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

          <div className="flex gap-x-[10px]">
            {/* modal download */}
            <CWButton
              title="Download"
              onClick={modalDownload.open}
              icon={<IconDownload />}
            />
            <CWModalDownload
              onDownload={onConfirmDownload}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              open={modalDownload.isOpen}
              onClose={modalDownload.close}
            />
            <CWButton
              title="Upload"
              onClick={() => refUpload.current?.click()}
              icon={<IconUpload />}
            />
            <input
              ref={refUpload}
              value={''}
              accept=".csv"
              onChange={(e) => {
                API.reward.UploadCSV(e.target.files![0]).then((res) => {
                  if (res.status_code === 200 || res.status_code === 201) {
                    showMessage('อัพโหลดสําเร็จ');
                  } else {
                    showMessage(res.message, 'error');
                  }
                });
              }}
              className="hidden"
              type="file"
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
            totalRecords={pagination.total_count}
            recordsPerPage={pagination.limit}
            page={pagination.page}
            isRecordSelectable={isSelectable}
            rowClassName={rowClassName}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            onRecordsPerPageChange={(limit) => {
              console.log('Records Per Page Changed:', limit);
              setPagination((prev) => ({ ...prev, limit, page: 1 }));
            }}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
            }
            recordsPerPageOptions={pageSizeOptions}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={handleSelectionChange}
          />
        </div>
        <CWModalCallback
          open={modalRecall.isOpen}
          // onOk={confirmArchive}
          onClose={() => {
            modalRecall.close();
            setSelectedRecords([]);
          }}
          onOk={handleConfirmRecall}
        />
        <CWModalCallback
          open={modalBulkEditConfirm.isOpen}
          onClose={() => {
            modalBulkEditConfirm.close();
            setSelectedRecords([]);
          }}
          onOk={handleConfirmBulkEdit}
        />
      </CWWhiteBox>
    </div>
  );
};

export default DomainJSX;
