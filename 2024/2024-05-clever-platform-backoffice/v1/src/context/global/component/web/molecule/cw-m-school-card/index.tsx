export interface CWMSchoolCardProps {
  name: string;
  code: string;
  subCode: string;
  image: string;
}

const CWMSchoolCard: React.FC<CWMSchoolCardProps> = ({
  name,
  code,
  subCode,
  image,
}: CWMSchoolCardProps) => {
  return (
    <div className="flex flex-col gap-[10px] rounded-[10px] bg-neutral-100 p-[10px]">
      <div className="flex gap-[10px]">
        <img alt="school_image" src={image} className="h-6 w-6" />
        <p className="text-xl font-bold">{name}</p>
      </div>
      <p className="text-sm">
        รหัสโรงเรียน: {code} (ตัวย่อ: {subCode})
      </p>
    </div>
  );
};

export default CWMSchoolCard;
