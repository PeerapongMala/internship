import {
  IGetSheetDetail,
  IStudentIndicatorDaum,
  IUpdateSheetRequest,
} from '@domain/g06/g06-d03/local/type';
import AttendanceTable from '../../organism/cw-o-table-attendance';
import { Pagination } from '@mantine/core';
import { useState } from 'react';
import { TPagination } from '@global/types/api';
import CWWhiteBox from '@component/web/cw-white-box';
import CWInput from '@component/web/cw-input';

type AttendanceTableProps = {
  isEdit?: boolean;
  sheetDetail: IGetSheetDetail;
  editMode: boolean;
  onHourChange: (hour: number) => void;
  studentScoreData: IUpdateSheetRequest;
  onInputScoreChange?: (
    e: string,
    indexJsonStudentScoreData: number,
    indexStudentIndicator: number,
    indicatorData: IStudentIndicatorDaum,
  ) => void;
};

const TemplateAttendanceTable: React.FC<AttendanceTableProps> = ({
  isEdit,
  sheetDetail,
  studentScoreData,
  editMode,
  onHourChange,
  onInputScoreChange,
}: AttendanceTableProps) => {
  const [pagination, setPagination] = useState<TPagination>({
    page: 1,
    limit: 1,
    total_count: 0,
  });
  return (
    <>
      <CWWhiteBox className="flex flex-col gap-6">
        <span className="text-lg font-bold">ข้อมูลเวลาเรียน</span>
        <CWInput
          className="max-w-[265px]"
          label="เวลาเรียน (ชั่วโมง/ปี):"
          required={editMode}
          disabled={!editMode}
          placeholder="0"
          type="number"
          min={0}
          value={sheetDetail?.additional_data?.hours}
          onChange={(e) => onHourChange(Number(e.target.value))}
        />
      </CWWhiteBox>

      <CWWhiteBox>
        <AttendanceTable
          isEdit={isEdit}
          pagination={pagination}
          setPagination={setPagination}
          sheetDetail={sheetDetail}
          studentScoreData={studentScoreData}
          onInputScoreChange={onInputScoreChange}
        />

        <Pagination
          value={pagination.page}
          onChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          total={pagination.total_count}
        />
      </CWWhiteBox>
    </>
  );
};

export default TemplateAttendanceTable;
