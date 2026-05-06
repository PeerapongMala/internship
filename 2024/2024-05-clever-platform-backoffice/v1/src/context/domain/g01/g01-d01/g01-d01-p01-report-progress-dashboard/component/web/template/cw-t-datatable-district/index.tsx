import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';

interface DataProp {
  id: number;
  district: string;
  progress: number;
}
const DataTableDistrict = () => {
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
      accessor: 'progress',
      title: 'ค่าความก้าวหน้า',
      render: (record: DataProp) => record.progress,
    },
  ];

  const dataMock = [
    {
      id: 1,
      district: 'เขตตรวจ 1',
      progress: 20,
    },
    {
      id: 2,
      district: 'เขตตรวจ 2',
      progress: 30,
    },
    {
      id: 3,
      district: 'เขตตรวจ 3',
      progress: 40,
    },
    {
      id: 4,
      district: 'เขตตรวจ 4',
      progress: 50,
    },
    {
      id: 5,
      district: 'เขตตรวจ 5',
      progress: 60,
    },
    {
      id: 6,
      district: 'เขตตรวจ 6',
      progress: 70,
    },
    {
      id: 7,
      district: 'เขตตรวจ 7',
      progress: 80,
    },
    {
      id: 8,
      district: 'เขตตรวจ 8',
      progress: 90,
    },
    {
      id: 9,
      district: 'เขตตรวจ 9',
      progress: 100,
    },
    {
      id: 10,
      district: 'เขตตรวจ 10',
      progress: 10,
    },
    {
      id: 11,
      district: 'เขตตรวจ 11',
      progress: 20,
    },
    {
      id: 12,
      district: 'เขตตรวจ 12',
      progress: 30,
    },
    {
      id: 13,
      district: 'เขตตรวจ 13',
      progress: 40,
    },
    {
      id: 14,
      district: 'เขตตรวจ 14',
      progress: 50,
    },
    {
      id: 15,
      district: 'เขตตรวจ 15',
      progress: 60,
    },
    {
      id: 16,
      district: 'เขตตรวจ 16',
      progress: 70,
    },
    {
      id: 17,
      district: 'เขตตรวจ 17',
      progress: 80,
    },
    {
      id: 18,
      district: 'เขตตรวจ 18',
      progress: 90,
    },
    {
      id: 19,
      district: 'เขตตรวจ 19',
      progress: 100,
    },
  ];
  return (
    <>
      <h2 className="text-xl font-bold">Report ระดับเขตตรวจราชการ</h2>

      <CWWhiteBox>
        <div className="mb-3 flex flex-col gap-5">
          <CWButton className="w-40" icon={<IconDownload />} title={'Download'} />
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

export default DataTableDistrict;
