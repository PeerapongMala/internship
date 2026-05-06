import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import ProgressSelectTemplate from '../../../organism/cw-o-select-with-data';
import CWSelect from '@component/web/cw-select';
import CWInputSearch from '@component/web/cw-input-search';

interface DataProp {
  id: number;
  district: string;
  area: string;
  school: string;
  progressClass4: number;
  progressClass5: number;
  progressClass6: number;
}
const DataTableSchoolClass = () => {
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
      accessor: 'progressClass4',
      title: 'ค่าความก้าวหน้า ป.4',
      render: (record: DataProp) => record.progressClass4,
    },
    {
      accessor: 'progressClass5',
      title: 'ค่าความก้าวหน้า ป.5',
      render: (record: DataProp) => record.progressClass5,
    },
    {
      accessor: 'progressClass6',
      title: 'ค่าความก้าวหน้า ป.6',
      render: (record: DataProp) => record.progressClass6,
    },
  ];

  const dataMock = [
    {
      id: 1,
      district: 'เขตตรวจ 2',
      area: 'สพป.ชัยนาท',
      school: 'วัดศรีมลคล(สถิตมงคลราษฏร์อุปถัมท์',
      progressClass4: 0,
      progressClass5: 0,
      progressClass6: 0,
    },
  ];
  return (
    <>
      <h2 className="text-xl font-bold">Report ระดับสำนักงานเขตพื้นที่การศึกษา</h2>

      <CWWhiteBox>
        <div className="mb-3 flex flex-col gap-5">
          <div className="flex w-full justify-between">
            <div className="flex justify-start">
              <CWButton className="w-40" icon={<IconDownload />} title={'Download'} />
            </div>
            <div className="flex justify-end">
              <CWInputSearch placeholder={'ค้นหา'} className="" />
            </div>
          </div>

          <div className="flex flex-row gap-5">
            <div className="w-1/3 gap-5">
              <h1>เขคตรวจทั้งหมด</h1>
              <CWSelect title="เขตตรวจ 2" className="pt-4" />
            </div>
            <div className="w-1/3 gap-5">
              <h1>เขตพื้นที่ทั้งหมด</h1>
              <CWSelect title="สพป.ชัยนาท 1" className="pt-4" />
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

export default DataTableSchoolClass;
