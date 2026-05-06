// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';

import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import CWTitleBack from '@component/web/cw-title-back';
import CWInputSearch from '@component/web/cw-input-search';
import CWSelect from '@component/web/cw-select';
import CWButton from '@component/web/cw-button';
import CWModalUpload from '@component/web/cw-modal/cw-modal-upload';
import { ModalCloseAccount } from './components/ModalCloseAccount';
import { ModalOpenStatus } from './components/ModalOpenAccount';

import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { optionYear, optionSubject, optionLesson } from '../local/options';
import { HomeworkTemplateItem, StatusTemplate, Status } from '../local/type';
// import { Status } from '../local/api/group/teacher-homework/restapi';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import showMessage from '@global/utils/showMessage';
import Tabs from '@component/web/cw-tabs';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import API from '../local/api';
import StoreGlobalPersist from '@store/global/persist';
import { useSearchParams } from 'react-router-dom';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import usePagination from '@global/hooks/usePagination';

// const mockData: HomeworkTemplate[] = [
//   {
//     id: 2,
//     year_name: 'ประถมศึกษาปีที่ 4',
//     year_short_name: 'ป.4',
//     homework_template_name: 'template2',
//     subject_name: 'ภาษาอังกฤษ',
//     lesson_id: 1,
//     lesson_name: 'Lesson 1',
//     level_count: 1,
//     status: Status.DRAFT,
//   },
//   {
//     id: 5,
//     year_name: 'ประถมศึกษาปีที่ 4',
//     year_short_name: 'ป.4',
//     homework_template_name: 'template2',
//     subject_name: 'ภาษาอังกฤษ',
//     lesson_id: 1,
//     lesson_name: 'Lesson 1',
//     level_count: 1,
//     status: Status.DRAFT,
//   },
//   {
//     id: 6,
//     year_name: 'ประถมศึกษาปีที่ 4',
//     year_short_name: 'ป.4',
//     homework_template_name: 'template2',
//     subject_name: 'ภาษาอังกฤษ',
//     lesson_id: 1,
//     lesson_name: 'Lesson 1',
//     level_count: 1,
//     status: Status.DRAFT,
//   },
// ];

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { subjectId } = useParams({ strict: false });
  const search = useSearch({ strict: false });
  const { subject_name, curriculum_group_name, year_name, year_id } = search;
  const gotoCreate = () => {
    navigate({
      to: `../${subjectId}/create`,
      search: {
        subject_name,
        curriculum_group_name,
        year_name,
        year_id,
      },
    });
  };
  const { userData, targetData, isLoginAs } = StoreGlobalPersist.StateGet([
    'userData',
    'targetData',
    'isLoginAs',
  ]);
  const schoolId = isLoginAs ? targetData?.school_id : userData?.school_id;

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      if (isMobile && window.location.pathname !== '/line/teacher/homework/homework') {
        navigate({ to: '/line/teacher/homework/homework' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<HomeworkTemplateItem[]>([]);
  const [initialStateRecords, setInitialStateRecords] =
    useState<HomeworkTemplateItem[]>();
  const [records, setRecords] = useState<HomeworkTemplateItem[]>();
  const [statusFilter, setStatusFilter] = useState<Status | undefined>();
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [lessonOptions, setLessonOptions] = useState<{ value: number; label: string }[]>(
    [],
  );

  const [selectedLesson, setSelectedLesson] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<number | ''>('');

  const fetchLessonList = async () => {
    try {
      const response = await API.teacherHomework.GetLessonList(Number(subjectId));
      const options = response.data.map((lesson) => ({
        value: lesson.id,
        label: lesson.lesson_name,
      }));
      setLessonOptions(options);
    } catch (error) {
      console.error('Error fetching lesson list:', error);
      showMessage('ไม่สามารถดึงข้อมูลบทเรียนได้', 'error');
    }
  };

  useEffect(() => {
    if (subjectId) {
      fetchLessonList();
    }
  }, [subjectId]);

  const fetchMockData = async () => {
    setFetching(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await API.teacherHomework.GetHomeworkTemplateList(
        schoolId,
        subjectId,
        pagination.page,
        pagination.limit,
        {
          lession_name: selectedLesson,
          status: statusFilter,
        },
      );
      setRecords(response.data);
      setPagination((prev) => ({
        ...prev,
        total_count: response._pagination.total_count,
      }));
      setFetching(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMockData();
  }, [pagination.page, pagination.limit, statusFilter, selectedLesson]);

  const columnDefs = useMemo<DataTableColumn<HomeworkTemplateItem>[]>(() => {
    const finalDefs: DataTableColumn<HomeworkTemplateItem>[] = [
      // {
      //     accessor: "index",
      //     title: "#ID",
      //     render: (record, index) => {
      //         return index + 1;
      //     },
      // },
      { accessor: 'homework_template_name', title: 'ชื่อการบ้าน' },
      { accessor: 'lesson_name', title: 'บทเรียน' },
      { accessor: 'level_count', title: 'จำนวนด่าน' },
      {
        accessor: 'edit',
        title: 'แก้ไข',

        render: ({ id }) => (
          <Link
            to="./edittemplate/$templateId"
            params={{ templateId: id }}
            search={{
              subject_name,
              curriculum_group_name,
              year_name,
              year_id,
            }}
          >
            <IconPen />
          </Link>
        ),
      },
      {
        accessor: 'actions',
        title: 'ปิดใช้งาน',
        render: (row) =>
          row.status === 'enabled' ? (
            <button
              type="button"
              className="w-2 whitespace-nowrap !px-2"
              onClick={() => handleCloseStatusModal(row.id.toString())}
            >
              <IconArchive />
            </button>
          ) : (
            <button
              type="button"
              className="w-2 whitespace-nowrap !px-2"
              onClick={() => handleOpenStatusModal(row.id.toString())}
            >
              <IconCornerUpLeft />
            </button>
          ),
      },
    ];
    return finalDefs;
  }, []);

  const handleSelectionChange = (
    selectedRows: SetStateAction<HomeworkTemplateItem[]>,
  ) => {
    setSelectedRecords(selectedRows);
  };
  //   const handleBulkEdit = (status: Status) => {
  //     if (selectedRecords.length === 0) {
  //       showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
  //       return;
  //     }
  //     const updatedRecords = records.map((record) =>
  //       selectedRecords.some((selected) => selected.id === record.id)
  //         ? { ...record, status }
  //         : record,
  //     );
  //     setRecords(updatedRecords);
  //     showMessage('Bulk edit successfully');
  //   };
  //   const paginatedRecords = useMemo(() => {
  //     return records.slice(
  //       (pagination.page - 1) * pagination.limit,
  //       pagination.page * pagination.limit,
  //     );
  //   }, [records, pagination.page, pagination.limit]);

  const handleLessonChange = (value: number) => {
    console.log('Selected lesson:', value);
    setSelectedLessonId(value);
    const selectedOption = lessonOptions.find((option) => option.value === value);
    setSelectedLesson(selectedOption?.label || '');
  };
  const [isModalCloseStatus, setModalCloseStatus] = useState(false);
  const [isModalOpenStatus, setModalOpenStatus] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);

  const handleCloseStatusModal = (id: string) => {
    console.log('handleCloseStatus');
    setModalCloseStatus(true);
    setSelectedStatusId(id);
  };

  const handleOpenStatusModal = (id: string) => {
    console.log('handleOpenStatus');
    setModalOpenStatus(true);
    setSelectedStatusId(id);
  };
  const acceptCloseStatus = async () => {
    try {
      const response = await API.teacherHomework.UpdateHomeworkTemplateStatus(
        Number(selectedStatusId),
        'disabled',
      );
      showMessage('ปิดใช้งานเรียบร้อย', 'success');
      fetchMockData();
    } catch (error) {
      showMessage('ไม่สามารถปิดใช้งานได้', 'error');
    }
  };
  const handleOpenStatus = async () => {
    try {
      const response = await API.teacherHomework.UpdateHomeworkTemplateStatus(
        Number(selectedStatusId),
        'enabled',
      );
      showMessage('เปิดใช้งานเรียบร้อย', 'success');
      fetchMockData();
    } catch (error) {
      showMessage('ไม่สามารถเปิดใช้งานได้', 'error');
    }
  };

  const closeStatus = async (id: string) => {
    try {
      const response = await API.teacherHomework.UpdateHomeworkTemplateStatus(
        Number(id),
        'disabled',
      );
      showMessage('ปิดใช้งานเรียบร้อย', 'success');
      fetchMockData();
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
      fetchMockData();
    } catch (error) {
      showMessage('ไม่สามารถปิดใช้งานได้', 'error');
    }
  };

  const handleBulkEdit = async (status: 'enabled' | 'disabled') => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }

    selectedRecords.forEach(async (record) => {
      if (status === 'enabled') {
        await openStatus(record.id.toString());
      } else {
        await closeStatus(record.id.toString());
      }
    });
    fetchMockData();
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'การบ้าน', href: '#' },
        ]}
      />

      <div className="my-10 flex w-full flex-col gap-3">
        <CWTitleBack
          label={`${curriculum_group_name} / ${year_name} / ${subject_name}`}
          href="../"
        />
        {/* <p>{initialStateRecords.length} รายการ</p> */}
      </div>

      <div className="mt-5 h-auto w-full rounded-xl bg-white shadow-md">
        <div className="w-full px-5">
          <div className="flex w-full flex-col justify-between py-5 lg:flex-row">
            <div className="flex flex-col items-center gap-5 lg:flex-row">
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
                        onClick={() => handleBulkEdit('enabled')}
                      >
                        <div className="flex w-full justify-between">
                          <span>เปิดใช้งาน</span>
                          <IconCornerUpLeft />
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="w-full"
                        onClick={() => handleBulkEdit('disabled')}
                      >
                        <div className="flex w-full justify-between">
                          <span>ปิดใช้งาน</span>
                          <IconArchive />
                        </div>
                      </button>
                    </li>
                  </ul>
                </Dropdown>
              </div>
              <CWButton onClick={gotoCreate} title={'สร้างการบ้าน'} icon={<IconPlus />} />
              <CWInputSearch placeholder="ค้นหา" />
            </div>
          </div>
          <div className="mt-5 flex w-full flex-col items-center gap-5 lg:flex-row">
            <CWSelect
              options={lessonOptions}
              required={false}
              className="w-[250px]"
              value={selectedLessonId}
              onChange={(e) => handleLessonChange(Number(e.target.value))}
              title="บทเรียน"
            />
          </div>

          <div className="mt-8">
            <div className="flex w-full border-b-[1px]">
              <Tabs
                currentTab={statusFilter}
                setCurrentTab={(value) => setStatusFilter(value)}
                tabs={[
                  { label: 'ทั้งหมด', value: undefined },
                  { label: 'ใช้งาน', value: Status.IN_USE },
                  { label: 'ไม่ใช้งาน', value: Status.NOT_IN_USE },
                ]}
              />
            </div>
            <div className="mt-5">
              <DataTable
                fetching={fetching}
                className="table-hover whitespace-nowrap"
                columns={columnDefs}
                records={records}
                totalRecords={pagination.total_count}
                recordsPerPage={pagination.limit}
                page={pagination.page}
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
                minHeight={200}
              />
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default DomainJSX;
