import { TExampleTableProps } from '@domain/g06/g06-d01/local/type/props';

type CharacteristicTableProps = TExampleTableProps;

const CharacteristicTable = ({ name }: CharacteristicTableProps) => {
  return (
    <table className="w-max table-fixed border-collapse border-2 border-gray-200">
      <thead>
        <tr>
          <th
            colSpan={25}
            className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
          >
            สรุปประเมินคุณลักษณะอันพึงประสงค์ {name && ` - ${name}`}
            xx ปีการศึกษา xxxx
          </th>
        </tr>
        <tr>
          <th
            rowSpan={3}
            className="h-100 border-2 border-gray-200 bg-stone-300 pt-24 text-center text-xs font-semibold"
          >
            ชื่อสกุล
          </th>
          <th
            rowSpan={3}
            className="h-100 border-2 border-gray-200 bg-stone-300 pt-24 text-center text-xs font-semibold"
          >
            เลขที่
          </th>
          <th
            colSpan={23}
            className="border-2 border-gray-200 bg-stone-300 text-center text-xs font-semibold"
          >
            <div className="flex justify-around">
              <p>คุณลักษณะอันพึงประสงค์</p>
              <p>อ่าน คิดวิเคราะห์ และเขียนสื่อความ</p>
            </div>
          </th>
        </tr>
        <tr>
          {[...Array(10).keys()].map((item, index) => (
            <th className="border-2 border-b-0 border-gray-200 bg-stone-300"></th>
          ))}
          <th
            colSpan={4}
            className="border-2 border-gray-200 bg-stone-300 text-center text-xs font-semibold"
          >
            ผลการประเมิน
          </th>
          {[...Array(5).keys()].map((item, index) => (
            <th className="border-2 border-b-0 border-gray-200 bg-stone-300"></th>
          ))}
          <th
            colSpan={4}
            className="border-2 border-gray-200 bg-stone-300 text-center text-xs font-semibold"
          >
            ผลการประเมิน
          </th>
        </tr>
        <tr className="h-[120px] p-0 text-center">
          {[
            'รักชาติ',
            'ซื่อสัตย์',
            'มีวินัย',
            'ใฝ่เรียนรู้',
            'พอเพียง',
            'มุ่งมั่น',
            'เป็นไทย',
            'สาธารณะ',
            '',
            '',
          ].map((subject, index) => (
            <th
              rowSpan={2}
              key={index}
              className="h-[120px] min-w-[50px] border-2 border-t-0 border-gray-200 bg-stone-300 px-0 pt-14 text-xs font-semibold"
            >
              <p className="origin-start rotate-[-90deg] transform">{subject}</p>
            </th>
          ))}

          <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs font-semibold">
            ผ่าน
          </th>
          <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs font-semibold">
            ไม่ผ่าน
          </th>
          <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs font-semibold">
            ดี
          </th>
          <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs font-semibold">
            ดีเยี่ยม
          </th>

          {['1', '2', '3', '4', '5'].map((number, index) => (
            <th
              rowSpan={2}
              key={index}
              className="border-2 border-t-0 border-gray-200 bg-stone-300 text-xs font-semibold"
            >
              <p className="text-center">{number}</p>
            </th>
          ))}

          {/* Second set of headers for results */}
          <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs font-semibold">
            ผ่าน
          </th>
          <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs font-semibold">
            ไม่ผ่าน
          </th>
          <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs font-semibold">
            ดี
          </th>
          <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs font-semibold">
            ดีเยี่ยม
          </th>
        </tr>
      </thead>
    </table>
  );
};

export default CharacteristicTable;
