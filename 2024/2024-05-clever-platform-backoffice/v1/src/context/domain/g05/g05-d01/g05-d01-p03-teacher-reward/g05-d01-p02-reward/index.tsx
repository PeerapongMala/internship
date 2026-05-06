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
import { FilterQueryParams } from '../local/api/repository/reward';
import IconForward from '@core/design-system/library/component/icon/IconForward';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';
import useModal from '@global/utils/useModal';
import CWModalCallback from '../local/components/web/modal/ModalCallback';
import CWMainLayout from '../local/components/web/template/cw-main-layout';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import IconCopyItem from '@core/design-system/library/component/icon/IconCopyItem';
import IconCopy from '@core/design-system/library/component/icon/IconCopy';
import CWInput from '@component/web/cw-input';
import CWModalSelectClass from '@component/web/organism/cw-o-modal-select-class';
import { TeacherStudentParamSearch } from '@domain/g03/g03-d04/local/api/group/teacher-student/type';
import CWClassSelector from '@component/web/organism/cw-o-select-class-student';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import { getClassData } from '@global/utils/store/get-class-data';
import usePagination from '@global/hooks/usePagination';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';
import SelectUserSubjectData from '@component/web/cw-select-user-subject-data';
import { getUserSubjectData } from '@global/utils/store/user-subject';
import CWSelect from '@component/web/cw-select';

