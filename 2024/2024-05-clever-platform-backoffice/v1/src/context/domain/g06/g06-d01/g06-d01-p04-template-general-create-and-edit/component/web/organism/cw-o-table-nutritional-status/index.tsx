import { TExampleTableProps } from '@domain/g06/g06-d01/local/type/props';
import dayjs from 'dayjs';

type TableNutritionalStatusProps = TExampleTableProps;

const TableNutritionalStatus = ({ name }: TableNutritionalStatusProps) => {
  const titles = [
    'น้ำหนัก',
    'ส่วนสูง',
    'น้ำหนักตามเกณฑ​์อายุ',
    'ส่วนสูงตามเกณฑ​์อายุ',
    'น้ำหนักตามเกณฑ​์ส่วนสูง',
  ];

  const datas = [
    [
      { date: dayjs('12-04-2019'), titles: titles },
      { date: dayjs('07-10-2019'), titles: titles },
    ],
    [
      { date: dayjs('19-11-2019'), titles: titles },
      { date: dayjs('09-04-2020'), titles: titles },
    ],
  ];

  return (
    <table className="w-full table-fixed border-collapse border-2 border-gray-200">
      <thead>
        <tr>
          <th
            colSpan={30}
            className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
          >
            ผลการประเมินภาวะโภชนาการ {name && ` - ${name}`}
            ชั้น xx ปีการศึกษา xxxx
          </th>
        </tr>
        <tr>
          <th
            colSpan={10}
            rowSpan={4}
            className="border-2 border-gray-200 bg-stone-300 px-2 text-center text-sm"
          >
            ชื่อสกุล
          </th>

          {datas.map((_, i) => (
            <th
              colSpan={10}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              ภาคเรียนที่ {i + 1}
            </th>
          ))}
        </tr>
        <tr>
          {datas.map((data) =>
            data.map((time, i) => (
              <th
                colSpan={5}
                className="border-2 border-gray-200 bg-stone-300 py-2 text-center font-semibold"
              >
                ครั้งที่ {i + 1}
              </th>
            )),
          )}
        </tr>

        <tr>
          {datas.map((data) =>
            data.map((time, i) => (
              <th
                colSpan={5}
                className="border-2 border-gray-200 bg-stone-300 p-0 py-2 text-center font-normal"
              >
                {i === 0
                  ? time.date.format('DD MMM YYYY')
                  : time.date.format('DD MMM YYYY')}
              </th>
            )),
          )}
        </tr>

        <tr>
          {datas.map((data) =>
            data.map((time, i) =>
              time.titles.map((title) => (
                <th
                  colSpan={1}
                  className="rotate-180 transform border-2 border-gray-200 bg-stone-300 p-0 py-2.5 text-center font-normal [writing-mode:vertical-rl]"
                >
                  {title}
                </th>
              )),
            ),
          )}
        </tr>
      </thead>
    </table>
  );
};

export default TableNutritionalStatus;
