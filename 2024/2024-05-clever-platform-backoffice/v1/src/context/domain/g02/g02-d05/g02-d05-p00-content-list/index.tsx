import StoreGlobal from '@global/store/global';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import { Link, useParams } from '@tanstack/react-router';
import Box from '../local/components/atom/Box';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import API from '../local/api';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  QuestionType,
  Pagination,
  AcademicLevelType,
  AcademicLevelDifficulty,
  AcademicLevelStatusType,
  LevelItem,
} from '../local/type';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import { convertIdToThreeDigit, getStatus, convertTime } from '../local/util';
import ModalConfirmArchive from './component/web/molecule/ModalConfirmDelete';
import ModalQuestionOrder from '../local/components/organism/HeaderForm/ModalQuestionOrder';
import IconMove from '@core/design-system/library/component/icon/IconMove';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import {
  Input,
  Select,
} from '@core/design-system/library/vristo/source/components/Input';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import Tab from '@core/design-system/library/vristo/source/components/Tab';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { toDateTimeTH } from '@global/utils/date';
import HeaderBreadcrumbs from '../local/components/template/header-breadcrumbs';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import StoreGlobalPersist from '@store/global/persist';
import showMessage from '@global/utils/showMessage';
import { getDifficulty, getLevelType, getQuestionType } from '@global/utils/levelConvert';
import showLoadingModal from '@global/utils/showLoadingModal';
import usePagination from '@global/hooks/usePagination';
import Swal from 'sweetalert2';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { subLessonId } = useParams({ from: '' });

  // const subLessonId = "1";
  // const [subLessonId, setSubLessonId] = useState("1");
  const [lessonId, setLessonId] = useState<string | null>(null);

  const { subjectData }: { subjectData: ISubject } = StoreGlobalPersist.StateGet([
    'subjectData',
  ]);

  const fileInput = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [openSort, setOpenSort] = useState(false);
  const [levelsListState, setLevelsListState] = useState<any[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<LevelItem[]>([]);
  const [isModalConfirmArchiveOpen, setIsModalConfirmArchiveOpen] = useState(false);
  const [isModalConfirmBulkArchiveOpen, setIsModalConfirmBulkArchiveOpen] =
    useState(false);
  const [selectedArchiveId, setSelectedArchiveId] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>({});
  const [typeArchive, setTypeArchive] = useState<string>('');
  const [searchKey, setSearchKey] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [searchObject, setSearchObject] = useState<any>({});
  const [passwordDelete, setPasswordDelete] = useState('');
  const { pagination, setPagination } = usePagination();

  const [loading, setLoading] = useState(false);

  const getUrlFromStatus = (status: string): string => {
    switch (status) {
      case 'setting':
        return `${subLessonId}/create-setting`;
      case 'question':
        return `${subLessonId}/create-question`;
      case 'translation':
        return `${subLessonId}/create-translate`;
      case 'speech':
        return `${subLessonId}/create-sound`;
      case 'enabled':
        return `${subLessonId}/create-public`;
      case 'disabled':
        return '';
      default:
        return '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleClickArchive = (id: number) => {
    setSelectedArchiveId(id);
    setSelectedRecord(records.find((record) => record.id === id));
    setIsModalConfirmArchiveOpen(true);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('handleSearchInput', e.target.value);

    const timeoutId = setTimeout(() => {
      setSearchInput(e.target.value);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const submitArchive = async () => {
    if (selectedArchiveId !== null) {
      // Perform archive action
      const data = {
        status: 'disabled',
        password: passwordDelete,
      };
      const toastText =
        records.find((record) => record.id === selectedArchiveId).status === 'enabled'
          ? 'จัดเก็บสำเร็จ'
          : 'ลบสำเร็จ';
      await API.academicLevel.Update(selectedArchiveId.toString(), data).then((res) => {
        if (res.status_code === 200) {
          showMessage(toastText, 'success');
          fetchData();
          return true;
        } else {
          showMessage(res.message, 'error');
          return false;
        }
      });
      setIsModalConfirmArchiveOpen(false);
    }
  };

  const submitBulkEdit = async (action: string) => {
    let newLevelsList: any[] = [];
    if (action === 'archive') {
      newLevelsList = selectedRecords.map((record) => {
        return {
          level_id: record.id,
          status: 'disabled',
        };
      });
    }

    // setLoading(true);
    showLoadingModal();

    API.academicLevel
      .UpdateG02D05A46({
        bulk_edit_list: newLevelsList,
        password: passwordDelete,
      })
      .then((res) => {
        if (res.status_code === 200) {
          // setLoading(false);
          showMessage('บันทึกสำเร็จ', 'success');
          setIsModalConfirmBulkArchiveOpen(false);
          fetchData();
        } else if (res.status_code === 403) {
          setLoading(false);
          showMessage('รหัสผ่านไม่ถูกต้อง', 'error');
        } else {
          // setLoading(false);
          showMessage(res.message || 'เกิดข้อผิดพลาด', 'error');
        }
      })
      .catch((err) => {
        if (err?.response?.status === 403) {
          showMessage('รหัสผ่านไม่ถูกต้อง', 'error');
        } else {
          showMessage('พบปัญหาในการบันทึกข้อมูล', 'error');
        }
      });
  };

  const submitSort = async () => {
    console.log('submitSort');
    const newLevelsList = levelsListState.reduce(
      (acc, item, index) => {
        acc[String(item.id)] = index + 1;
        return acc;
      },
      {} as { [key: string]: number },
    );

    API.academicLevel
      .UpdateG02D05A36(subLessonId, { levels: newLevelsList })
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ', 'success');
          fetchData();
          setOpenSort(false);
        } else {
          showMessage(res.message, 'error');
        }
      });
  };

  const fetchData = async () => {
    setFetching(true);
    const res = await API.academicLevel.Gets(subLessonId, {
      page: pagination.page,
      limit: pagination.limit,
      [searchKey]: searchInput,
      no_question: true,
      ...searchObject,
    });
    if (res.status_code === 200) {
      const sorted = res.data.sort((a: any, b: any) => a.index - b.index);
      setRecords(sorted);
      setPagination((prev) => ({
        ...prev,
        total_count: res._pagination.total_count,
      }));
    } else {
      showMessage(res.message, 'error');
    }
    setFetching(false);
  };

  useEffect(() => {
    if (file && subLessonId) {
      const uploadCSV = async () => {
        showLoadingModal();

        try {
          const res = await API.academicLevel.UploadCSV(subLessonId, file);
          setFile(null);

          if (res.status_code === 200) {
            showMessage('อัพโหลดสำเร็จ', 'success');
            window.location.reload();
          } else {
            showMessage(res.message, 'error');
          }
        } catch (err: any) {
          showMessage(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 'error');
        }
      };

      uploadCSV();
    }
  }, [file]);

  useEffect(() => {
    setLevelsListState(
      records
        .filter((record) => record.status === 'enabled')
        .map((record: any, index: number) => {
          return {
            id: record.id,
            label: `ID : ${convertIdToThreeDigit(record.id)} / ${getLevelType(record?.level_type)}`,
            index: index + 1,
            disabledUp: index === 0,
            disabledDown: index === records.length - 1,
          };
        }),
    );
  }, [records]);

  useEffect(() => {
    if (subLessonId) {
      API.academicLevel.GetG02D04A07SubLessonById(subLessonId).then((res) => {
        if (res.status_code === 200) {
          setLessonId(res.data?.[0]?.lesson_id);
        }
      });
    }
  }, [subLessonId]);

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, searchKey, searchInput, searchObject]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <LayoutDefault>
      <HeaderBreadcrumbs
        links={[
          {
            label: 'เกี่ยวกับหลักสูตร',
            href: `/content-creator/sublesson/${lessonId}`,
          },
          { label: 'จัดการด่าน', href: `` },
        ]}
        headerTitle="จัดการด่าน"
        headerDescription={
          <div>
            สร้างแบบทดสอบ กำหนดรูปแบบคำถาม ตั้งค่าการเล่นเกมของแต่ละด่านในบทเรียนย่อย
            คุณสามารถตั้งค่าบทเรียนได้ที่เมนู
            <Link
              to={`/content-creator/sublesson/${lessonId}`}
              className="text-blue-500 underline"
            >
              บทเรียนย่อย
            </Link>
          </div>
        }
        sublessonId={subLessonId}
        showLevelCount
        backLink={`../../../content-creator/sublesson/${lessonId}`}
      />
      <div id="danger-toast"></div>
      <ModalConfirmArchive
        isOpen={isModalConfirmArchiveOpen}
        onClose={() => setIsModalConfirmArchiveOpen(false)}
        onOk={submitArchive}
        passwordDelete={passwordDelete}
        setPasswordDelete={setPasswordDelete}
        selectedRecord={selectedRecord}
      />
      <ModalConfirmArchive
        isOpen={isModalConfirmBulkArchiveOpen}
        onClose={() => setIsModalConfirmBulkArchiveOpen(false)}
        onOk={() => submitBulkEdit('archive')}
        amountArchive={
          selectedRecords.filter((record) => record.status === 'enabled').length
        }
        amountDelete={
          selectedRecords.filter((record) => record.status !== 'enabled').length
        }
        passwordDelete={passwordDelete}
        setPasswordDelete={setPasswordDelete}
        // loading={loading}
      />
      <ModalQuestionOrder
        open={openSort}
        onClose={() => setOpenSort(false)}
        onOk={submitSort}
        data={levelsListState}
        setData={setLevelsListState}
        enbledAddQuestion={false}
        prefix="ด่านที่ "
        title="เรียงลำดับด่าน"
      />
      <div className="mt-5 w-full font-noto-sans-thai">
        <Box className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="dropdown">
                  <Dropdown
                    placement={`bottom-start`}
                    btnClassName="btn btn-primary dropdown-toggle w-36"
                    button={
                      <>
                        Bulk Edit
                        <span>
                          <IconCaretDown className="inline-block ltr:ml-1 rtl:mr-1" />
                        </span>
                      </>
                    }
                    disabled={selectedRecords.length === 0}
                  >
                    <ul className="!min-w-[170px]">
                      <li>
                        <button
                          type="button"
                          className="flex items-center gap-2"
                          onClick={() => setIsModalConfirmBulkArchiveOpen(true)}
                        >
                          <IconArchive className="h-5 w-5" />
                          จัดเก็บ
                        </button>
                      </li>
                    </ul>
                  </Dropdown>
                </div>
                <Link
                  className="btn btn-primary flex w-36 gap-2"
                  to={`/content-creator/level/${subLessonId}/create-setting`}
                >
                  <IconPlus className="h-5 w-5" />
                  เพิ่มด่าน
                </Link>
                <button
                  className="btn btn-primary flex w-36 gap-2"
                  onClick={() => setOpenSort(true)}
                  type="button"
                >
                  <IconMove className="h-5 w-5" />
                  เรียงลำดับ
                </button>
                <span className="hidden h-full w-[2px] bg-neutral-300 xl:block" />
                <div className="flex">
                  <Input
                    placeholder="ค้นหา"
                    className="w-60 !rounded-r-none"
                    suffix={<IconSearch className="h-5 w-5" />}
                    inputClassName="h-[38px]"
                    value={searchInput}
                    // onChange={handleSearchInput}
                    onInput={handleSearchInput}
                  />
                  <Select
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderRadius: '0 0.375rem 0.375rem 0',
                        borderColor: '#E0E6ED',
                        borderLeft: 'none',
                      }),
                    }}
                    className="z-[11]"
                    options={[{ label: 'ID', value: 'id' }]}
                    defaultValue={{ label: 'ID', value: 'id' }}
                    onChange={(e) => {
                      setSearchKey(e.value);
                    }}
                    isSearchable={false}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex">
                  <input
                    id="ctnFile"
                    type="file"
                    className="hidden"
                    required
                    accept=".csv"
                    onChange={handleFileChange}
                    ref={fileInput}
                    // value={file}
                  />
                  <div
                    className="btn btn-primary flex w-36 cursor-pointer items-center justify-center gap-2"
                    onClick={() => fileInput.current?.click()}
                  >
                    <IconUpload className="h-5 w-5" />
                    Upload
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Select
                placeholder="ประเภทด่าน"
                className="z-10 w-60"
                options={[
                  { label: 'ทั้งหมด', value: '' },
                  ...Object.keys(AcademicLevelType).map((key) => ({
                    label: getLevelType(key as keyof typeof AcademicLevelType),
                    value: key,
                  })),
                ]}
                onChange={(e) => {
                  setSearchObject({ ...searchObject, level_type: e.value });
                }}
                isSearchable={false}
              />
              <Select
                placeholder="รูปแบบคำถาม"
                className="z-10 w-60"
                options={[
                  { label: 'ทั้งหมด', value: '' },
                  ...Object.keys(QuestionType).map((key) => ({
                    label: QuestionType[key as keyof typeof QuestionType],
                    value: key,
                  })),
                ]}
                onChange={(e) => {
                  setSearchObject({ ...searchObject, question_type: e.value });
                }}
                isSearchable={false}
              />
              <Select
                placeholder="ระดับความยาก"
                className="z-10 w-60"
                options={[
                  { label: 'ทั้งหมด', value: '' },
                  ...Object.keys(AcademicLevelDifficulty).map((key) => ({
                    label:
                      AcademicLevelDifficulty[
                        key as keyof typeof AcademicLevelDifficulty
                      ],
                    value: key,
                  })),
                ]}
                onChange={(e) => {
                  setSearchObject({ ...searchObject, difficulty: e.value });
                }}
                isSearchable={false}
              />
            </div>
          </div>

          <Tab
            tabs={[
              { label: 'ทั้งหมด', value: '' },
              ...Object.keys(AcademicLevelStatusType).map((key) => ({
                label:
                  AcademicLevelStatusType[key as keyof typeof AcademicLevelStatusType],
                value: key,
              })),
            ]}
            onChange={(value) => {
              setSearchObject({ ...searchObject, status: value });
            }}
          />

          <div className="datatables">
            <DataTable
              fetching={fetching}
              className="table-hover whitespace-nowrap"
              records={records}
              columns={rowColumns({
                handleClickArchive,
                getUrlFromStatus,
              })}
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={setSelectedRecords}
              highlightOnHover
              withTableBorder
              withColumnBorders
              height={'calc(100vh - 200px)'}
              noRecordsText="ไม่พบข้อมูล"
              totalRecords={pagination.total_count}
              recordsPerPage={pagination.limit}
              page={pagination.page}
              onPageChange={(page) => {
                setPagination((prev) => ({
                  ...prev,
                  page,
                }));
              }}
              onRecordsPerPageChange={(limit: number) => {
                setPagination((prev) => ({
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
          </div>
        </Box>
      </div>
    </LayoutDefault>
  );
};

const rowColumns = ({
  handleClickArchive,
  getUrlFromStatus,
}: {
  handleClickArchive: (id: number) => void;
  getUrlFromStatus: (status: string) => string;
}): DataTableColumn<LevelItem>[] => [
  {
    accessor: 'id',
    title: 'รหัสด่าน',
    render: (record: LevelItem, index: number) => <>{convertIdToThreeDigit(record.id)}</>,
  },
  {
    accessor: 'index',
    title: 'ด่านที่',
  },
  {
    accessor: 'level_type',
    title: 'ประเภท',
    render: (record: LevelItem, index: number) => getLevelType(record?.level_type),
  },
  {
    accessor: 'name',
    title: 'รูปแบบคำถาม',
    render: (record: LevelItem, index: number) => (
      <div className="min-w-48 text-wrap">{getQuestionType(record?.question_type)}</div>
    ),
  },
  {
    accessor: 'difficulty',
    title: 'ระดับ',
    render: (record: LevelItem, index: number) => getDifficulty(record?.difficulty),
  },
  {
    accessor: 'question_count',
    title: 'จน. คำถาม',
  },
  {
    accessor: 'updated_at',
    title: 'แก้ไขล่าสุด',
    render: (record: LevelItem, index: number) => <>{toDateTimeTH(record.updated_at)}</>,
  },
  {
    accessor: 'updated_by',
    title: 'แก้ไขล่าสุดโดย',
  },
  {
    accessor: 'status',
    title: 'สถานะ',
    render: (record: LevelItem, index: number) => getStatus(record?.status),
  },
  {
    accessor: 'edit',
    title: 'แก้ไข',
    titleClassName: 'text-center',
    render: (record: LevelItem, index: number) => (
      <Link
        disabled={record?.status === 'disabled'}
        className={cn(
          'flex justify-center',
          record?.status === 'disabled' && 'opacity-30',
        )}
        to={`/content-creator/level/${getUrlFromStatus(record?.status)}/${record.id}`}
      >
        <IconPen className="h-5 w-5" />
      </Link>
    ),
  },
  {
    accessor: 'archive',
    title: 'จัดเก็บ',
    titleClassName: 'text-center',
    render: (record: any, index: number) => (
      <div className="flex w-full justify-center">
        <button
          disabled={record?.status === 'disabled'}
          onClick={() => handleClickArchive(record.id)}
        >
          <IconArchive
            className={cn('h-5 w-5', record?.status === 'disabled' && 'opacity-30')}
          />
        </button>
      </div>
    ),
  },
];

export default DomainJSX;
