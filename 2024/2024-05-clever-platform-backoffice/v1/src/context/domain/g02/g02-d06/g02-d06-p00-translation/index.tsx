import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { useEffect, useRef, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { Thai } from 'flatpickr/dist/l10n/th.js';
import ConfigJson from './config/index.json';
import { Dropdown } from '@core/design-system/library/vristo/source/components/Buttons';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import Box from '@global/component/web/atom/Box';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { Input } from '@core/design-system/library/vristo/source/components/Input';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import Tab from '@core/design-system/library/vristo/source/components/Tab';
import { TranslateTextRecord, TranslateTextStatusType } from '../local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { convertIdToThreeDigit, convertTime, getStatus } from '../local/util';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import { Pagination } from '@domain/g02/g02-d05/local/type';
import API from '../local/api';
import { Select } from '@core/design-system/library/vristo/source/components/Input';
import IconGraphicEq from '@core/design-system/library/component/icon/IconGraphicEq';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import ModalConfirmDeleteAll from './component/web/organism/ModalConfirmDeleteAll';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import ModalNewCreate from '@domain/g02/g02-d05/g02-d05-p02-content-question/components/organism/ModalNewCreate';
import { TranslateObject } from '@domain/g02/g02-d05/local/type';
import TranslationHeader from './component/web/template/Header';
import {
  Modal,
  ModalProps,
} from '@core/design-system/library/vristo/source/components/Modal';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const navigate = useNavigate();
  const { t } = useTranslation([ConfigJson.key]);
  const { curriculumGroupId: paramCurriculumGroupId } = useParams({ from: '' });
  const { curriculumData }: { curriculumData: ICurriculum } = StoreGlobalPersist.StateGet(
    ['curriculumData'],
  );
  const curriculumId = curriculumData?.id;
  const curriculumGroupId = paramCurriculumGroupId || curriculumId;

  const optionLanguage = [
    { value: 'th', label: 'ภาษาไทย' },
    { value: 'en', label: 'ภาษาอังกฤษ' },
    { value: 'zh', label: 'ภาษาจีน' },
  ];

  const fileInput = useRef<HTMLInputElement>(null);
  const [isModalConfirmBulkUpdateOpen, setIsModalConfirmBulkUpdateOpen] = useState({
    show: false,
    type: '',
  });
  const [isModalConfirmArchiveOpen, setIsModalConfirmArchiveOpen] = useState(false);
  const [isModalConfirmUnarchiveOpen, setIsModalConfirmUnarchiveOpen] = useState(false);
  const [showModalNewCreate, setShowModalNewCreate] = useState(false);
  const [isModalConfirmToggleSpeechOpen, setIsModalConfirmToggleSpeechOpen] =
    useState(false);
  const [isModalExportVisible, setModalExportVisible] = useState(false);
  const [downloadDate, setDownloadDate] = useState({
    start_date: '',
    end_date: '',
  });
  const [loadings, setLoadings] = useState<{
    getDatas: boolean;
  }>({
    getDatas: false,
  });
  const [searchObject, setSearchObject] = useState<{
    status: TranslateTextStatusType | '';
  }>({
    status: '',
  });
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [searchInput, setSearchInput] = useState('');
  const [selectedlanguage, setSelectedLanguage] = useState<{
    value: string;
    label: string;
  }>();
  const [records, setRecords] = useState<TranslateTextRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<TranslateTextRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [translateData, setTranslateData] = useState<TranslateObject>();

  const handleClickArchive = (id: number) => {
    setSelectedRecordId(id);
    setIsModalConfirmArchiveOpen(true);
  };

  const handleClickUnarchive = (id: number) => {
    setSelectedRecordId(id);
    setIsModalConfirmUnarchiveOpen(true);
  };

  const handleClickShowModalNewCreate = (id?: number) => {
    setShowModalNewCreate(true);
    if (id) {
      setSelectedRecordId(id);
      const foundRecord = records.find((record) => record.id === id);
      if (foundRecord) {
        submitGetTranslateData(foundRecord.saved_text_group_id);
      }
    }
  };

  const handleCloseModalNewCreate = () => {
    fetchData();
    setShowModalNewCreate(false);
    setTranslateData(undefined);
  };

  const handleClickToggleSpeech = (id: number) => {
    setSelectedRecordId(id);
    setIsModalConfirmToggleSpeechOpen(true);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeoutId = setTimeout(() => {
      setSearchInput(e.target.value);
      setPagination((prev) => ({
        ...prev,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleDownload = () => {
    const query = {
      ...(downloadDate.start_date && { start_date: downloadDate.start_date }),
      ...(downloadDate.end_date && { end_date: downloadDate.end_date }),
    };

    setModalExportVisible(false);
    API.academicTranslation.GetG02D06A03(String(curriculumGroupId), query);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleClickBulkEdit = (
    type: 'archive' | 'toggle-speech' | 'toggle-speech-delete' | 'enable',
  ) => {
    if (selectedRecords.length > 0) {
      setIsModalConfirmBulkUpdateOpen({ show: true, type });
    }
  };

  const handleCloseModalDownload = () => {
    setModalExportVisible(false);
    setDownloadDate({
      start_date: '',
      end_date: '',
    });
  };

  const submitGetTranslateData = async (groupId: string) => {
    const res = await API.academicTranslation.GetG02D06A08(groupId);
    if (res.status_code === 200) {
      setTranslateData(res.data?.[0] as unknown as TranslateObject);
    }
  };

  const submitUpdateStatus = async (
    groupId: string,
    status: TranslateTextRecord['status'],
  ) => {
    const data = {
      language: selectedlanguage?.value,
      status: status,
      // admin_login_as: "admin",
    };
    const res = await API.academicTranslation.UpdateG02D06A10(groupId, data);

    if (res.status_code === 200) {
      showMessage('อัพเดทสถานะสำเร็จ', 'success');
      fetchData();
    } else {
      showMessage(res.message, 'error');
    }
  };

  const submitArchive = async () => {
    setIsModalConfirmArchiveOpen(false);
    if (selectedRecordId) {
      const foundRecord = records.find((record) => record.id === selectedRecordId);
      if (foundRecord) {
        await submitUpdateStatus(foundRecord.saved_text_group_id, 'disabled');
      }
    }
  };

  const submitUnarchive = async () => {
    setIsModalConfirmUnarchiveOpen(false);
    if (selectedRecordId) {
      const foundRecord = records.find((record) => record.id === selectedRecordId);
      if (foundRecord) {
        await submitUpdateStatus(foundRecord.saved_text_group_id, 'enabled');
      }
    }
  };

  const submitToggleSpeech = async () => {
    const foundRecord = records.find((record) => record.id === selectedRecordId);
    setIsModalConfirmToggleSpeechOpen(false);
    showMessage('กำลังอัพเดท...', 'info');
    if (foundRecord) {
      const data = {
        language: selectedlanguage?.value,
        // admin_login_as: "admin",
      };

      const res = await API.academicTranslation.UpdateG02D06A09(
        String(foundRecord.saved_text_group_id),
        data,
      );
      if (res.status_code === 200) {
        setTranslateData(res.data?.[0] as unknown as TranslateObject);

        if (foundRecord.speech_url) {
          showMessage('ลบเสียงสำเร็จ', 'success');
        } else {
          showMessage('สร้างเสียงสำเร็จ', 'success');
        }
        fetchData();
      } else {
        showMessage(res.message, 'error');
      }
    }
  };

  const determineStatus = (type: string, currentStatus: string): string => {
    switch (type) {
      case 'archive':
        return 'disabled';
      case 'enable':
        return 'enabled';
      default:
        return currentStatus;
    }
  };

  const determineSound = (type: string, speechUrl: string | undefined): boolean => {
    if (type === 'toggle-speech-delete') {
      return false;
    } else if (type === 'toggle-speech') {
      return true;
    }
    return !!speechUrl;
  };

  const submitBulkEdit = async (
    type: 'archive' | 'toggle-speech' | 'toggle-speech-delete' | 'enable',
  ) => {
    setIsModalConfirmBulkUpdateOpen({ show: false, type: '' });
    showMessage('กำลังอัพเดท...', 'info');
    const data = {
      bulk_edit_list: selectedRecords.map((record) => ({
        saved_text_group_id: record.saved_text_group_id,
        language: selectedlanguage?.value,
        sound: determineSound(type, record.speech_url),
        status: determineStatus(type, record.status),
      })),
    };
    const res = await API.academicTranslation.UpdateG02D06A11(data);
    if (res.status_code === 200) {
      showMessage('อัพเดทสำเร็จ', 'success');
      fetchData();
      setSelectedRecords([]);
    } else {
      showMessage(res.message, 'error');
    }
  };

  const fetchData = async () => {
    setLoadings((prev) => ({
      ...prev,
      getDatas: true,
    }));
    const query = {
      page: pagination.page,
      limit: pagination.limit,
      text: searchInput,
      language: selectedlanguage?.value,
      ...searchObject,
    };

    const res = await API.academicTranslation.GetG02D06A01(
      String(curriculumGroupId),
      query,
    );
    if (res.status_code === 200) {
      const sorted = res.data.sort((a, b) => a.id - b.id);
      setRecords(sorted);
      setPagination((prev) => ({
        ...prev,
        total_count: res._pagination.total_count,
      }));
    }
    setLoadings((prev) => ({
      ...prev,
      getDatas: false,
    }));
  };

  useEffect(() => {
    if (selectedlanguage) {
      fetchData();
    }
  }, [pagination.page, pagination.limit, searchInput, searchObject, selectedlanguage]);

  useEffect(() => {
    if (file) {
      const formData = new FormData();
      formData.append('csv_file', file);
      // formData.append("admin_login_as", "admin");

      API.academicTranslation
        .UploadG02D06A04(String(curriculumGroupId), formData)
        .then((res) => {
          setFile(null);
          if (res.status_code === 200) {
            showMessage('อัพโหลดสำเร็จ', 'success');
            fetchData();
          } else {
            showMessage(res.message, 'error');
          }
        });
    }
  }, [file]);

  useEffect(() => {
    setSelectedLanguage(optionLanguage[0]);
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);

    if (!curriculumData) {
      navigate({
        to: '/curriculum',
      });
    }
  }, []);

  return (
    <LayoutDefault>
      <TranslationHeader />
      <ModalConfirmDeleteAll
        isModalConfirmArchiveOpen={isModalConfirmArchiveOpen}
        setIsModalConfirmArchiveOpen={setIsModalConfirmArchiveOpen}
        isModalConfirmBulkUpdateOpen={isModalConfirmBulkUpdateOpen}
        setIsModalConfirmBulkUpdateOpen={setIsModalConfirmBulkUpdateOpen}
        isModalConfirmUnarchiveOpen={isModalConfirmUnarchiveOpen}
        setIsModalConfirmUnarchiveOpen={setIsModalConfirmUnarchiveOpen}
        isModalConfirmToggleSpeechOpen={isModalConfirmToggleSpeechOpen}
        setIsModalConfirmToggleSpeechOpen={setIsModalConfirmToggleSpeechOpen}
        submitArchive={submitArchive}
        submitBulkEdit={submitBulkEdit}
        submitUnarchive={submitUnarchive}
        submitToggleSpeech={submitToggleSpeech}
        selectedRecords={selectedRecords}
        selectedRecordId={selectedRecordId}
        records={records}
      />
      <ModalNewCreate
        open={showModalNewCreate}
        onClose={handleCloseModalNewCreate}
        curriculumGroupId={curriculumGroupId}
        initTranslateData={translateData}
        mainLanguage={selectedlanguage?.value}
      />
      <Modal
        open={isModalExportVisible}
        onClose={handleCloseModalDownload}
        className="w-[400px] font-noto-sans-thai"
        title="Download ข้อมูล"
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-0.5">
            <label htmlFor="from-export-datetime-input" className="font-normal">
              ตั้งแต่วันที่:
            </label>
            <Flatpickr
              placeholder="วว/ดด/ปปปป"
              className="h-[38px] w-full overflow-hidden rounded-md border border-neutral-200 p-3"
              options={{
                mode: 'single',
                dateFormat: 'd/m/Y',
                locale: {
                  ...Thai,
                },
              }}
              onChange={(date) => {
                setDownloadDate((prev) => ({
                  ...prev,
                  start_date: date[0].toISOString(),
                }));
              }}
            />
          </div>

          <div className="space-y-0.5">
            <label htmlFor="to-export-datetime-input" className="font-normal">
              ถึงวันที่:
            </label>
            <Flatpickr
              disabled={!downloadDate.start_date}
              placeholder="วว/ดด/ปปปป"
              className={cn(
                'h-[38px] w-full cursor-pointer overflow-hidden rounded-md border border-neutral-200 p-3',
                !downloadDate.start_date && 'bg-neutral-100',
              )}
              options={{
                mode: 'single',
                dateFormat: 'd/m/Y',
                minDate: downloadDate.start_date,
                locale: {
                  ...Thai,
                },
              }}
              onChange={(date) => {
                setDownloadDate((prev) => ({
                  ...prev,
                  end_date: date[0].toISOString(),
                }));
              }}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-outline-primary flex-1"
              onClick={() => setModalExportVisible(false)}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-primary flex-1 gap-1"
              onClick={handleDownload}
            >
              <IconDownload />
              Download
            </button>
          </div>
        </div>
      </Modal>
      <div className="w-full font-noto-sans-thai">
        <Box className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="dropdown">
                  <Dropdown
                    placement={`bottom-start`}
                    btnClassName="btn btn-primary dropdown-toggle w-32"
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
                          onClick={() => handleClickBulkEdit('toggle-speech')}
                        >
                          <IconGraphicEq className="h-5 w-5" />
                          สร้างเสียง
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="flex items-center gap-2"
                          onClick={() => handleClickBulkEdit('toggle-speech-delete')}
                        >
                          <IconClose className="h-5 w-5" />
                          ลบเสียง
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="flex items-center gap-2"
                          onClick={() => handleClickBulkEdit('enable')}
                        >
                          <IconCornerUpLeft className="h-5 w-5" />
                          เปิดใช้งาน
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="flex items-center gap-2"
                          onClick={() => handleClickBulkEdit('archive')}
                        >
                          <IconArchive className="h-5 w-5" />
                          จัดเก็บ
                        </button>
                      </li>
                    </ul>
                  </Dropdown>
                </div>
                <button
                  className="btn btn-primary flex w-32 gap-2"
                  onClick={() => handleClickShowModalNewCreate()}
                >
                  <IconPlus className="h-5 w-5" />
                  เพิ่ม Text
                </button>
                <span className="hidden h-full w-[2px] bg-neutral-300 xl:block" />
                <Input
                  placeholder="ค้นหา"
                  className="w-60"
                  suffix={<IconSearch className="h-5 w-5 cursor-pointer" />}
                  inputClassName="h-[38px]"
                  // value={searchInput}
                  onInput={handleSearchInput}
                />
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-primary flex w-36 items-center justify-center gap-2"
                  onClick={() => setModalExportVisible(true)}
                >
                  <IconDownload className="h-5 w-5" />
                  Download
                </button>
                <div className="flex">
                  <input
                    id="ctnFile"
                    type="file"
                    className="hidden"
                    required
                    accept=".csv"
                    onChange={handleFileChange}
                    ref={fileInput}
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
          </div>

          <Tab
            tabs={[
              { label: 'ทั้งหมด', value: '' },
              ...Object.keys(TranslateTextStatusType).map((key) => ({
                label:
                  TranslateTextStatusType[key as keyof typeof TranslateTextStatusType],
                value: key,
              })),
            ]}
            onChange={(value) => {
              setSearchObject({
                ...searchObject,
                status: value as TranslateTextStatusType,
              });
              setPagination((prev) => ({
                ...prev,
                page: 1,
              }));
            }}
          />

          <Select
            className="z-10 w-60"
            options={optionLanguage}
            value={selectedlanguage}
            onChange={(e) => {
              setSelectedLanguage(e);
              setPagination((prev) => ({
                ...prev,
                page: 1,
              }));
            }}
            required
          />

          <div className="datatables">
            <DataTable
              fetching={loadings.getDatas}
              className="table-hover whitespace-nowrap"
              records={records}
              columns={rowColumns({
                handleClickArchive,
                selectedlanguage,
                handleClickUnarchive,
                handleClickShowModalNewCreate,
                handleClickToggleSpeech,
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
              recordsPerPageOptions={pageSizeOptions}
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
  handleClickUnarchive,
  handleClickShowModalNewCreate,
  handleClickToggleSpeech,
  selectedlanguage,
}: {
  handleClickArchive: (id: number) => void;
  handleClickUnarchive: (id: number) => void;
  handleClickShowModalNewCreate: (id: number) => void;
  handleClickToggleSpeech: (id: number) => void;
  selectedlanguage?: { value: string; label: string };
}): DataTableColumn<TranslateTextRecord>[] => [
  {
    accessor: 'id',
    title: 'รหัสข้อความ',
    render: (record: TranslateTextRecord, index: number) => (
      <>{convertIdToThreeDigit(record.id)}</>
    ),
  },
  {
    accessor: 'language',
    title: selectedlanguage?.label,
    render: (record: TranslateTextRecord, index: number) => (
      <p className="w-[25rem] text-wrap">{record.text}</p>
    ),
  },
  {
    accessor: 'text_to_ai',
    title: 'Text to AI',
  },
  {
    accessor: 'speech_url',
    title: `เสียง${selectedlanguage?.label}`,
    render: (record: TranslateTextRecord, index: number) => (
      <div
        className={`h-4 w-4 rounded-full ${record.speech_url ? 'bg-green-500' : 'bg-orange-600'}`}
      />
    ),
  },
  {
    accessor: 'updated_at',
    title: 'แก้ไขล่าสุด',
    render: (record: TranslateTextRecord, index: number) => (
      <>{convertTime(record.updated_at)}</>
    ),
  },
  {
    accessor: 'updated_by',
    title: 'แก้ไขล่าสุดโดย',
  },
  {
    accessor: 'status',
    title: 'สถานะ',
    render: (record: TranslateTextRecord, index: number) =>
      getStatus(record.status as unknown as keyof typeof TranslateTextStatusType),
  },
  {
    accessor: 'edit',
    title: 'แก้ไข',
    titleClassName: 'text-center',
    render: (record: TranslateTextRecord, index: number) => (
      <div className="flex w-full justify-center">
        <div
          className="cursor-pointer"
          onClick={() => handleClickShowModalNewCreate(record.id)}
        >
          <IconPen className="h-5 w-5" />
        </div>
      </div>
    ),
  },
  {
    accessor: 'create-sound',
    title: 'สร้างเสียง',
    titleClassName: 'text-center',
    render: (record: TranslateTextRecord, index: number) =>
      record.speech_url ? (
        <div className="flex w-full justify-center">
          <div
            className="cursor-pointer"
            onClick={() => handleClickToggleSpeech(record.id)}
          >
            <IconClose className="h-5 w-5" />
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <div
            className="cursor-pointer"
            onClick={() => handleClickToggleSpeech(record.id)}
          >
            <IconGraphicEq className="h-5 w-5" />
          </div>
        </div>
      ),
  },
  {
    accessor: 'archive',
    title: 'จัดเก็บ',
    titleClassName: 'text-center',
    render: (record: TranslateTextRecord, index: number) =>
      record.status !== 'disabled' ? (
        <div className="flex w-full justify-center">
          <div className="cursor-pointer" onClick={() => handleClickArchive(record.id)}>
            <IconArchive className="h-5 w-5" />
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center">
          <div className="cursor-pointer" onClick={() => handleClickUnarchive(record.id)}>
            <IconCornerUpLeft className="h-5 w-5" />
          </div>
        </div>
      ),
  },
];

export default DomainJSX;
