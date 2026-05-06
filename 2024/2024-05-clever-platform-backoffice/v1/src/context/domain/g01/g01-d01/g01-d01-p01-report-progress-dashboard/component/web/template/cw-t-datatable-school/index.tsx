import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import ProgressSelectTemplate from '../../../organism/cw-o-select-with-data';

interface DataProp {
  id: number;
  district: string;
  area: string;
  school: string;
  progress: number;
}
const DataTableSchool = () => {
  const rowColumns: DataTableColumn<DataProp>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_record: DataProp, index: number) => index + 1,
    },
    {
      accessor: 'district',
      title: 'เขตตรวจรายการ',
      render: (record: DataProp) => record.district,
    },
    {
      accessor: 'area',
      title: 'สำนักงานเขตพื้นที่การศึกษา',
      render: (record: DataProp) => record.area,
    },
    {
      accessor: 'school',
      title: 'โรงเรียน',
      render: (record: DataProp) => record.school,
    },
    {
      accessor: 'progress',
      title: 'ค่าความก้าวหน้า',
      render: (record: DataProp) => record.progress,
    },
  ];

  const dataMock = [
    {
      id: 1,
      district: 'เขตตรวจ 2',
      area: 'สพป.ชัยนาท',
      school: 'วัดศรีมลคล(สถิตมงคลราษฏร์อุปถัมท์',
      progress: 20,
    },
  ];
  return (
    <>
      <h2 className="text-xl font-bold">Report ระดับสำนักงานเขตพื้นที่การศึกษา</h2>

      <CWWhiteBox>
        <div className="mb-3 flex flex-col gap-5">
          <CWButton className="w-40" icon={<IconDownload />} title={'Download'} />
          <h2 className="text-xl font-bold">เขตตรวจทั้งหมด (18)</h2>
          <div className="flex flex-row gap-5">
            <div className="w-1/3 gap-5 rounded-md bg-white px-3 py-5 shadow-md">
              <ProgressSelectTemplate
                title="เขตตรวจราชการ (ทั้งหมด 20 เขต)"
                selectValue="เขตตรวจ 2"
                progressValue={20}
              />
            </div>
            <div className="w-1/3 gap-5 rounded-md bg-white px-3 py-5 shadow-md">
              <ProgressSelectTemplate
                title="เขตพื้นที่ (ทั้งหมด 20 เขต)"
                selectValue="สพป.ชัยนาท 1"
                progressValue={20}
              />
            </div>
          </div>
          <p>ระยะเวลาในการแสดงผล 1/1/2024, 12:19:25 PM - 1/31/2024, 12:19:25 PM</p>
        </div>
        <div className="datatables">
          <DataTable
            className="table-hover whitespace-nowrap"
            records={dataMock}
            columns={rowColumns}
            highlightOnHover
            withTableBorder
            withColumnBorders
            noRecordsText="ไม่พบข้อมูล"
            totalRecords={20}
            recordsPerPage={10}
            page={1}
            onPageChange={() => {}}
            onRecordsPerPageChange={(_recordsPerPage) => {}}
            recordsPerPageOptions={[10, 25, 50, 100]}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
            }
          />
        </div>
      </CWWhiteBox>
    </>
  );
};

export default DataTableSchool;
