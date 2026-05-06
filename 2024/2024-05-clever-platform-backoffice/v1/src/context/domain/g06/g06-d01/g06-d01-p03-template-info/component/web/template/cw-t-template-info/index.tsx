import { TTemplate } from '@domain/g06/g06-d01/local/type/template';
import InfoComponent from '@domain/g06/g06-d01/g06-d01-p02-template-create-and-edit/component/web/template/TemplateInfo';

type TemplateInfoProps = {
  template: TTemplate;
};

const TemplateInfo = ({ template }: TemplateInfoProps) => {
  return (
    <div className="flex flex-col gap-8">
      <InfoComponent disabledEdit template={template} />
    </div>
  );
};

export default TemplateInfo;
