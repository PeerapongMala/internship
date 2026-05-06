import { AxiosResponse } from 'axios';
import {
  TGetIndicatorSubjectTemplateByIDRes,
  TGetListSubjectTemplateReq,
  TGetListSubjectTemplateRes,
  TPostSubjectTemplateBulkEditBody,
  TPostSubjectTemplateCreateBody,
  TPostSubjectTemplateCreateRes,
  TPostSubjectTemplateUpdateBody,
} from '../helpers/subject-template';
import { getSubjectTemplateLists } from '../group/subject-template/a02-api-subject-template-list';
import { TBaseResponse } from '@global/types/api';
import { postSubjectTemplateBulkEdit } from '../group/subject-template/a04-api-subject-template-case-bulk-edit';
import { postSubjectTemplateCreate } from '../group/subject-template/a01-api-subject-template-create';
import { postSubjectTemplateUpdate } from '../group/subject-template/a03-api-subject-template-update';
import { getIndicatorSubjectTemplateByID } from '../group/subject-template/a05-api-subject-template-indicator-get';

interface SubjectTemplateRepository {
  GetSubjectTemplateLists: (
    params: TGetListSubjectTemplateReq,
  ) => Promise<AxiosResponse<TGetListSubjectTemplateRes, any>>;
  GetSubjectTemplateIndicatorByID: (
    id: number,
  ) => Promise<AxiosResponse<TGetIndicatorSubjectTemplateByIDRes, any>>;
  PostSubjectTemplateCreate: (
    body: TPostSubjectTemplateCreateBody,
  ) => Promise<AxiosResponse<TBaseResponse<TPostSubjectTemplateCreateRes[]>, any>>;
  PostSubjectTemplateUpdate: (
    id: number,
    body: TPostSubjectTemplateUpdateBody,
  ) => Promise<AxiosResponse<TBaseResponse<undefined>, any>>;
  PostSubjectTemplateBulkEdit(
    body: TPostSubjectTemplateBulkEditBody,
  ): Promise<AxiosResponse<TBaseResponse<undefined>, any>>;
}

export const SubjectTemplateRepository: SubjectTemplateRepository = {
  GetSubjectTemplateLists: getSubjectTemplateLists,
  GetSubjectTemplateIndicatorByID: getIndicatorSubjectTemplateByID,
  PostSubjectTemplateCreate: postSubjectTemplateCreate,
  PostSubjectTemplateUpdate: postSubjectTemplateUpdate,
  PostSubjectTemplateBulkEdit: postSubjectTemplateBulkEdit,
};
