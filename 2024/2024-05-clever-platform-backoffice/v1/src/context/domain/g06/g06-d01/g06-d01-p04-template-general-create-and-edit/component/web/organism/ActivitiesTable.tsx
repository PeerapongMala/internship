import { TExampleTableProps } from '@domain/g06/g06-d01/local/type/props';

type ActivitiesTableProps = TExampleTableProps;

const ActivitiesTable = ({ name }: ActivitiesTableProps) => {
  return (
    <>
      <table className="w-full table-fixed border-collapse border-2 border-gray-200">
        <thead>
          <tr>
            <th
              colSpan={11}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              สรุปประเมินกิจกรรมพัฒนาผู้เรียน {name && ` - ${name}`}
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
              colSpan={2}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              แนะแนว
            </th>
            <th
              colSpan={2}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              ลูกเสือ-เนตรนารี
            </th>
            <th
              colSpan={3}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              ชุมนุม
            </th>
            <th
              colSpan={2}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              กิจกรรมเพื่อสังคมและสาธารณะประโยชน์
            </th>
          </tr>
          <tr>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs">
              ผ่าน
            </th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs">
              ไม่ผ่าน
            </th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs">
              ผ่าน
            </th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs">
              ไม่ผ่าน
            </th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs">
              ชื่อชุมนุม
            </th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs">
              ผ่าน
            </th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs">
              ไม่ผ่าน
            </th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs">
              ผ่าน
            </th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-center text-xs">
              ไม่ผ่าน
            </th>
          </tr>
        </thead>
      </table>
    </>
  );
};

export default ActivitiesTable;
