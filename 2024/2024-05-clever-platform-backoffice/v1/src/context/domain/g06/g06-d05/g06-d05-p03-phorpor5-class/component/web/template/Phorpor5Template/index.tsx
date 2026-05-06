import Header from '../../organism/Header';
import LearnerCompetencies from '../../organism/Table/LearnerCompetencies';
import ApprovalSection from '../../organism/ApprovalSection';
import FormDetail from '../../organism/FormDetail';
import { IGetPhorpor5Detail, Phorpor5Course } from '@domain/g06/g06-d05/local/api/type';
export interface Phorpor5TemplateProps {
  phorpor5CourseData: IGetPhorpor5Detail[];
  editable?: boolean;
  onDataChange?: (data: IGetPhorpor5Detail[]) => void;
}
export default function Phorpor5Template({
  phorpor5CourseData,
  editable = false,
  onDataChange,
}: Phorpor5TemplateProps) {
  return (
    <div className="w-[595px] bg-[#FFCCFF] p-5">
      {/* Header section */}
      <Header phorpor5Course={phorpor5CourseData} />

      {/* Form detail section */}
      <FormDetail
        phorpor5Course={phorpor5CourseData}
        editable={editable}
        onDataChange={onDataChange}
      />

      {/* Learner competencies table */}
      <LearnerCompetencies phorpor5Course={phorpor5CourseData} />

      {/* Approval section */}
      <ApprovalSection
        phorpor5Course={phorpor5CourseData}
        editable={editable}
        onDataChange={onDataChange}
      />
    </div>
  );
}
