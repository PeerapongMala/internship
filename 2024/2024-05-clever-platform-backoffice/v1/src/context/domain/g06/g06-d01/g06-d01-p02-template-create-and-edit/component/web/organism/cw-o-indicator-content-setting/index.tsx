import TemplateContentSubjectSetting from '@domain/g06/local/components/web/template/cw-t-template-content-subject-setting';
import { Subjects } from '@domain/g06/g06-d01/local/api/type';

type IndicatorContentSettingProps = {
  subjects: Subjects[];
  onSubjectsChange: (subjects: Subjects[]) => void;
};

const IndicatorContentSetting = ({
  subjects,
  onSubjectsChange,
}: IndicatorContentSettingProps) => {
  return (
    <TemplateContentSubjectSetting
      contentSubjects={subjects}
      onContentSubjectsChange={(contentSubjects) =>
        onSubjectsChange(
          contentSubjects.map((s) => ({
            ...s,
            learning_area: s.learning_area ?? null,
            subject_no: s.subject_no ?? null,
            hours: s.hours ?? null,
          })),
        )
      }
    />
  );
};

export default IndicatorContentSetting;
