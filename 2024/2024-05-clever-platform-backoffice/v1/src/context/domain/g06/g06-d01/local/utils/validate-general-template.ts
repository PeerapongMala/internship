import { TErrorInfos } from '@component/web/cw-modal/cw-modal-error-infos/type';
import { GeneralTemplate } from '../../g06-d01-p02-template-create-and-edit';
import { EGradeTemplateType } from '@domain/g06/local/enums/evaluation';

const CONTEXT_GENERAL_TEMPLATE = 'Template แบบประเมินทั่วไป';

export function validateGeneralTemplate(
  inputTemplates: GeneralTemplate[],
  errors: TErrorInfos[],
) {
  const templates = inputTemplates.filter((t) => !!t.general_template_id);

  // Validate STUDY_TIME
  if (!templates.find((t) => t.template_type === EGradeTemplateType.STUDY_TIME)) {
    errors.push({
      context: CONTEXT_GENERAL_TEMPLATE,
      message: `กรุณาเลือก Template ${EGradeTemplateType.STUDY_TIME}`,
    });
  }

  // Validate DESIRED_TRAITS
  if (!templates.find((t) => t.template_type === EGradeTemplateType.DESIRED_TRAITS)) {
    errors.push({
      context: CONTEXT_GENERAL_TEMPLATE,
      message: `กรุณาเลือก Template ${EGradeTemplateType.DESIRED_TRAITS}`,
    });
  }

  // Validate COMPETENCY
  if (!templates.find((t) => t.template_type === EGradeTemplateType.COMPETENCY)) {
    errors.push({
      context: CONTEXT_GENERAL_TEMPLATE,
      message: `กรุณาเลือก Template ${EGradeTemplateType.COMPETENCY}`,
    });
  }

  // Validate STUDENT_DEVELOPMENT
  if (
    !templates.find((t) => t.template_type === EGradeTemplateType.STUDENT_DEVELOPMENT)
  ) {
    errors.push({
      context: CONTEXT_GENERAL_TEMPLATE,
      message: `กรุณาเลือก Template ${EGradeTemplateType.STUDENT_DEVELOPMENT}`,
    });
  }

  // Validate NUTRITIONAL_STATUS
  if (!templates.find((t) => t.template_type === EGradeTemplateType.NUTRITIONAL_STATUS)) {
    errors.push({
      context: CONTEXT_GENERAL_TEMPLATE,
      message: `กรุณาเลือก Template ${EGradeTemplateType.NUTRITIONAL_STATUS}`,
    });
  }
}
