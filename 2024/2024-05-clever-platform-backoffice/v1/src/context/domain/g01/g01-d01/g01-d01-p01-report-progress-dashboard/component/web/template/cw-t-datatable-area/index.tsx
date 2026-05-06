import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import ProgressSelectTemplate from '../../../organism/cw-o-select-with-data';

interface DataProp {
  id: number;
  district: string;
  area: string;
  progress: number;
}
const DataTableArea = () => {
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
      accessor: 'progress',
      title: 'ค่าความก้าวหน้า',
      render: (record: DataProp) => record.progress,
    },
  ];

  const dataMock = [
    { id: 1, district: 'เขตตรวจ 1', area: 'สพป.กรุงเทพมหานคร', progress: 20 },
    { id: 2, district: 'เขตตรวจ 1', area: 'สพป.นนทบุรี เขต 1', progress: 40 },
    { id: 3, district: 'เขตตรวจ 1', area: 'สพป.นนทบุรี เขต 2', progress: 60 },
    { id: 4, district: 'เขตตรวจ 1', area: 'สพป.พระนครศรีอยุธยา เขต 1', progress: 80 },
    { id: 5, district: 'เขตตรวจ 1', area: 'สพป.พระนครศรีอยุธยา เขต 2', progress: 50 },
  ];
  return (
    <>
      <h2 className="text-xl font-bold">Report ระดับโรงเรียน</h2>

      <CWWhiteBox>
        <div className="mb-3 flex flex-col gap-5">
          <CWButton className="w-40" icon={<IconDownload />} title={'Download'} />
          <h2 className="text-xl font-bold">เขตตรวจทั้งหมด (18)</h2>
          <div className="flex flex-row gap-5">
            <div className="w-1/3 gap-5 rounded-md bg-white px-3 py-5 shadow-md">
              <ProgressSelectTemplate
                title="เขตตรวจราชการ (ทั้งหมด 20 เขต)"
                selectValue="เขตตรวจ 1"
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

export default DataTableArea;
