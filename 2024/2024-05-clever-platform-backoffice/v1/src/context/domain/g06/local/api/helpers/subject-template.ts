import {
  TBasePaginationResponse,
  TBaseResponse,
  TPaginationReq,
} from '@global/types/api';
import {
  TSubjectTemplate,
  TSubjectTemplateIndicator,
} from '../../types/subject-template';
import { EStatus } from '@global/enums';

export type TGetListSubjectTemplateReq = TPaginationReq & {
  name?: string;
  seed_year_id?: number;
  subject_id?: number;
  status?: EStatus;
  id?: number;
  include_indicators?: boolean;
  curriculum_group_id?: number;
};
export type TGetListSubjectTemplateRes = TBasePaginationResponse<TSubjectTemplate>;

export type TGetIndicatorSubjectTemplateByIDRes = TBaseResponse<
  TSubjectTemplateIndicator[]
>;

export type TPostSubjectTemplateBulkEditBody = {
  bulk_edit_list: Pick<TSubjectTemplate, 'id' | 'status'>[];
};

export type TPostSubjectTemplateCreateBody = Pick<
  TSubjectTemplate,
  'name' | 'seed_year_id' | 'subject_id' | 'wizard_index'
>;
export type TPostSubjectTemplateCreateRes = Pick<TSubjectTemplate, 'id'>;

export type TPostSubjectTemplateUpdateBody = Partial<TSubjectTemplate> & {
  is_indicator_update?: boolean; // true ถ้ามีการ update indicators
};
