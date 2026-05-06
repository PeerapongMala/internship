// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import WhiteBox from '@core/design-system/library/component/web/Whitebox';
import ModalArchive from '@core/design-system/library/component/web/Modal/ModalArchive';
import { Homework, StatusHomework, Status } from '../local/type';
import Tabs from '@core/design-system/library/component/web/Tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import CWTitleBack from '@component/web/cw-title-back';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import CWButton from '@component/web/cw-button';
import CWInputSearch from '@component/web/cw-input-search';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import showMessage from '@global/utils/showMessage';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import CWModalUpload from '@component/web/cw-modal/cw-modal-upload';
import CWSelectValue from '@component/web/cw-selectValue';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import API from '../local/api/index';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import { HomeworkListItem, YearOption, ClassOption } from '../local/type';

import { ModalCloseAccount } from './components/ModalCloseAccount';
import { ModalOpenStatus } from './components/ModalOpenAccount';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import router from '@global/utils/router-global';
import { getUserData } from '@global/utils/store/getUserData';
import { getUserSubjectData } from '@global/utils/store/user-subject';
import ModalContactAdminForSubject from '@component/web/cw-modal/cw-modal-contact-admin-for-subject';
import CWModalSelectClass from '@component/web/organism/cw-o-modal-select-class';
import CWInput from '@component/web/cw-input';
import CWClassSelector from '@component/web/organism/cw-o-select-class-student';
import { getClassData } from '@global/utils/store/get-class-data';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import ScreenTemplateWithoutHeader from '@domain/g05/local/component/web/template/cw-t-line-layout-without-text';
import SelectUserSubjectData from '@component/web/cw-select-user-subject-data';
import usePagination from '@global/hooks/usePagination';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';
import CWSelect from '@component/web/cw-select';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const DomainJSX = () => {
  const userData = getUserData();
  const subjectData = getUserSubjectData();

  if (!userData.is_subject_teacher) {
    return <ModalContactAdminForSubject />;
  }

  const subjectId = subjectData?.id;
  const subject_id = subjectId;
  const year_id = subjectData?.year_id;
  const schoolId = userData.school_id;

  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { subject_name, curriculum_group_name, year_name } = search;

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      if (isMobile && window.location.pathname !== '/teacher/homework/homework') {
        navigate({ to: '/teacher/homework/homework' });
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const modalDownload = useModal();
  const modalArchive = useModal();

  const ClickGoCreate = () => {
    navigate({ to: `/teacher/homework/homework/create` });
  };

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<HomeworkListItem[]>([]);
  const [initialStateRecords, setInitialStateRecords] = useState<HomeworkListItem[]>();
  const [records, setRecords] = useState<HomeworkListItem[]>();
  const [statusFilter, setStatusFilter] = useState<StatusHomework>(StatusHomework.DEU);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [filterParams, setFilterParams] = useState<Record<string, string>>({
    search: '',
  });
  const [homeworkType, setHomeworkType] = useState<
    'must_send' | 'pre-ahead' | 'archived'
  >('must_send');
  const [years, setYears] = useState<YearOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedClass, setSelectedClass] = useState<number>();
  const filters = getClassData();

  // Fetch year list on component mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await API.teacherHomework.GetYearList();
        if (response.status_code === 200) {
          setYears(response.data);
        }
      } catch (error) {
        console.error('Error fetching years:', error);
      }
    };
    fetchYears();
  }, []);

  // Fetch class list when year changes
  useEffect(() => {
    if (!selectedYear) return;
    const fetchClasses = async () => {
      try {
        const response = await API.teacherHomework.GetClassList(
          selectedYear,
          Number(schoolId),
        );
        if (response.status_code === 200) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, [selectedYear, schoolId]);

  // Update filter params when year or class changes
  useEffect(() => {
    setFilterParams((prev) => ({
      ...prev,
      year_id: selectedYear?.toString() || '',
      class_id: selectedClass?.toString() || '',
    }));
  }, [selectedYear, selectedClass]);

  const handleDateRangeChange = (fieldPrefix: string) => (dates: Date[]) => {
    // เก็บค่าเดิมไว้เพื่อเปรียบเทียบการเปลี่ยนแปลง
    const oldStart = filterParams[`${fieldPrefix}_start` as keyof typeof filterParams];
    const oldEnd = filterParams[`${fieldPrefix}_end` as keyof typeof filterParams];

    const updates: Record<string, string> = {};

    // ฟังก์ชันช่วยในการแปลงวันที่ให้ถูกต้องตาม timezone
    const formatDateToLocalISODate = (date: Date) => {
      // ใช้ timezone ของประเทศไทย (GMT+7)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // ถ้ามีการเลือกวันที่เริ่มต้น
    if (dates[0]) {
      const startDate = formatDateToLocalISODate(dates[0]);
      updates[`${fieldPrefix}_start`] = startDate;
    }

    // ถ้ามีการเลือกวันที่สิ้นสุด (ในโหมด range จะมี 2 วันที่)
    if (dates[1]) {
      const endDate = formatDateToLocalISODate(dates[1]);
      updates[`${fieldPrefix}_end`] = endDate;
    } else if (dates[0]) {
      // ถ้าไม่มีวันที่สิ้นสุด ให้ใช้วันที่เริ่มต้นแทน
      updates[`${fieldPrefix}_end`] = updates[`${fieldPrefix}_start`];
    }

    // อัปเดต state
    setFilterParams((prev) => ({
      ...prev,
      ...updates,
    }));

    // ถ้ามีเพียงวันที่เริ่มต้นและยังไม่มีวันที่สิ้นสุด (หรือวันที่สิ้นสุดเท่ากับวันที่เริ่มต้น)
    // และวันที่เริ่มต้นเปลี่ยนไปจากเดิม แต่ยังไม่มีการเลือกวันที่สิ้นสุด
    // ให้ยังไม่ fetch ข้อมูลใหม่
    if (
      dates.length === 1 &&
      updates[`${fieldPrefix}_start`] !== oldStart &&
      updates[`${fieldPrefix}_end`] === updates[`${fieldPrefix}_start`]
    ) {
      // ไม่ต้องทำอะไร - จะไม่ trigger useEffect เพราะเราจะใช้ debounce
      return;
    }
  };

  const debouncedFilterParams = useDebounce(filterParams, 300);

  const handleSearch = (value: string) => {
    setFilterParams((prev) => ({
      ...prev,
      search: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when searching
  };

  const fetchHomeworkList = useCallback(async () => {
    try {
      setFetching(true);
      const apiParams: Record<string, string | number | undefined | null> = {
        ...debouncedFilterParams,
        ...filters,
        subject_id: subjectData.id,
        class_id: filters?.class_id,
      };
      const response = await API.teacherHomework.GetHomeworkList(
        Number(schoolId),
        subjectId,
        pagination.page,
        pagination.limit,
        apiParams,
        homeworkType,
      );
      if (response.status_code === 200) {
        setRecords(response.data);
        setPagination((prev) => ({
          ...prev,
          total_count: response._pagination.total_count,
        }));
      }
    } finally {
      setFetching(false);
    }
  }, [
    debouncedFilterParams,
    filters,
    pagination.page,
    pagination.limit,
    homeworkType,
    subjectData.id,
  ]);

  useEffect(() => {
    if (subjectId) fetchHomeworkList();
  }, [subjectId, fetchHomeworkList, pagination.page, pagination.limit, filters]);

  const columnDefs = useMemo<DataTableColumn<HomeworkListItem>[]>(() => {
    const finalDefs: DataTableColumn<HomeworkListItem>[] = [
      {
        accessor: 'index',
        title: '#ID',
        render: (record, index) => {
          return index + 1;
        },
      },
      { accessor: 'homework_name', title: 'ชื่อการบ้าน' },
      { accessor: 'lesson_name', title: 'บทเรียน' },
      {
        accessor: 'assign_target_list',
        title: '#มอบหมายให้',
        render: (record, index) => {
          return (
            <div>
              {record.assign_target_list?.map((item, index) => {
                return <div key={index}>{item}</div>;
              })}
            </div>
          );
        },
      },
      {
        accessor: 'started_at',
        title: 'วันที่สั่งการบ้าน',
        render: (row) => {
          return row.started_at
            ? new Date(row.started_at).toLocaleDateString('th-TH', {
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
        accessor: 'due_at',
        title: 'วันที่ส่งการบ้าน',
        render: (row) => {
          return row.due_at
            ? new Date(row.due_at).toLocaleDateString('th-TH', {
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
        accessor: 'closed_at',
        title: 'วันที่ปิดรับการบ้าน',
        render: (row) => {
          return row.closed_at
            ? new Date(row.closed_at).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })
            : '-';
        },
      },
      { accessor: 'level_count', title: 'จำนวนด่าน' },
      { accessor: 'on_time_student_count', title: 'ส่งตรงเวลา(คน)' },
      { accessor: 'late_student_count', title: 'ส่งเลท(คน)' },
      { accessor: 'doing_student_count', title: 'กำลังทำ(คน)' },
      { accessor: 'not_start_student_count', title: 'ยังไม่ได้เริ่มทำ(คน)' },
      {
        accessor: 'edit',
        title: 'ดูการบ้าน',

        render: ({ homework_id, started_at, due_at, closed_at, lesson_name }) => (
          // <Link to="./edithomework/$homework_id" params={{ homework_id }}>
          <Link
            to="./edithomework/$homework_id"
            params={{ homework_id }}
            search={{
              subject_name: subject_name,
              curriculum_group_name: curriculum_group_name,
              year_id: year_id,
              started_at: started_at,
              due_at: due_at,
              close_at: closed_at,
              lesson_name: lesson_name,
            }}
          >
            <IconSearch />
          </Link>
        ),
      },
      {
        accessor: 'archive',
        title: 'จัดเก็บ',
        // this column has custom cell data rendering
        render: (record) => {
          // const { status } = record;
          // return status === Status.NOT_IN_USE ? (
          //   <button
          //     type="button"
          //     onClick={() => {
          //       modalArchive.open();
          //     }}
          //   >
          //     <IconCornerUpLeft />
          //   </button>
          // ) : (
          //   <button
          //     type="button"
          //     onClick={() => {
          //       modalArchive.open();
          //     }}
          //   >
          //     <IconArchive />
          //   </button>
          // );
          return (
            <button
              type="button"
              onClick={() => handleCloseStatusModal(record.homework_id.toString())}
            >
              <IconArchive />
            </button>
          );
        },
      },
    ];
    return finalDefs;
  }, [pagination.page, pagination.limit]);

  const handleSelectionChange = (selectedRows: SetStateAction<HomeworkListItem[]>) => {
    setSelectedRecords(selectedRows);
  };

  const handleStatusFilterChange = (value: StatusHomework) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // สร้างวันที่ในอนาคตอีก 100 ปี
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 100);
    const farFuture = futureDate.toISOString().split('T')[0];

    // รีเซ็ตค่า filter เดิมก่อน
    const resetFilter = {
      started_at_start: '',
      started_at_end: '',
      due_at_start: '',
      due_at_end: '',
      close_at_start: '',
      close_at_end: '',
    };

    switch (value) {
      case StatusHomework.DEU:
        // การบ้านที่ต้องส่ง: ยังไม่ถึงวันปิดรับ
        setFilterParams({
          ...resetFilter,
          close_at_start: today,
          close_at_end: farFuture,
        });
        break;
      case StatusHomework.UPCOMMING:
        // การบ้านที่สั่งล่วงหน้า: ยังไม่ถึงวันสั่งการบ้าน
        setFilterParams({
          ...resetFilter,
          started_at_start: today,
          started_at_end: farFuture,
        });
        break;
      case StatusHomework.PAST:
        // การบ้านที่ผ่านมา: เลยวันที่ปิดรับแล้ว
        setFilterParams({
          ...resetFilter,
          close_at_start: '1970-01-01', // วันที่เริ่มต้นระบบคอมพิวเตอร์
          close_at_end: today,
        });
        break;
    }
    setStatusFilter(value);
  };

  const [isModalCloseStatus, setModalCloseStatus] = useState(false);
  const [isModalOpenStatus, setModalOpenStatus] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);

  const handleCloseStatusModal = (id: string) => {
    setModalCloseStatus(true);
    setSelectedStatusId(id);
  };

  const handleOpenStatusModal = (id: string) => {
    setModalOpenStatus(true);
    setSelectedStatusId(id);
  };
  const acceptCloseStatus = async () => {
    try {
      const response = await API.teacherHomework.UpdateHomeworkStatus(
        Number(selectedStatusId),
        'archived',
      );
      showMessage('ปิดใช้งานเรียบร้อย', 'success');
      fetchHomeworkList();
    } catch (error) {
      showMessage('ไม่สามารถปิดใช้งานได้', 'error');
    }
  };
  const handleOpenStatus = async () => {
    try {
      const response = await API.teacherHomework.UpdateHomeworkStatus(
        Number(selectedStatusId),
        'enabled',
      );
      showMessage('เปิดใช้งานเรียบร้อย', 'success');
      fetchHomeworkList();
    } catch (error) {
      showMessage('ไม่สามารถเปิดใช้งานได้', 'error');
    }
  };

  const closeStatus = async (id: string) => {
    try {
      const response = await API.teacherHomework.UpdateHomeworkStatus(
        Number(id),
        'archived',
      );
      showMessage('ปิดใช้งานเรียบร้อย', 'success');
      fetchHomeworkList();
    } catch (error) {
      showMessage('ไม่สามารถปิดใช้งานได้', 'error');
    }
  };

  const openStatus = async (id: string) => {
    try {
      const response = await API.teacherHomework.UpdateHomeworkTemplateStatus(
        Number(id),
        'enabled',
      );
      showMessage('เปิดใช้งานเรียบร้อย', 'success');
      fetchHomeworkList();
    } catch (error) {
      showMessage('ไม่สามารถปิดใช้งานได้', 'error');
    }
  };

  const handleBulkEdit = async (status: 'enabled' | 'disabled' | 'archived') => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }

    selectedRecords.forEach(async (record) => {
      if (status === 'enabled') {
        await closeStatus(record.homework_id.toString());
      } else {
        await openStatus(record.homework_id.toString());
      }
    });
    fetchHomeworkList();
  };

  const yearOptions = useMemo(
    () =>
      years?.map((year) => ({
        label: year.year_name,
        value: year.id.toString(),
      })),
    [years],
  );

  const classOptions = useMemo(
    () =>
      classes?.map((cls) => ({
        label: cls.class_name,
        value: cls.id.toString(),
      })),
    [classes],
  );

  return (
    <ScreenTemplateWithoutHeader>
      <div className="w-full">
        <CWBreadcrumbs
          links={[
            { label: 'การเรียนการสอน', href: '#' },
            { label: 'การบ้าน', href: '#' },
          ]}
        />

        <div className="mb-5 mt-10 flex w-full flex-col gap-3">
          <h1 className="text-[26px] font-bold">การบ้าน</h1>
          <p>{pagination.total_count ?? 0} รายการ</p>
        </div>

        <WhiteBox>
          <div className="w-full">
            {/* Top Bar */}
            <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link
                  to="./create"
                  params={{ subjectId: subject_id }}
                  search={{
                    subject_name: subject_name,
                    curriculum_group_name: curriculum_group_name,
                    year_name: year_name || '',
                    subject_id: subject_id,
                    year_id: year_id,
                  }}
                  className="w-full"
                >
                  <CWButton
                    title="สั่งการบ้าน"
                    onClick={ClickGoCreate}
                    icon={<IconPlus />}
                    className="w-full"
                    parentClassname="w-full"
                  />
                </Link>

                <div className="hidden h-6 border-l border-neutral-300 sm:block" />
              </div>
            </div>

            {/* Filter Accordion */}
            <CWMAccordion title="ตัวกรอง" headerClassName="bg-[#D5DDFF] mt-5 ">
              <div className="mt-3 space-y-4 bg-[#F0F3FF] p-3 p-4 shadow-[0px_1px_3px_0px_#0000001A,_0px_1px_2px_0px_#0000001A]">
                <CWInputSearch
                  className="w-full"
                  placeholder="ค้นหา"
                  onChange={(e) => handleSearch(e.target.value)}
                  value={filterParams.search as string}
                />
                <div className="flex items-center gap-4">
                  <CWClassSelector classes={filters} />
                </div>

                <div>
                  <SelectUserSubjectData />
                </div>

                <div className="flex gap-4">
                  <WCAInputDateFlat
                    placeholder="วันที่สั่งการบ้าน"
                    options={{
                      mode: 'range',
                      dateFormat: 'd/m/Y',
                      allowInput: true,
                      disableMobile: true,
                    }}
                    onChange={handleDateRangeChange('started_at')}
                    className="w-full"
                    hideIcon
                  />

                  <WCAInputDateFlat
                    placeholder="วันกำหนดส่ง"
                    options={{
                      mode: 'range',
                      dateFormat: 'd/m/Y',
                    }}
                    onChange={handleDateRangeChange('due_at')}
                    className="w-full"
                    hideIcon
                  />
                </div>

                <div>
                  <WCAInputDateFlat
                    placeholder="วันปิดรับ"
                    options={{
                      mode: 'range',
                      dateFormat: 'd/m/Y',
                    }}
                    onChange={handleDateRangeChange('close_at')}
                    className="w-full"
                    hideIcon
                  />
                </div>
              </div>
            </CWMAccordion>

            <div>
              <div className="mt-5 w-full">
                <CWSelect
                  className="w-full"
                  value={homeworkType}
                  onChange={(e) => setHomeworkType(e.target.value)}
                  options={[
                    { value: 'must_send', label: 'การบ้านที่ต้องส่ง' },
                    { value: 'pre-ahead', label: 'การบ้านที่สั่งล่วงหน้า' },
                    { value: 'archived', label: 'การบ้านที่ผ่านมา' },
                  ]}
                  hideEmptyOption
                />
              </div>

              <div className="mt-5">
                <DataTable
                  fetching={fetching}
                  className="table-hover mantine-mobile-layout whitespace-nowrap"
                  columns={columnDefs}
                  records={records}
                  totalRecords={pagination.total_count}
                  recordsPerPage={pagination.limit}
                  page={pagination.page}
                  onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                  onRecordsPerPageChange={(limit) => {
                    setPagination((prev) => ({ ...prev, limit, page: 1 }));
                  }}
                  recordsPerPageOptions={pageSizeOptions}
                  paginationText={({ from, to, totalRecords }) =>
                    `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
                  }
                  idAccessor="homework_id"
                  minHeight={200}
                />
              </div>
              <ModalArchive
                open={modalArchive.isOpen}
                onClose={modalArchive.close}
                title={'จัดเก็บถาวร'}
              />
              <div className="mt-10 flex w-full items-center justify-between pb-5"></div>
            </div>
          </div>
        </WhiteBox>

        <ModalCloseAccount
          isOpen={isModalCloseStatus}
          onClose={() => setModalCloseStatus(false)}
          onAccept={acceptCloseStatus}
          selectedUserId={selectedStatusId}
        />
        <ModalOpenStatus
          isOpen={isModalOpenStatus}
          onClose={() => setModalOpenStatus(false)}
          onAccept={handleOpenStatus}
          selectedStatusId={selectedStatusId}
        />
      </div>
      <div className="mt-4 flex justify-center">
        <FooterMenu />
      </div>
    </ScreenTemplateWithoutHeader>
  );
};

export default DomainJSX;
