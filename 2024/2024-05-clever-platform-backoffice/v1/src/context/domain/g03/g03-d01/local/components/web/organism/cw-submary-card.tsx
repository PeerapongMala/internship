import { TotalStudent } from '../../../type';

export interface SummaryCardsProps {
  responsible: string;
  totalStudent?: TotalStudent | null;
}
const CWSummaryCards = ({ responsible, totalStudent }: SummaryCardsProps) => {
  return (
    <div className="grid w-full grid-cols-4 gap-5">
      <div className="flex flex-col gap-5 rounded-md bg-white px-3 py-5 shadow-md">
        <h1 className="text-[16px]">ระดับชั้นที่รับผิดชอบ</h1>
        <p className="text-[28px]">{responsible ?? '-'}</p>
      </div>

      <div className="flex flex-col gap-5 rounded-md bg-white px-3 py-5 shadow-md">
        <h1 className="text-[16px]">นักเรียนทั้งหมด (คน)</h1>
        <p className="text-[28px]">{totalStudent?.student_count ?? 0}</p>
      </div>
    </div>
  );
};

export default CWSummaryCards;
