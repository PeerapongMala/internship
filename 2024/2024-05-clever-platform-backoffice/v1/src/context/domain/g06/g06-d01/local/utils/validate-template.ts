import { Template } from '../../g06-d01-p02-template-create-and-edit';
import { TErrorInfos } from '@component/web/cw-modal/cw-modal-error-infos/type';

const CONTEXT_TEMPLATE = 'Template';

export function validateTemplate(template: Template, errors: TErrorInfos[]) {
  if (!template.template_name) {
    errors.push({ context: CONTEXT_TEMPLATE, message: 'กรุณากรอกชื่อ Template' });
  }

  if (!template?.year) {
    errors.push({ context: CONTEXT_TEMPLATE, message: 'กรุณาเลือก ชั้นปี' });
  }
}
