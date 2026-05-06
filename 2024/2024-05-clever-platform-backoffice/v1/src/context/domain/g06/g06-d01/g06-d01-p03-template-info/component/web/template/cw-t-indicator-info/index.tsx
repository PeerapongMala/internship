import CWWhiteBox from '@component/web/cw-white-box';
import TemplateContentSubjectSetting from '@domain/g06/local/components/web/template/cw-t-template-content-subject-setting';
import { TContentSubject } from '@domain/g06/local/types/content';

type IndicatorInfoProps = {
  subjects: TContentSubject[];
};

const IndicatorInfo = ({ subjects }: IndicatorInfoProps) => {
  return (
    <CWWhiteBox>
      <TemplateContentSubjectSetting disabledEdit contentSubjects={subjects} />
    </CWWhiteBox>
  );
};

export default IndicatorInfo;
