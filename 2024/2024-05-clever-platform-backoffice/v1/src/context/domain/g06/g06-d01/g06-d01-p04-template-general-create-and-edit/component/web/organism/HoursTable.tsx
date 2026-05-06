import { TExampleTableProps } from '@domain/g06/g06-d01/local/type/props';

type HoursTableProps = TExampleTableProps;

const HoursTable = ({ name }: HoursTableProps) => {
  return (
    <>
      <table className="w-max table-fixed border-collapse border-2 border-gray-200">
        <thead>
          <tr>
            <th
              rowSpan={3}
              className="border-2 border-gray-200 bg-stone-300 px-2 text-sm"
            ></th>
          </tr>
          <tr>
            <th
              colSpan={35}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              เวลาเรียน {name && ` - ${name}`}
              ชั้น xx ปีการศึกษา xxxx
            </th>
          </tr>
          <tr>
            <th
              colSpan={35}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              {'{เดือน}{พ.ศ.}'}
            </th>
          </tr>
          <tr className="p-0 text-center">
            <th className="border-2 border-gray-200 bg-stone-300 px-2 text-sm">
              ชื่อสกุล
            </th>
            <th className="border-2 border-gray-200 bg-stone-300 text-xs">วันที่</th>
            {[...Array(31).keys()].map((item, index) => (
              <th
                key={index}
                className="border-2 border-gray-200 bg-stone-300 px-2 text-sm"
              >
                <p>{index + 1}</p>
              </th>
            ))}
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs">บ</th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs">ป</th>
            <th className="border-2 border-gray-200 bg-stone-300 p-0 text-xs">ล</th>
          </tr>
        </thead>
      </table>
    </>
  );
};

export default HoursTable;
