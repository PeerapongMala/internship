export interface SchoolCardProps {
  name: string;
  code: string;
  subCode: string;
  image?: string;
  className?: string;
}

const SchoolCard = ({ name, code, subCode, image, className = '' }: SchoolCardProps) => {
  return (
    <div
      className={`flex flex-col gap-[10px] rounded-[10px] bg-neutral-100 p-[10px] ${className}`}
    >
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

export default SchoolCard;
