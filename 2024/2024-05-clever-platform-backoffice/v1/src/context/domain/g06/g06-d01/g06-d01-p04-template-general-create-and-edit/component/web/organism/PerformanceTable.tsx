import { TExampleTableProps } from '@domain/g06/g06-d01/local/type/props';

type PerformanceTableProps = TExampleTableProps;

const PerformanceTable = ({ name }: PerformanceTableProps) => {
  return (
    <>
      <table className="w-full table-fixed border-collapse border-2 border-gray-200">
        <thead>
          <tr>
            <th
              colSpan={11}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              สรุปประเมินสมรรถนะ {name && ` - ${name}`}
              ชั้น xx ปีการศึกษา xxxx
            </th>
          </tr>
          <tr>
            <th
              rowSpan={3}
              className="border-2 border-gray-200 bg-stone-300 px-2 text-center text-sm"
            >
              ชื่อสกุล
            </th>
            <th
              rowSpan={3}
              className="border-2 border-gray-200 bg-stone-300 text-center text-xs"
            >
              วันที่
            </th>
            <th
              colSpan={9}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              สมรรถนะสำคัญของผู้เรียน
            </th>
          </tr>
          <tr>
            {[...Array(5).keys()].map((item, index) => (
              <th
                key={index}
                rowSpan={2}
                className="border-2 border-gray-200 bg-stone-300 text-center text-sm"
              >
                {index + 1}
              </th>
            ))}
            <th
              colSpan={4}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs"
            >
              ผลประเมิน
            </th>
          </tr>
          <tr>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs">ผ่าน</th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs">ไม่ผ่าน</th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs">ดี</th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs">
              ดีเยี่ยม
            </th>
          </tr>
        </thead>
      </table>
    </>
  );
};

export default PerformanceTable;
