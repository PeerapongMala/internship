import CWAccordionManager from '@component/web/molecule/cw-m-accordion-manager';
import ItemContentSubjectSetting from '../../organism/cw-o-item-content-subject-setting';
import { TContentSubject } from '@domain/g06/local/types/content';
import CWWhiteBox from '@component/web/cw-white-box';

type TemplateContentSubjectSettingProps = {
  isAcademicContext?: boolean;
  contentSubjects: TContentSubject[];
  onContentSubjectsChange?: (subject: TContentSubject[]) => void;
  disabledEdit?: boolean;
};

const TemplateContentSubjectSetting = ({
  isAcademicContext,
  disabledEdit,
  contentSubjects,
  onContentSubjectsChange,
}: TemplateContentSubjectSettingProps) => {
  const handleContentSubjectChange = (updatedSubject: TContentSubject) => {
    const subjects = contentSubjects.map((subject) => {
      if (subject.id === updatedSubject.id) {
        return updatedSubject;
      }
      return subject;
    });

    onContentSubjectsChange?.(subjects);
  };

  return isAcademicContext ? (
    contentSubjects.map((subject, index) => (
      <CWWhiteBox key={`subject-academic-setting-${index}`}>
        <ItemContentSubjectSetting
          isAcademicContext={isAcademicContext}
          disabledEdit={disabledEdit}
          contentSubject={subject}
          onContentSubjectChange={handleContentSubjectChange}
        />
      </CWWhiteBox>
    ))
  ) : (
    <CWAccordionManager
      accordionLists={contentSubjects.map((subject, i) => ({
        title: `วิชาที่ ${i + 1} : ${subject.subject_name}`,
        render: (
          <ItemContentSubjectSetting
            key={`subject-setting-${i}`}
            disabledEdit={disabledEdit}
            contentSubject={subject}
            onContentSubjectChange={handleContentSubjectChange}
          />
        ),
      }))}
    />
  );
};
export default TemplateContentSubjectSetting;
