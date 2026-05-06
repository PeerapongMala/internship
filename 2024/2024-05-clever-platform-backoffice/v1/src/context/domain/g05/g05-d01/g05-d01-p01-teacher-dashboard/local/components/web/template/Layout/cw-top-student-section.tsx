import { DashboradProp } from '../../../../type';
import CWTableMax from '../Table/cw-max-table';

export const CWTopStudentsSection = ({
  academicYear,
  year,
  classroom,
  subject_id,
  lesson_id,
}: DashboradProp) => (
  <div className="w-full">
    <CWTableMax
      academicYear={academicYear}
      year={year}
      classroom={classroom ?? []}
      subject_id={subject_id ?? []}
      lesson_id={lesson_id ?? []}
    />
  </div>
);
