const ExampleTable = () => {
  return (
    <>
      <table className="h-max w-[500px] table-fixed border-collapse border-2 border-gray-200">
        <thead>
          <tr>
            <th
              colSpan={13}
              className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold"
            >
              คะแนนผลการเรียน
            </th>
          </tr>
          <tr className="h-[120px] p-0 text-center">
            {[
              'ภาษาไทย',
              'คณิตศาสตร์',
              'วิทยาศาสตร์และ...',
              'สังคมศึกษา ศา...',
              'ประวัติศาสตร์',
              'สุขศึกษาและพล...',
              'ศิลปะ',
              'การงานอาชีพ',
              'ภาษาต่างประเทศ',
              'ทุกหมวดรวม',
              '',
              '',
              '',
            ].map((subject, index) => (
              <th
                key={index}
                className="h-100 border-2 border-gray-200 bg-stone-300 pt-24 text-sm font-semibold"
              >
                <p className="origin-start rotate-[-90deg] transform whitespace-nowrap p-0">
                  {subject}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {new Array(13).fill('##').map((score, index) => (
              <td
                key={index}
                className="border-2 border-gray-200 bg-stone-300 p-0 text-center font-semibold text-blue-500"
              >
                {index < 10 && score}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default ExampleTable;
