export interface AttendanceRow {
  month: string;
  totalDays: string | number;
  attendedDays: string | number;
  percentage: string | number;
  notes?: string;
}

interface AttendanceTableProps {
  data: AttendanceRow[];
  className?: string;
}

const AttendanceTable = ({ data, className = '' }: AttendanceTableProps) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 p-3 text-center font-medium">เดือน</th>
            <th className="border border-gray-200 p-3 text-center font-medium">
              เวลาเต็ม
              <br />
              (วัน)
            </th>
            <th className="border border-gray-200 p-3 text-center font-medium">
              เวลามา
              <br />
              (วัน)
            </th>
            <th className="border border-gray-200 p-3 text-center font-medium">
              คิดเป็น
              <br />
              ร้อยละ
            </th>
            <th className="border border-gray-200 p-3 text-center font-medium">
              หมายเหตุ
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-200 p-3 text-left">{row.month}</td>
              <td className="border border-gray-200 p-3 text-center">{row.totalDays}</td>
              <td className="border border-gray-200 p-3 text-center">
                {row.attendedDays}
              </td>
              <td className="border border-gray-200 p-3 text-center">
                {typeof row.percentage === 'number'
                  ? (isFinite(row.percentage) ? row.percentage : '-')
                  : row.percentage}
              </td>
              <td className="border border-gray-200 p-3 text-center">
                {row.notes || ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
