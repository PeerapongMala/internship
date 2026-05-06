// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';

import { Select } from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Level, Status, StatusToggle, SubLesson, Tier } from '../local/type';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import showMessage from '@global/utils/showMessage';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import Tabs from '@component/web/cw-tabs';
import CWWhiteBox from '@component/web/cw-white-box';
import CWInputSearch from '@component/web/cw-input-search';
import IconUpload from '@component/web/atom/wc-a-icons/IconUpload';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import CWButton from '@component/web/cw-button';
import CWSelect from '@component/web/cw-select';
import LessonRestAPI from '../local/api/group/lesson/restapi';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import ScreenTemplateWithoutHeader from '@domain/g05/local/component/web/template/cw-t-line-layout-without-text';
import CWPagination from '@component/web/cw-pagination';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import usePagination from '@global/hooks/usePagination';

interface Option {
  value: string;
  label: string;
}

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const levelTypeOptions = [
  { value: 'test', label: 'แบบทดสอบ' },
  { value: 'sub-lesson-post', label: 'แบบฝึกหัดท้ายบท' },
  { value: 'pre-post-test', label: 'แบบทดสอบก่อน-หลังเรียน' },
];

const questionTypeOptions = [
  { value: 'multiple-choices', label: 'ปรนัยแบบเลือกตอบ' },
  { value: 'pairing', label: 'จับคู่' },
  { value: 'sorting', label: 'เรียงลำดับ' },
  { value: 'placeholder', label: 'เติมคำในช่องว่าง' },
  { value: 'input', label: 'พิมพ์คำตอบ' },
];

const difficultyOptions = [
  { value: 'easy', label: 'ง่าย' },
  { value: 'medium', label: 'ปานกลาง' },
  { value: 'hard', label: 'ยาก' },
];

