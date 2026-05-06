import ActivitiesTable from '../../organism/ActivitiesTable';
import CharacteristicTable from '../../organism/CharacteristicTable';
import HoursTable from '../../organism/HoursTable';
import PerformanceTable from '../../organism/PerformanceTable';
import CWAccordionBox from '@component/web/atom/cw-a-accordion-box';
import { ReactNode, useState } from 'react';
import { EGradeTemplateType } from '@domain/g06/local/enums/evaluation';
import TableNutritionalStatus from '../../organism/cw-o-table-nutritional-status';

type ExampleTemplateProps = {
  templateType?: EGradeTemplateType;
  templateName?: string;
};

const ExampleTemplate = ({ templateType, templateName }: ExampleTemplateProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const contentMap: Record<EGradeTemplateType, ReactNode> = {
    [EGradeTemplateType.STUDY_TIME]: <HoursTable name={templateName} />,
    [EGradeTemplateType.DESIRED_TRAITS]: <CharacteristicTable name={templateName} />,
    [EGradeTemplateType.COMPETENCY]: <PerformanceTable name={templateName} />,
    [EGradeTemplateType.STUDENT_DEVELOPMENT]: <ActivitiesTable name={templateName} />,
    [EGradeTemplateType.NUTRITIONAL_STATUS]: (
      <TableNutritionalStatus name={templateName} />
    ),
  };

  return (
    <ul className="mx-auto my-5 w-full rounded border bg-white shadow-md">
      <li>
        <CWAccordionBox title="ตัวอย่าง" isOpen={isOpen} onToggleOpen={setIsOpen}>
          {templateType && contentMap[templateType]}
        </CWAccordionBox>
      </li>
    </ul>
  );
};

export default ExampleTemplate;
