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
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import CWInputSearch from '@component/web/cw-input-search';
import IconUpload from '@component/web/atom/wc-a-icons/IconUpload';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import CWButton from '@component/web/cw-button';
import CWSelect from '@component/web/cw-select';
import LessonRestAPI from '../local/api/group/lesson/restapi';
import { getDifficulty, getLevelType, getQuestionType } from '@global/utils/levelConvert';
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
  { value: 'test', label: 'แบบฝึกหัด' },
  { value: 'sub-lesson-post-test', label: 'แบบฝึกหัดท้ายบทเรียนย่อย' },
  { value: 'pre-post-test', label: 'แบบฝึกหัดก่อนเรียน' },
];

const questionTypeOptions = [
  { value: 'multiple-choices', label: 'คำถามปรนัย (Multiple Choices)' },
  { value: 'pairing', label: 'คำถามแบบจับคู่ (Pairing)' },
  { value: 'sorting', label: 'คำถามแบบเรียงลำดับ (Sorting)' },
  { value: 'placeholder', label: 'คำถามแบบมีตัวเลือก (Placeholder)' },
  { value: 'input', label: 'คำถามแบบเติมคำ (Input)' },
];

const difficultyOptions = [
  { value: 'easy', label: 'ง่าย' },
  { value: 'medium', label: 'ปานกลาง' },
  { value: 'hard', label: 'ยาก' },
];

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { classId, lessonId, sublessonId, subjectId } = useParams({
    // from: '/teacher/lesson/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId',
    strict: false,
  });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [selectedRecords, setSelectedRecords] = useState<Level[]>([]);
  const [records, setRecords] = useState<Level[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
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
      { accessor: 'level_index', title: 'ด่านที่', width: 80 },
      {
        accessor: 'level_type',
        title: 'ประเภท',
        width: 200,
        render: (record) => getLevelType(record?.level_type),
      },
      {
        accessor: 'question_type',
        title: 'รูปแบบคำถาม',
        width: 280,
        render: (record) => getQuestionType(record?.question_type),
      },
      {
        accessor: 'difficulty',
        title: 'ระดับ',
        width: 120,
        render: (record) => getDifficulty(record?.difficulty),
      },
      { accessor: 'question_amount', title: 'จำนวนคำถาม', width: 200 },
      {
        accessor: 'edit',
        title: 'ดูคำถาม',
        render: ({ id }) => (
          <Link
            to="/teacher/lesson/$classId/subject/$subjectId/$lessonId/sublesson/$sublessonId/level/$levelId"
            params={{ classId, subjectId, lessonId, sublessonId, levelId: id }}
          >
            <IconSearch />
          </Link>
        ),
      },
    ];

    return finalDefs;
  }, [statusFilter, pagination.page, pagination.limit]);

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

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน' },
          { label: 'จัดการห้องเรียน' },
          { label: 'จัดการบทเรียน' },
          { label: 'จัดการบทเรียนย่อย' },
          { label: 'จัดการด่าน' },
        ]}
      />
      <div className="mt-5">
        <CWTitleBack
          label="จัดการด่าน"
          href={`/teacher/lesson/${classId}/subject/${subjectId}/${lessonId}`}
        />
      </div>

      <div className="mt-5 flex w-full flex-col rounded-md bg-gray-100 px-2 py-3">
        <div className="flex">
          <h1 className="text-[24px] font-bold">{subLessonData?.sublesson_name}</h1>
        </div>
        <div className="mt-3">
          {subLessonData?.curriculum_group_short_name} / {subLessonData?.subject} /{' '}
          {subLessonData?.year}
        </div>
      </div>
      <div className="mt-5 w-full">
        <div className="flex w-full gap-5">
          <CWSelect
            title="ประเภทด่าน"
            className="w-[250px]"
            options={levelTypeOptions}
            value={levelTypeFilter}
            onChange={(e) => {
              setLevelTypeFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />
          <CWSelect
            title="รูปแบบคำถาม"
            className="w-[250px]"
            options={questionTypeOptions}
            value={questionTypeFilter}
            onChange={(e) => {
              setQuestionTypeFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />
          <CWSelect
            title="ระดับ"
            className="w-[250px]"
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
            <div className="w-full">
              <div className="flex w-full justify-between">
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
                </div>

                <div>
                  <div className="flex gap-x-[10px]">
                    {/* <CWButton
                      onClick={modalDownload.open}
                      icon={<IconDownload />}
                      title="Download"
                    /> */}
                    {/* <CWModalDownload
                      // onDownload={onConfirmDownload}
                      // startDate={startDate}
                      // endDate={endDate}
                      // setStartDate={setStartDate}
                      // setEndDate={setEndDate}
                      open={modalDownload.isOpen} onClose={modalDownload.close} /> */}
                    {/* 
                    <CWButton
                      onClick={() => refUpload.current?.click()}
                      icon={<IconUpload />}
                      title="Upload"
                    /> */}

                    {/* <input ref={refUpload} value={''} accept=".csv" onChange={(e) => {
                      
                    }} className='hidden' type="file" /> */}
                  </div>
                </div>
              </div>

              <div className="mt-5 w-full">
                {records.length > 0 ? (
                  <DataTable
                    height={'calc(100vh - 350px)'}
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
                    fetching={fetching}
                    loaderType="oval"
                    loaderBackgroundBlur={4}
                  />
                ) : (
                  <DataTable
                    height={'calc(100vh - 350px)'}
                    className="table-hover whitespace-nowrap"
                    columns={columnDefs}
                    records={[]}
                    noRecordsText="ไม่พบข้อมูล"
                    fetching={fetching}
                    withTableBorder
                    withColumnBorders
                  />
                )}
              </div>
            </div>
          </CWWhiteBox>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
