import { toDateTimeTH } from '@global/utils/date';
import CWSelectValue from '@component/web/cw-selectValue';
import { BugReportStatus } from '@domain/g04/g04-d06/local/type';
import {
  IBugReportDetailProps,
  IBugReportLogProps,
} from '@domain/g04/g04-d05/local/type';
import { useEffect, useState } from 'react';
import API from '@domain/g04/g04-d06/local/api';
import showMessage from '@global/utils/showMessage';
interface SidePanelProps {
  data?: IBugReportDetailProps | null;
  reportId?: string;
  titleName?: string;
  userId?: string | number;
  time?: string | number;
  byAdmin?: string;
  statusValue?: BugReportStatus | string;
  status?: (value: BugReportStatus) => void;
  mode?: 'create' | 'edit';
  onClick?: () => void;
  className?: string;
  onChangeTextArea?: (value: string) => void;
  textAreaValue?: string;
  reload?: boolean;
}

const SidePanel = ({
  reload,
  data,
  reportId,
  titleName,
  time,
  byAdmin,
  onClick,
  userId,
  statusValue,
  status,
  className,
  mode = 'create',
  onChangeTextArea,
  textAreaValue,
}: SidePanelProps) => {
  const [useBugLogData, setBugLogData] = useState<IBugReportLogProps[]>([]);

  useEffect(() => {
    const fetchMockData = async () => {
      if (!reportId) {
        showMessage('ไม่มีรหัสปัญหา', 'error');
        return;
      }
      try {
        const res = await API.bugReport.GetG04D06A03(reportId);
        if (res.status_code === 200) {
          setBugLogData(res?.data);
        }
      } catch (error) {
        showMessage(`Failed to fetch account students: ${error}`, 'error');
      }
    };
    fetchMockData();
  }, [reportId, reload]);

  return (
    <div className={`h-full xl:w-[30%] ${className} `}>
      <div className="flex h-fit w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
        <div className="flex items-center">
          <p className="block w-[50%] text-sm text-[#0E1726]">{titleName}</p>
          <p className="w-full">{data?.id || '-'}</p>
        </div>

        <div className="flex items-center">
          <p className="block w-[50%] text-sm text-[#0E1726]">แก้ไขล่าสุด</p>
          <p className="w-full">
            {useBugLogData && useBugLogData?.length > 0
              ? toDateTimeTH(useBugLogData[0]?.created_at)
              : '-'}
          </p>
        </div>

        <div className="flex items-center">
          <p className="block w-[50%] text-sm text-[#0E1726]">แก้ไขโดย</p>
          <p className="w-full">
            {useBugLogData && useBugLogData?.length > 0
              ? useBugLogData[0]?.created_by
              : '-'}
          </p>
        </div>

        <div className="flex items-center border-t border-[#D4D4D4] pt-4">
          <p className="block w-[50%] text-sm text-[#0E1726]">สถานะ</p>
          <CWSelectValue
            options={[
              { value: BugReportStatus.WAITING, label: 'รอตรวจสอบ' },
              { value: BugReportStatus.EDITING, label: 'กำลังแก้ไข' },
              { value: BugReportStatus.SUCCESS, label: 'แก้ไขสำเร็จ' },
              { value: BugReportStatus.CLOSING, label: 'ปิดงาน' },
            ]}
            value={statusValue}
            onChange={(value: string) => {
              if (status) {
                status(value as BugReportStatus);
              }
            }}
            required={true}
            title={'สถานะ'}
            className="col-span-2 w-full"
          />
        </div>

        {mode !== 'create' && (
          <div className="w-full">
            <textarea
              placeholder="Commit message..."
              className="max-h-[100px] min-h-[40px] w-full rounded-md border-[1px] px-5 py-4"
              onChange={(e) => {
                if (onChangeTextArea) {
                  onChangeTextArea(e.target.value);
                }
              }}
              value={textAreaValue || ''}
            />
          </div>
        )}

        <button
          className="w-full rounded-md bg-primary py-2 font-bold text-white shadow-2xl"
          onClick={(e) => {
            e?.preventDefault();
            if (onClick) {
              onClick();
            }
          }}
        >
          บันทึก
        </button>
      </div>

      {mode !== 'create' && (
        <div className="mt-5 flex h-full w-full flex-col gap-3 overflow-y-auto rounded-lg bg-white p-4 shadow-md">
          <div className="flex flex-col gap-4">
            <h1 className="text-[16px] font-bold">ประวัติการแก้ไข</h1>
            <ul className="mt-2 space-y-2">
              {useBugLogData?.length ? (
                useBugLogData.map((edit) => (
                  <li key={edit.id} className="truncate text-sm text-gray-700">
                    <div className="flex justify-between">
                      <p className="trucated">
                        {/* {edit.editedBy} ({edit.action}) */}
                        {edit?.created_by} {edit?.message}
                      </p>
                      <span className="font-[300]">{toDateTimeTH(edit?.created_at)}</span>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-center">ไม่มีรายการ</div>
              )}
            </ul>
          </div>
          {/* <button className="text-blue-500">ดูทั้งหมด</button> */}
        </div>
      )}
    </div>
  );
};

export default SidePanel;
