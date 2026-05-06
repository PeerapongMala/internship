import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import { TGradeResponsiblePerson } from '@domain/g06/g06-d02/local/types/grade';
import AccordionManager from '@global/component/web/molecule/cw-m-accordion-manager';
import ResponsibleManageItem from '@domain/g06/g06-d02/g06-d02-p03-evaluation-form-edit/components/web/molecule/cw-m-responsible-manage-item';

type TemplateManagerSecondPageProps = {
  hidden?: boolean;
  responsibleLists: TGradeResponsiblePerson[];
  onResponsiblePersonChange?: (responsibleLists: TGradeResponsiblePerson[]) => void;
};

const TemplateManagerSecondPage = ({
  hidden,
  responsibleLists,
  onResponsiblePersonChange,
}: TemplateManagerSecondPageProps) => {
  const handleUpdateResponsiblePerson = (responsible: TGradeResponsiblePerson) => {
    onResponsiblePersonChange?.(
      responsibleLists.map((list) => {
        if (list.id === responsible.id && list.type === responsible.type) {
          return responsible;
        }

        return list;
      }),
    );
  };

  return (
    <div className={cn('flex flex-col gap-5', hidden ? 'hidden' : '')}>
      <AccordionManager
        accordionLists={responsibleLists.map((item) => ({
          title: item.name,
          render: (
            <ResponsibleManageItem
              item={item}
              onUpdateResponsiblePerson={handleUpdateResponsiblePerson}
            />
          ),
        }))}
      />
    </div>
  );
};

export default TemplateManagerSecondPage;
