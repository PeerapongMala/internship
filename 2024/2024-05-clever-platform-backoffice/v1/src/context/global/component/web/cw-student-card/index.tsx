import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { Link } from '@tanstack/react-router';

interface CWStudentCardProps {
  studentName: string;
  studentCode: string;
  schoolCode: string;
  schoolSubCode: string;
  urlBack?: string;
}

export default function CWStudentCard({
  studentName,
  studentCode,
  schoolCode,
  schoolSubCode,
  urlBack,
}: CWStudentCardProps) {
  return (
    <div className="flex flex-col gap-[10px] rounded-[10px] bg-neutral-100 p-[10px]">
      <div className="flex items-center gap-[10px]">
        <Link to={urlBack ? urlBack : '/teacher/student/all-student'}>
          <IconArrowBackward />
        </Link>{' '}
        <p className="text-xl font-bold">{studentName}</p>
      </div>
      <p className="text-sm">
        รหัสนักเรียน: {studentCode}, รหัสโรงเรียน: {schoolCode} (ตัวย่อ: {schoolSubCode})
      </p>
    </div>
  );
}
