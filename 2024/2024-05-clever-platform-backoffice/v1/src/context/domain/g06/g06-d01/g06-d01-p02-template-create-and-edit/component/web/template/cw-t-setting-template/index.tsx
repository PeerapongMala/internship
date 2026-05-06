import { Template } from '@domain/g06/g06-d01/g06-d01-p02-template-create-and-edit';
import { Dispatch, SetStateAction } from 'react';
import ContentSetting from '../ContentSetting';
import Publish from '../Publish';
import TemplateInfo from '../TemplateInfo';
import IndicatorContentSetting from '../../organism/cw-o-indicator-content-setting';

interface StepComponentProps {
  currentStep: number;
  template: Template;
  setTemplate: Dispatch<SetStateAction<Template>>;
}

const SettingTemplate: React.FC<StepComponentProps> = (props) => {
  const { currentStep, template, setTemplate } = props;
  switch (currentStep) {
    case 1:
      return (
        <TemplateInfo
          template={template}
          onTemplateChange={(value) => setTemplate(value)}
        />
      );
    case 2:
      return (
        <div className="my-4">
          <IndicatorContentSetting
            subjects={template.subjects}
            onSubjectsChange={(subjects) => {
              setTemplate((prev) => ({ ...prev, subjects: subjects }));
            }}
          />
        </div>
      );
    case 3:
      return <Publish template={template} />;
    default:
      return null;
  }
};

export default SettingTemplate;
