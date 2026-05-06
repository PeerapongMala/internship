import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWInput from '@component/web/cw-input';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';
import { TBugReport } from '@domain/g05/g05-d02/local/types/bug-report';

import { ChangeEvent, ChangeEventHandler } from 'react';
import {
  platformOptions,
  priorityOptions,
  problemTypeOptions,
  versionOptions,
} from '../../option';

interface BugReportProp {
  data?: Partial<TBugReport>;
  mode?: 'create' | 'view';
  onChange?: (field: keyof TBugReport, value: string) => void;
}

const DetailProblem = ({ data, mode = 'view', onChange }: BugReportProp) => {
  const handleChange = (field: keyof TBugReport, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  const getLabelFromValue = (
    options: { label: string; value: string }[],
    value: string,
  ) => {
    const found = options.find((opt) => opt.value === value);
    return found ? found.label : value;
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-start justify-start space-y-6">
        <p className="w-full text-left font-noto-sans-thai text-lg font-bold sm:text-xl md:text-[20px]">
          รายละเอียดปัญหา
        </p>

        <div className="w-full">
          <label className="mb-1 block">
            <span className="text-red-500">*</span>วันที่แจ้ง
          </label>
          <WCAInputDateFlat
            className="w-full"
            value={data?.created_at}
            disabled={mode === 'view'}
            onChange={(dates: Date[]) => {
              if (dates && dates.length > 0) {
                const date = new Date(dates[0]);
                date.setHours(0, 0, 0, 0);
                const isoDate = date.toISOString();
                handleChange('created_at', isoDate);
              }
            }}
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <CWInput
            label={'ระบบปฏิบัติการ:'}
            placeholder={'เช่น Android 11'}
            required={true}
            className="w-full"
            value={data?.os || ''}
            disabled={mode === 'view'}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('os', e.target.value)
            }
          />

          <CWInput
            label={'เบราว์เซอร์:'}
            placeholder={'เช่น Chrome 132 (www.whatsmybrowser.org/)'}
            required={true}
            className="w-full"
            value={data?.browser || ''}
            disabled={mode === 'view'}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('browser', e.target.value)
            }
          />
          <div className="flex flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>ประเภทปัญหา:
            </p>
            <WCADropdown
              placeholder={
                data?.type
                  ? getLabelFromValue(problemTypeOptions, data.type)
                  : 'เลือกประเภทปัญหา'
              }
              options={problemTypeOptions}
              onSelect={(value) => handleChange('type', value as string)}
              disabled={mode === 'view'}
            />
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>ประเภทบริการ:
            </p>
            <WCADropdown
              placeholder={
                data?.platform
                  ? getLabelFromValue(platformOptions, data.platform)
                  : 'เลือกประเภทบริการ'
              }
              options={platformOptions}
              onSelect={(value) => handleChange('platform', value as string)}
              disabled={mode === 'view'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>เวอร์ชั่น:
            </p>
            <WCADropdown
              placeholder={
                data?.version
                  ? getLabelFromValue(versionOptions, data.version)
                  : 'เลือกเวอร์ชั่น'
              }
              options={versionOptions}
              onSelect={(value) => handleChange('version', value as string)}
              disabled={mode === 'view'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p>
              <span className="text-red-500">*</span>ความสำคัญ:
            </p>
            <WCADropdown
              placeholder={
                data?.priority
                  ? getLabelFromValue(priorityOptions, data.priority)
                  : 'เลือกความสำคัญ'
              }
              options={priorityOptions}
              onSelect={(value) => handleChange('priority', value as string)}
              disabled={mode === 'view'}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-1.5">
          <p>URL ที่พบปัญหา:</p>
          <CWInput
            placeholder={'เช่น https://example.com/page-with-issue'}
            required={false}
            // label={'URL ที่พบปัญหา:'}
            className="w-full"
            value={data?.url || ''}
            disabled={mode === 'view'}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange('url', e.target.value)
            }
          />
        </div>

        <div className="w-full">
          <label className="mb-1 block font-medium">
            <span className="text-red-500">*</span> ปัญหา:
          </label>
          <textarea
            placeholder="กรุณาอธิบายรายละเอียดของปัญหาที่พบ ขั้นตอนการทำงานที่ทำให้เกิดปัญหา และผลกระทบที่ได้รับ"
            required
            className="h-auto max-h-[300px] min-h-[120px] w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
            value={data?.description || ''}
            disabled={mode === 'view'}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailProblem;
