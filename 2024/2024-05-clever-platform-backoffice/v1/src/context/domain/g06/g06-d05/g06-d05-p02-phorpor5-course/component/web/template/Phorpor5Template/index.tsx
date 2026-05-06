import Header from '../../organism/Header';
import LearnerCompetencies from '../../organism/Table/LearnerCompetencies';
import ApprovalSection from '../../organism/ApprovalSection';
import FormDetail from '../../organism/FormDetail';
import {
  IGetPhorpor5Detail,
  Phorpor5Class,
  Subject,
} from '@domain/g06/g06-d05/local/api/type';

export interface Phorpor5TemplateProps {
  phorpor5CourseData: IGetPhorpor5Detail[];
  editable?: boolean;
  selectedSubject?: Subject;
  onDataChange?: (data: IGetPhorpor5Detail[]) => void;
}
// million-ignore
export default function Phorpor5Template({
  phorpor5CourseData,
  selectedSubject,
  editable = false,
  onDataChange,
}: Phorpor5TemplateProps) {
  const filteredData = selectedSubject
    ? phorpor5CourseData.map((course) => {
      const filteredSubjects = (course.data_json as any).subject?.filter(
        (subj: Subject) => subj.id === selectedSubject.id,
      );
      return {
        ...course,
        data_json: {
          ...course.data_json,
          subject: filteredSubjects,
        },
      };
    })
    : phorpor5CourseData;

  return (
    <div className="w-[595px] bg-[#FFCCFF] p-5">
      <Header phorpor5Course={filteredData} />

      <FormDetail
        selectedSubjectID={selectedSubject?.id}
        phorpor5Course={filteredData}
        editable={editable}
        onDataChange={(updatedData) => onDataChange?.(updatedData)}
      />

      <LearnerCompetencies phorpor5Course={filteredData} />

      <ApprovalSection
        phorpor5Course={filteredData}
        editable={editable}
        onDataChange={(updatedData) => onDataChange?.(updatedData)}
      />
    </div>
  );
}
