import TemplateContentSubjectSetting from '@domain/g06/local/components/web/template/cw-t-template-content-subject-setting';
import { TContentSubject } from '@domain/g06/local/types/content';

type TemplateManagerThirdPageProps = {
  disabledEdit?: boolean;
  hidden?: boolean;
  contentSubjects: TContentSubject[];
  onContentSubjectsChange?: (subject: TContentSubject[]) => void;
};

const TemplateManagerThirdPage = ({
  hidden,
  disabledEdit,
  contentSubjects,
  onContentSubjectsChange,
}: TemplateManagerThirdPageProps) => {
  return (
    <div hidden={hidden} className="">
      <TemplateContentSubjectSetting
        disabledEdit={disabledEdit}
        contentSubjects={contentSubjects}
        onContentSubjectsChange={onContentSubjectsChange}
      />
    </div>
  );
};

export default TemplateManagerThirdPage;
