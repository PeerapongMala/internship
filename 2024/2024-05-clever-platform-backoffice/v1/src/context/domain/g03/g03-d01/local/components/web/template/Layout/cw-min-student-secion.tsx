import { DashboradProp } from '@domain/g03/g03-d01/local/type';
import CWTableMin from '../Table/cw-min-table';

export const CWMinStudentsSection = ({
  academicYear,
  year,
  classroom,
  subject_id,
  lesson_id,
}: DashboradProp) => (
  <div className="w-full">
    <CWTableMin
      academicYear={academicYear}
      year={year}
      classroom={classroom ?? []}
      subject_id={subject_id ?? []}
      lesson_id={lesson_id ?? []}
    />
  </div>
);
