import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';

import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import TitleBack from '@core/design-system/library/component/web/TitleBack';
import CWInputSearch from '@component/web/cw-input-search';
import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import Tabs from '@component/web/cw-tabs';

import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import showMessage from '@global/utils/showMessage';

import API from '../local/api';
import StoreGlobal from '@global/store/global';
import StoreGlobalPersist from '@store/global/persist';
import { HomeworkTemplateItem, Status } from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import LineLiffPage from '../../local/component/web/template/cw-t-lineliff-page';
import { ModalOpenStatus } from '../g05-d01-p02-template-one/components/ModalOpenAccount';
import { ModalCloseAccount } from '../g05-d01-p02-template-one/components/ModalCloseAccount';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { subjectId } = useParams({ strict: false });
  const search = useSearch({ strict: false });
  const { subject_name, curriculum_group_name, year_name, year_id } = search;

  const gotoCreate = () => {
    navigate({
      to: `../${subjectId}/create`,
      search: { subject_name, curriculum_group_name, year_name, year_id },
    });
  };

  const modalDownload = useModal();
  const modalUpload = useModal();
  const modalArchive = useModal();
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/teacher/homework/homework') {
        navigate({ to: '/teacher/homework/homework' });
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedRecords, setSelectedRecords] = useState<HomeworkTemplateItem[]>([]);
  const [records, setRecords] = useState<HomeworkTemplateItem[]>([]);
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

  const fetchData = async () => {
    setFetching(true);
    try {
      const response = await API.teacherHomework.GetHomeworkTemplateList(
        globalUserData.school_id || 1,
        subjectId,
        pagination.page,
        pagination.limit,
        { lession_name: selectedLesson, status: statusFilter },
      );
      setRecords(response.data);
      setPagination((prev) => ({
        ...prev,
        total_count: response._pagination.total_count,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, statusFilter, selectedLesson]);

  const columnDefs = useMemo<DataTableColumn<HomeworkTemplateItem>[]>(
    () => [
      {
        accessor: 'edit',
        title: 'ดูรายละเอียด',
        render: ({ id }) => (
          <Link
            to="./$templateId"
            params={{ templateId: id }}
            search={{ subject_name, curriculum_group_name, year_name, year_id }}
          >
            <IconEye />
          </Link>
        ),
      },
      { accessor: 'homework_template_name', title: 'ชื่อการบ้าน' },
      { accessor: 'lesson_name', title: 'บทเรียน' },
      { accessor: 'level_count', title: 'จำนวนด่าน' },
      {
        accessor: 'actions',
        title: 'ปิดใช้งาน',
        render: (row) =>
          row.status === 'enabled' ? (
            <button
              type="button"
              className="whitespace-nowrap px-2"
              onClick={() => handleCloseStatusModal(row.id.toString())}
            >
              <IconArchive />
            </button>
          ) : (
            <button
              type="button"
              className="whitespace-nowrap px-2"
              onClick={() => handleOpenStatusModal(row.id.toString())}
            >
              <IconCornerUpLeft />
            </button>
          ),
      },
    ],
    [subject_name, curriculum_group_name, year_name, year_id],
  );

  const handleSelectionChange = (selectedRows: HomeworkTemplateItem[]) => {
    setSelectedRecords(selectedRows);
  };

  const handleLessonChange = (value: number) => {
    setSelectedLessonId(value);
    const selectedOption = lessonOptions.find((option) => option.value === value);
    setSelectedLesson(selectedOption?.label || '');
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
      await API.teacherHomework.UpdateHomeworkTemplateStatus(
        Number(selectedStatusId),
        'disabled',
      );
      showMessage('ปิดใช้งานเรียบร้อย', 'success');
      fetchData();
    } catch (error) {
      showMessage('ไม่สามารถปิดใช้งานได้', 'error');
    }
  };

  const handleOpenStatus = async () => {
    try {
      await API.teacherHomework.UpdateHomeworkTemplateStatus(
        Number(selectedStatusId),
        'enabled',
      );
      showMessage('เปิดใช้งานเรียบร้อย', 'success');
      fetchData();
    } catch (error) {
      showMessage('ไม่สามารถเปิดใช้งานได้', 'error');
    }
  };

  const closeStatus = async (id: string) => {
    try {
      await API.teacherHomework.UpdateHomeworkTemplateStatus(Number(id), 'disabled');
      showMessage('ปิดใช้งานเรียบร้อย', 'success');
      fetchData();
    } catch (error) {
      showMessage('ไม่สามารถปิดใช้งานได้', 'error');
    }
  };

  const openStatus = async (id: string) => {
    try {
      await API.teacherHomework.UpdateHomeworkTemplateStatus(Number(id), 'enabled');
      showMessage('เปิดใช้งานเรียบร้อย', 'success');
      fetchData();
    } catch (error) {
      showMessage('ไม่สามารถเปิดใช้งานได้', 'error');
    }
  };

  const handleBulkEdit = async (status: 'enabled' | 'disabled') => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }
    for (const record of selectedRecords) {
      if (status === 'enabled') {
        await openStatus(record.id.toString());
      } else {
        await closeStatus(record.id.toString());
      }
    }
    fetchData();
  };

  return (
    <LineLiffPage className="flex w-full flex-col items-center p-5">
      <CWBreadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '#' },
          { label: 'การบ้าน', href: '#' },
        ]}
      />
      <div className="my-10 flex w-full flex-col gap-3">
        <TitleBack
          label={`${curriculum_group_name} / ${year_name} / ${subject_name}`}
          href="../"
        />
      </div>
      <div className="mt-5 w-full">
        <CWWhiteBox>
          <div className="w-full">
            <div className="flex flex-col justify-between py-5">
              <div className="flex flex-col gap-5">
                <div className="dropdown">
                  <Dropdown
                    placement="bottom-start"
                    btnClassName="btn btn-primary dropdown-toggle gap-1 w-full"
                    button={
                      <>
                        Bulk Edit
                        <IconCaretDown />
                      </>
                    }
                  >
                    <ul className="w-full">
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
                <CWButton onClick={gotoCreate} title="สร้างการบ้าน" icon={<IconPlus />} />
                <CWInputSearch placeholder="ค้นหา" />
              </div>
            </div>
            <div className="mt-8 w-full">
              <div className="flex w-full border-b">
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
              <div className="mt-5 w-full">
                <DataTable
                  fetching={fetching}
                  className="table-hover whitespace-nowrap"
                  columns={columnDefs}
                  records={records}
                  totalRecords={pagination.total_count}
                  recordsPerPage={pagination.limit}
                  page={pagination.page}
                  onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
                  onRecordsPerPageChange={(limit) =>
                    setPagination((prev) => ({ ...prev, limit, page: 1 }))
                  }
                  recordsPerPageOptions={pageSizeOptions}
                  paginationText={({ from, to, totalRecords }) =>
                    `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
                  }
                  selectedRecords={selectedRecords}
                  onSelectedRecordsChange={handleSelectionChange}
                />
              </div>
            </div>
          </div>
        </CWWhiteBox>
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
    </LineLiffPage>
  );
};

export default DomainJSX;