const DomainJSX = () => {
  const [opacity, opacitySet] = useState(1);
  const navigate = useNavigate();
  const { studentId, classId, subjectId, lessonId, sublessonId } = useParams({
    from: '/line/parent/clever/$studentId/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId',
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      setIsMobile(false);
      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
        setIsMobile(true);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const modalAdditem = useModal();
  const modalDownload = useModal();

  const [selectedRecords, setSelectedRecords] = useState<Level[]>([]);
  const [records, setRecords] = useState<Level[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { pagination, setPagination } = usePagination();
  const refUpload = useRef<HTMLInputElement>(null);
  const [fetching, setFetching] = useState(false);
  const [levelTypeFilter, setLevelTypeFilter] = useState<string>();
  const [questionTypeFilter, setQuestionTypeFilter] = useState<string>();
  const [difficultyFilter, setDifficultyFilter] = useState<string>();
  const [subLessonData, setSubLessonData] = useState<SubLesson>();

  const fetchLevels = async () => {
    try {
      setFetching(true);
      const response = await LessonRestAPI.GetLevels(
        classId,
        Number(sublessonId),
        pagination.page,
        pagination.limit,
        statusFilter,
        levelTypeFilter,
        questionTypeFilter,
        difficultyFilter,
      );

      setRecords(response.data);
      setPagination((prev) => ({
        ...prev,
        total_count: response._pagination.total_count,
      }));
    } catch (error) {
      console.error('Failed to fetch levels:', error);
      showMessage('ไม่สามารถโหลดข้อมูลระดับได้', 'error');
    } finally {
      setFetching(false);
    }
  };

  const fetchSubLessons = async () => {
    console.log('subjectId', lessonId);
    try {
      setFetching(true);
      const response = await LessonRestAPI.GetSubLessons(
        classId,
        Number(lessonId),
        pagination.page,
        pagination.limit,
        undefined,
        sublessonId,
      );

      const transformedData: SubLesson[] = response.data.map((item) => ({
        id: item.sub_lesson_id,
        curriculum_group_short_name: item.curriculum_group,
        subject: item.subject,
        year: item.year,
        sublesson_name: item.sub_lesson_name,
        is_enabled: item.is_enabled,
      }));

      setSubLessonData(transformedData[0]);
    } catch (error) {
      console.error('Failed to fetch sub-lessons:', error);
      showMessage('ไม่สามารถโหลดข้อมูลบทเรียนย่อยได้', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLevels();
    fetchSubLessons();
  }, [
    pagination.page,
    pagination.limit,
    statusFilter,
    levelTypeFilter,
    questionTypeFilter,
    difficultyFilter,
    sublessonId,
  ]);

  const columnDefs = useMemo<DataTableColumn<Level>[]>(() => {
    const finalDefs: DataTableColumn<Level>[] = [
      // {
      //     accessor: "index",
      //     title: "#",
      //     render: (record, index) => {
      //         return index + 1;
      //     },
      // },
      { accessor: 'id', title: 'รหัสด่าน' },
      { accessor: 'level_index', title: 'ด่านที่' },
      { accessor: 'level_type', title: 'ประเภท' },
      { accessor: 'question_type', title: 'รูปแบบคำถาม' },
      {
        accessor: 'difficulty',
        title: 'ระดับ',
        render: ({ difficulty }) => {
          if (difficulty === 'easy')
            return <span className="badge badge-outline-success">ง่าย</span>;
          else if (difficulty === 'medium')
            return <span className="badge badge-outline-warning">ปานกลาง</span>;
          else if (difficulty === 'hard')
            return <span className="badge badge-outline-danger">ยาก</span>;
        },
      },
      { accessor: 'question_amount', title: 'จำนวนคำถาม' },
      {
        accessor: 'edit',
        title: 'ดูคำถาม',

        render: ({ id }) => (
          <Link
            to="/line/parent/clever/$studentId/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId/level/$levelId"
            params={{ studentId, classId, subjectId, lessonId, sublessonId, levelId: id }}
          >
            <IconSearch />
          </Link>
        ),
      },
    ];

    return finalDefs;
  }, [statusFilter]);
  const handleSelectionChange = (selectedRows: SetStateAction<Level[]>) => {
    setSelectedRecords(selectedRows);
  };
  const handleBulkEdit = (status: StatusToggle) => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }

    const updatedRecords = records.map((record) =>
      selectedRecords.some((selected) => selected.id === record.id)
        ? { ...record, status }
        : record,
    );

    setRecords(updatedRecords);
    showMessage('Bulk edit simulated successfully');
  };

  const paginatedRecords = useMemo(() => {
    return records.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit,
    );
  }, [records, pagination.page, pagination.limit]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  return (
    <ScreenTemplateWithoutHeader>
      <div className="w-full">
        <div className="mt-5">
          <div className="relative flex w-full items-center justify-center sm:justify-start">
            <div className="absolute left-0">
              <CWTitleBack
                label=""
                href={`/line/parent/clever/${studentId}/${classId}/subject/${subjectId}/${lessonId}`}
              />
            </div>

            <p className="text-center text-[26px] font-bold sm:pl-10 sm:text-left">
              จัดการด่าน
            </p>
          </div>
        </div>

        <div className="mt-5 flex w-full flex-col rounded-md bg-neutral-100 px-2 py-3">
          <div className="flex">
            <h1 className="text-[24px] font-bold">{subLessonData?.sublesson_name}</h1>
          </div>
          <div className="mt-3">
            {subLessonData?.curriculum_group_short_name} / {subLessonData?.subject} /{' '}
            {subLessonData?.year} / {subLessonData?.sublesson_name}
          </div>
        </div>
        <div className="mt-5 w-full">
          <div className="flex flex-col gap-4 sm:h-[38px] sm:w-full sm:flex-row sm:items-center">
            <CWSelect
              title="ประเภทด่าน"
              className="w-full sm:w-[250px]"
              options={levelTypeOptions}
              value={levelTypeFilter}
              onChange={(e) => {
                setLevelTypeFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
            <CWSelect
              title="รูปแบบคำถาม"
              className="w-full sm:w-[250px]"
              options={questionTypeOptions}
              value={questionTypeFilter}
              onChange={(e) => {
                setQuestionTypeFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
            <CWSelect
              title="ระดับ"
              className="w-full sm:w-[250px]"
              options={difficultyOptions}
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
          </div>

          <div className="w-full">
            <div className="my-5">
              <Tabs
                currentTab={statusFilter}
                setCurrentTab={(value) => setStatusFilter(value)}
                tabs={[
                  { label: 'ทั้งหมด', value: undefined },
                  { label: 'ใช้งาน', value: 'enabled' },
                  { label: 'ไม่ใช้งาน', value: 'disabled' },
                ]}
              />
            </div>

            <CWWhiteBox>
              <div>
                <div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {/* <div className="dropdown">
                      <Dropdown
                        placement={'bottom-start'}
                        btnClassName="btn btn-primary dropdown-toggle gap-1"
                        button={
                          <>
                            Bulk Edit
                            <IconCaretDown />
                          </>
                        }
                      >
                        <ul className="!min-w-[170px]">
                          <li>
                            <button
                              type="button"
                              className="w-full"
                              onClick={() => handleBulkEdit(StatusToggle.ON)}
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
                              onClick={() => handleBulkEdit(StatusToggle.OFF)}
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
                    <p className="hidden border-0 border-l border-neutral-300 sm:block" /> */}
                    <CWInputSearch className="w-full sm:w-[250px]" placeholder="ค้นหา" />
                  </div>
                </div>

                <div className="mt-5 w-full">
                  <DataTable
                    className="table-hover mantine-mobile-layout whitespace-nowrap"
                    columns={columnDefs}
                    records={records}
                    classNames={{
                      pagination: isMobile ? 'justify-center' : '',
                    }}
                    minHeight={200}
                    noRecordsText="ไม่พบข้อมูล"
                  />
                </div>
              </div>
              <div className="mt-5">
                <CWPagination
                  currentPage={pagination.page}
                  totalPages={Math.ceil(pagination.total_count / pagination.limit)}
                  onPageChange={handlePageChange}
                  pageSize={pagination.limit}
                  setPageSize={handlePageSizeChange}
                />
              </div>
            </CWWhiteBox>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-center">
          <FooterMenu />
        </div>
      </div>
    </ScreenTemplateWithoutHeader>
  );
};

export default DomainJSX;
