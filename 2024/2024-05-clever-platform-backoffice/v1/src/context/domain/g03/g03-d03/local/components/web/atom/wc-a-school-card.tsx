interface WCASchoolCardProps {
  schoolName: string;
  schoolId: string;
  schoolAbbreviation: string;
}

export default function WCASchoolCard({
  schoolName,
  schoolId,
  schoolAbbreviation,
}: WCASchoolCardProps) {
  return (
    <div className="my-5 flex flex-col gap-[10px] rounded-[10px] bg-neutral-100 p-[10px]">
      <div className="flex gap-[10px]">
        <img alt="school_image" src="/public/logo192.png" className="h-6 w-6" />
        <p className="text-xl font-bold">{schoolName}</p>
      </div>
      <p className="text-sm">
        รหัสโรงเรียน: {schoolId} (ตัวย่อ: {schoolAbbreviation})
      </p>
    </div>
  );
}
