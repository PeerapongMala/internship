import { IGetPhorpor5Detail } from '@domain/g06/g06-d05/local/api/type';

export interface FormDetailProps {
  selectedSubjectID?: number;
  phorpor5Course: IGetPhorpor5Detail[];
  editable?: boolean;
  onDataChange?: (data: IGetPhorpor5Detail[]) => void;
}

export default function Header({ phorpor5Course }: FormDetailProps) {
  const schoolName =
    phorpor5Course[0]?.data_json && 'school_name' in phorpor5Course[0].data_json
      ? (phorpor5Course[0].data_json as { school_name: string }).school_name
      : 'โรงเรียนไม่ระบุชื่อ';
  const schoolArea =
    phorpor5Course[0]?.data_json && 'school_area' in phorpor5Course[0].data_json
      ? (phorpor5Course[0].data_json as { school_area: string }).school_area
      : 'โรงเรียนไม่ระบุชื่อ';

  return (
    <div className="">
      <h1 className="text-center text-xl font-bold">
        สมุดบันทึกการพัฒนาคุณภาพผู้เรียน (ปพ.5)
      </h1>
      <h2 className="text-center text-[18px] font-bold">{schoolName}</h2>
      <h2 className="text-center text-[18px] font-bold">{schoolArea}</h2>
    </div>
  );
}
