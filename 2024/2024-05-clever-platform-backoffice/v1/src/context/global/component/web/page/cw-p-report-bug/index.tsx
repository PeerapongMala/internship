import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWInput from '@component/web/cw-input';
import CWWhiteBox from '@component/web/cw-white-box';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';
import { TBugReport } from '@domain/g05/g05-d02/local/types/bug-report';
import { toDateTH } from '@global/utils/date';
import { useState } from 'react';
import {
  platformOptions,
  priorityOptions,
  problemTypeOptions,
  versionOptions,
} from './option';
import CWButton from '@component/web/cw-button';

interface ReportBugProps {
  bugData?: TBugReport;
  mode?: 'create' | 'view';
  onSave?: () => void;
  lastUpdated?: string;
  lastUpdatedBy?: string;
  bugId?: string;
  bugStatus?: 'pending' | 'in-progress' | 'resolved' | 'closed' | string;
  onFieldChange?: (field: keyof TBugReport, value: string) => void;
  onDateChange?: (date: Date) => void;
  onDropdownChange?: (field: string, value: string) => void;
}

const CWReportBug = ({
  bugData,
  mode = 'view',
  onSave,
  lastUpdated,
  lastUpdatedBy,
  bugId,
  bugStatus = 'pending',
  onFieldChange,
  onDateChange,
  onDropdownChange,
}: ReportBugProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'รอตรวจสอบ';
      case 'in-progress':
        return 'กำลังแก้ไข';
      case 'resolved':
        return 'แก้ไขสำเร็จ';
      case 'closed':
        return 'ปิดงาน';
      default:
        return status;
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 md:flex-row">
      <CWWhiteBox className="flex w-full flex-col gap-5 md:w-2/3">
        <p className="text-left font-noto-sans-thai text-[20px] font-bold">
          รายละเอียดปัญหา
        </p>
        <div className="w-full">
          <label className="mb-1 block">วันที่แจ้ง</label>
          <WCAInputDateFlat
            className="w-full"
            value={bugData?.created_at}
            disabled={mode === 'view'}
            onChange={(dates: Date[]) => {
              if (dates && dates.length > 0 && onDateChange) {
                onDateChange(dates[0]);
              }
            }}
          />
        </div>
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="w-full md:w-1/3">
            <CWInput
              label="ระบบปฏิบัติการ:"
              placeholder="เช่น Android 11"
              required
              className="w-full"
              value={bugData?.os || ''}
              disabled={mode === 'view'}
              onChange={(e) => onFieldChange?.('os', e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
            <CWInput
              label="เบราว์เซอร์:"
              placeholder="เช่น Chrome 132 (www.whatsmybrowser.org/)"
              required
              className="w-full"
              value={bugData?.browser || ''}
              disabled={mode === 'view'}
              onChange={(e) => onFieldChange?.('browser', e.target.value)}
            />
          </div>
          <div className="flex w-full flex-col gap-1.5 md:w-1/3">
            <p>
              <span className="text-red-500">*</span>ประเภทปัญหา:
            </p>
            <WCADropdown
              placeholder={
                bugData?.type
                  ? problemTypeOptions.find((opt) => opt.value === bugData.type)?.label ||
                    ''
                  : 'เลือกประเภทปัญหา'
              }
              options={problemTypeOptions}
              onSelect={(value) => onDropdownChange?.('type', value as string)}
              disabled={mode === 'view'}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex w-full flex-col gap-1.5 md:w-1/3">
            <p>
              <span className="text-red-500">*</span>ประเภทบริการ:
            </p>
            <WCADropdown
              placeholder={
                bugData?.platform
                  ? platformOptions.find((opt) => opt.value === bugData.platform)
                      ?.label || ''
                  : 'เลือกประเภทบริการ'
              }
              options={platformOptions}
              onSelect={(value) => onDropdownChange?.('platform', value as string)}
              disabled={mode === 'view'}
            />
          </div>
          <div className="flex w-full flex-col gap-1.5 md:w-1/3">
            <p>
              <span className="text-red-500">*</span>เวอร์ชั่น:
            </p>
            <WCADropdown
              placeholder={
                bugData?.version
                  ? versionOptions.find((opt) => opt.value === bugData.version)?.label ||
                    ''
                  : 'เลือกเวอร์ชั่น'
              }
              options={versionOptions}
              onSelect={(value) => onDropdownChange?.('version', value as string)}
              disabled={mode === 'view'}
            />
          </div>
          <div className="flex w-full flex-col gap-1.5 md:w-1/3">
            <p>
              <span className="text-red-500">*</span>ความสำคัญ:
            </p>
            <WCADropdown
              placeholder={
                bugData?.priority
                  ? priorityOptions.find((opt) => opt.value === bugData.priority)
                      ?.label || ''
                  : 'เลือกความสำคัญ'
              }
              options={priorityOptions}
              onSelect={(value) => onDropdownChange?.('priority', value as string)}
              disabled={mode === 'view'}
            />
          </div>
        </div>
        <div className="w-full">
          <CWInput
            placeholder="เช่น https://example.com/page-with-issue"
            label="URL ที่พบปัญหา:"
            className="w-full"
            value={bugData?.url || ''}
            disabled={mode === 'view'}
            onChange={(e) => onFieldChange?.('url', e.target.value)}
          />
        </div>
        <div className="flex w-full flex-col items-start">
          <label className="mb-1 text-left font-medium">
            <span className="text-red-500">*</span> ปัญหา:
          </label>
          <textarea
            placeholder="กรุณาอธิบายรายละเอียดของปัญหาที่พบ ขั้นตอนการทำงานที่ทำให้เกิดปัญหา และผลกระทบที่ได้รับ"
            required
            className="max-h-[300px] min-h-[100px] w-full resize-y rounded-md border border-gray-300 p-2"
            value={bugData?.description || ''}
            disabled={mode === 'view'}
            onChange={(e) => onFieldChange?.('description', e.target.value)}
          />
        </div>
        <div className="flex w-full flex-col gap-4 md:flex-row md:gap-0">
          <div className="w-full rounded-md border border-gray-300 p-2 md:w-1/3">
            <div
              className="relative flex w-full items-center justify-center overflow-hidden rounded-md bg-gray-100"
              style={{ minHeight: '200px' }}
            >
              <div className="flex flex-col items-center justify-center p-4">
                <div className="flex h-20 w-24 items-center justify-center rounded-md border border-gray-300 bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <circle cx="5" cy="5" r="2" fill="currentColor" />
                    <path
                      fillRule="evenodd"
                      d="M3 10l4-4 7 7 4-4v9H3v-8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full rounded-md border border-dashed border-gray-300 p-8 md:w-1/3">
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-2 h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="mb-2 text-center text-gray-500 underline">อัพโหลดรูป</span>
              <p className="text-center text-sm text-gray-400">
                format: .jpg, .png | ขนาดไม่เกิน 5 MB
              </p>
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleFilesChange(Array.from(files));
                }
              }}
              className="hidden"
              id="file-upload"
            />
          </div>
        </div>
      </CWWhiteBox>
      <div className="w-full md:w-1/3">
        <CWWhiteBox className="w-full">
          <div className="flex w-full flex-col">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr',
                marginBottom: '20px',
              }}
            >
              <p>รหัสปัญหา:</p>
              <span>{bugId ?? '-'}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr',
                marginBottom: '20px',
              }}
            >
              <p>สถานะ:</p>
              <span>{getStatusLabel(bugStatus)}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr',
                marginBottom: '20px',
              }}
            >
              <p>แก้ไขล่าสุด:</p>
              <span>{lastUpdated ? toDateTH(lastUpdated) : '-'}</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr',
                marginBottom: '20px',
              }}
            >
              <p>แก้ไขล่าสุดโดย:</p>
              <span>{lastUpdatedBy ? lastUpdatedBy : '-'}</span>
            </div>
            {mode === 'create' && (
              <CWButton variant="primary" title="บันทึก" onClick={onSave} />
            )}
          </div>
        </CWWhiteBox>
      </div>
    </div>
  );
};

export default CWReportBug;