const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

  const { targetData, userData } = StoreGlobalPersist.StateGet([
    'targetData',
    'userData',
  ]) as {
    targetData: IUserData;
    userData: IUserData;
  };

  const classData = getClassData();
  const userSubjectData = getUserSubjectData();

  const schoolId = targetData?.school_id ?? userData?.school_id;
  const subjectId =
    Array.isArray(targetData?.subject) && targetData.subject.length > 0
      ? targetData.subject[0].id
      : Array.isArray(userData?.subject) && userData.subject.length > 0
        ? userData.subject[0].id
        : undefined;

  const academic_year = targetData?.academic_year ?? userData?.academic_year;

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      if (isMobile && window.location.pathname !== '/teacher/reward/free') {
        navigate({ to: '/teacher/reward/free' });
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const modalDownload = useModal();
  const modalOpenClass = useModal();

  const [selectedClassId, setSelectdedClassId] = useState<{
    year?: string;
    class_name?: string;
    id: number;
  }>();
  const [filterSearch, setFilterSearch] = useState<FilterQueryParams>({
    class_id: undefined,
  });
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
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  // get subject
  useEffect(() => {
    if (!academic_year) return;
    setFetching(true);
    API.reward
      .GetSubject({
        academic_year: academic_year,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setSubjectData(res.data);
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
  }, [
    filterSearch,
    debouncedFilterSearch,
    pagination.page,
    pagination.limit,
    userSubjectData.id,
  ]);
  // filter classroom
  useEffect(() => {
    setFilterSearch((prev) => ({
      ...prev,
      class_id: selectedClassId?.id,
    }));
  }, [selectedClassId?.id]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [filterSearch, debouncedFilterSearch]);

  const fetchRewards = async () => {
    if (!academic_year) {
      return;
    }
    try {
      setFetching(true);

      const payload: FilterQueryParams = {
        subject_id: userSubjectData.id,
        page: debouncedFilterSearch.key ? 1 : pagination.page,
        limit: pagination.limit,
        academic_year: academic_year,
        ...filterSearch,
      };

      if (debouncedFilterSearch.value) {
        payload['search'] = debouncedFilterSearch.value;
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
            return <span className="badge badge-outline-danger">ยกเลิก</span>;
          else if (status === StatusReward.RECEIVED)
            return <span className="badge badge-outline-info">รับรางวัลแล้ว</span>;
          else if (status === StatusReward.SEND)
            return <span className="badge badge-outline-warning">รอกดรับรางวัล</span>;
        },
      },

      {
        accessor: 'copy',
        title: 'คัดลอกรางวัล',
        titleClassName: 'text-center',
        cellsClassName: 'text-center',
        render(record, index) {
          return (
            <button
              onClick={() => {
                navigate({
                  to: `/teacher/reward/free/create`,
                  search: { id: `${record?.id}` },
                });
              }}
            >
              <IconCopy />
            </button>
          );
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
      <CWMainLayout
        title={`จัดการรางวัล ปีการศึกษา ${academic_year}`}
        breadcrumbItems={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'จัดการรางวัล' },
        ]}
      >
        {/* <div className="mt-5">
          <div className="w-[250px]">
            <WCADropdown
              placeholder={currentSubject ? `${currentSubject.subject_name}` : "เลือกวิชา"}
              options={subjectData.map(s => `${s.subject_name}`)}
              onSelect={handleSubjectChange}
              disabled={true}
            />

          </div>
        </div> */}

        <CWWhiteBox className="">
          <div className="w-full">
            <div className="flex w-full flex-col gap-2">
              {/* แถวแรก - Bulk Edit และปุ่มรางวัลฟรี */}
              <div className="dropdown h-[35px] w-full text-nowrap">
                <Dropdown
                  placement={'bottom-start'}
                  btnClassName="w-full btn btn-primary dropdown-toggle !font-bold !px-3 gap-1"
                  button={
                    <>
                      Bulk Edit
                      <IconArrowDown />
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

              <CWMAccordion title="ตัวกรอง" headerClassName="bg-[#D5DDFF] mt-5 ">
                <div className="mt-3 bg-[#F0F3FF] px-3 py-5">
                  <div className="flex w-full flex-col items-start gap-2 md:flex-row md:justify-between">
                    <div className="flex w-full flex-col gap-2 md:flex-row">
                      <div className="border-r-2"></div>
                      <div className="max-h-[35px] !w-full">
                        <WCAInputDropdown
                          hideDropdown
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
                          // onDropdownSelect={(value) => {
                          //   setSearchText((prev) => ({
                          //     ...prev,
                          //     key: `${value}`,
                          //   }));
                          // }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 w-full">
                    <CWClassSelector classes={classData} />
                  </div>
                  <SelectUserSubjectData className="mt-4" />
                </div>
              </CWMAccordion>

              <CWButton
                icon={<IconPlus />}
                title={'รางวัลฟรี'}
                onClick={() => navigate({ to: '/line/teacher/reward/free/create' })}
                className="xs:ml-2 ml-0 mt-3 w-full text-nowrap"
              />
            </div>

            <div className="mt-5">
              <CWSelect
                options={[
                  { label: 'ทั้งหมด', value: '' },
                  { label: 'รอกดรับรางวัล', value: StatusReward.SEND },
                  { label: 'รับรางวัลแล้ว', value: StatusReward.RECEIVED },
                  { label: 'ยกเลิก', value: StatusReward.RECALL },
                ]}
                value={filterSearch.status ?? ''}
                onChange={(e) => {
                  setFilterSearch((prev) => ({
                    ...prev,
                    status:
                      e.target.value === ''
                        ? undefined
                        : (e.target.value as StatusReward),
                  }));
                  setPagination((prev) => ({
                    ...prev,
                    page: 1,
                  }));
                }}
                className="mt-5 max-w-xs text-primary"
                hideEmptyOption
              />
            </div>
            <div className="mt-5 w-full">
              <DataTable
                fetching={fetching}
                className="table-hover mantine-mobile-layout whitespace-nowrap"
                columns={columnDefs}
                records={records}
                minHeight={200}
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
                recordsPerPageOptions={pageSizeOptions}
                paginationText={({ from, to, totalRecords }) =>
                  `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
                }
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
          </div>
        </CWWhiteBox>
      </CWMainLayout>
      {/* <Header /> */}
    </div>
  );
};

export default DomainJSX;
