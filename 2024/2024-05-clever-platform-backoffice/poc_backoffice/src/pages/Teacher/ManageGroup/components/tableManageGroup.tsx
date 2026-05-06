import { DataItem } from '../interfaces/interface';

interface TableManageGroupProps {
    data: DataItem[];
    dataMaxLength: number;
}

const TableManageGroup: React.FC<TableManageGroupProps> = ({ data, dataMaxLength }) => {
    return (
        <table className="min-w-full bg-white">
            <thead>
                <tr className="bg-neutral-100 text-neutral-500">
                    <th>คน \ ข้อ</th>
                    {Array.from({ length: dataMaxLength - 2 }, (_, index) => (
                        <th key={index}>{index + 1}</th>
                    ))}
                    <th>X</th>
                    <th>X²</th>
                </tr>
            </thead>
            <tbody className="w-full">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ backgroundColor: row.colorHex }}>
                        <td className="font-bold pr-headtd w-full whitespace-nowrap">{row.id}</td>
                        {Array.from({ length: dataMaxLength }).map((_, index) => (
                            <td key={index} className={index >= dataMaxLength - 2 ? 'font-bold' : 'font-normal'}>
                                {row.values[index] !== undefined && row.values[index] !== null ? row.values[index] : ' '}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableManageGroup;
