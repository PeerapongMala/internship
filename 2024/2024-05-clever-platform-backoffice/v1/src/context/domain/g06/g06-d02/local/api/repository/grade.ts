import { AxiosError, AxiosResponse } from 'axios';
import { TBasePaginationResponse, TBaseResponse } from '../../types';
import { TEvaluationForm, TEvaluationSheet } from '../../types/grade';
import { getEvaluationFormList } from '../group/grade/get-evaluation-form/restapi';
import {
  TGetDropdownEvaluationTemplateReq,
  TGetDropdownEvaluationTemplateRes,
  TGetEvaluationFormListReq,
  TGetGradeResponsiblePersonRes,
  TGetSubjectListAndDetailRes,
  TPatchBulkEvaluationForm,
  TPatchEvaluationForm,
  TPostEvaluationFormReq,
  TPutGradeResponsiblePersonReq,
  TPatchSubjectListAndDetailByIDRes,
  TGetListEvaluationSheetReq,
  TGetListEvaluationSheetRes,
  TPatchEvaluationSheetReq,
  TPatchEvaluationSheetRes,
  TPatchEvaluationFormIndicatorReq,
  TPatchEvaluationFormIndicatorRes,
} from '../helper/grade';
import { patchEvaluationForm } from '../group/grade/patch-evaluation-form/restapi';
import { patchBulkEvaluationForm } from '../group/grade/patch-bulk-evaluation-form/restapi';
import { csvEvaluationFormDownload } from '../group/grade/csv-evaluation-form-download/restapi';
import { csvEvaluationFormUpload } from '../group/grade/csv-evaluation-form-upload/restapi';
import { Dayjs } from 'dayjs';
import { getDropdownEvaluationTemplate } from '../group/grade/get-dropdown-template/restapi';
import { getEvaluationFormByID } from '../group/grade/get-evaluation-form-by-id/restapi';
import { postEvaluationFormCreate } from '../group/grade/post-evaluation-form-create/restapi';
import { putGradeResponsiblePerson } from '../group/grade/put-grade-responsible-person/restapi';
import { getGradeResponsiblePersonByEvaluationID } from '../group/grade/get-grade-responsible-person-by-evaluation-form-id/restapi';
import { getSubjectListAndDetailByEvaluationFormID } from '../group/grade/a10-get-subject-list-and-detail';
import { patchUpdateSubjectByEvaluationFormID } from '../group/grade/a09-update-subject-by-evaluation-form-id/restapi';
import { TContentSubject } from '@domain/g06/local/types/content';
import { postEvaluationFormSubmit } from '../group/grade/a11-post-api-evaluation-form-submit/restapi';
import { getListEvaluationSheet } from '../group/grade/a16-get-list-evaluation-sheet/restapi';
import { patchEvaluationSheet } from '../group/grade/a17-patch-evaluation-sheet-update/restapi';
import { TBaseErrorResponse } from '@global/types/api';
import { patchIndicatorByID } from '../group/grade/a18-update-indicator-by-id';

export interface GradeRepository {
  GetEvaluationFormList: (
    params: TGetEvaluationFormListReq,
    controller?: AbortController,
  ) => Promise<TBasePaginationResponse<TEvaluationForm>>;
  GetEvaluationFormByID: (
    id: number,
    onError?: (error: AxiosError) => void,
  ) => Promise<AxiosResponse<Pick<TBaseResponse<TEvaluationForm>, 'data'>>>;
  PostEvaluationForm: (
    body: TPostEvaluationFormReq,
    onError?: (err: AxiosError) => void,
  ) => Promise<AxiosResponse<TBaseResponse<Partial<TEvaluationForm>>>>;
  PatchEvaluationForm: (
    id: number,
    body: TPatchEvaluationForm,
  ) => Promise<AxiosResponse<Omit<TBaseResponse, 'data'>>>;
  PatchBulkEvaluationForm: (
    items: TPatchBulkEvaluationForm,
  ) => Promise<AxiosResponse<Omit<TBaseResponse, 'data'>, any>>;
  CsvEvaluationFormDownload: (
    schoolID: string,
    startDate: Dayjs,
    endDate: Dayjs,
    limit?: number,
  ) => Promise<Blob>;
  CsvEvaluationFormUpload: (
    schoolID: string,
    file: File,
  ) => Promise<AxiosResponse<Omit<TBaseResponse, 'data'>, any>>;
  GetDropdownEvaluationTemplate: (
    req: TGetDropdownEvaluationTemplateReq,
    onError?: (error: unknown) => void,
  ) => Promise<TBasePaginationResponse<TGetDropdownEvaluationTemplateRes>>;
  GetGradeResponsiblePersonByEvaluationID: (
    evaluationFormID: number,
    onError?: (error: AxiosError) => void,
  ) => Promise<AxiosResponse<TGetGradeResponsiblePersonRes, any>>;
  PutGradeResponsiblePerson: (
    evaluationFormID: number,
    body: TPutGradeResponsiblePersonReq,
    onError?: (err: AxiosError) => void,
  ) => Promise<AxiosResponse<Omit<TBaseResponse, 'data'>, any>>;
  GetSubjectListAndDetailByEvaluationFormID: (
    evaluationFormID: number,
    onError?: (error: AxiosError) => void,
  ) => Promise<TGetSubjectListAndDetailRes>;
  PatchUpdateSubjectByEvaluationFormID: (
    evaluationFormId: number,
    body: TContentSubject[],
    onError?: (error: AxiosError) => void,
  ) => Promise<AxiosResponse<TPatchSubjectListAndDetailByIDRes, any>>;
  PostEvaluationFormSubmit: (
    evaluationFormID: number,
  ) => Promise<AxiosResponse<Omit<TBaseResponse, 'data'>, any>>;
  GetListEvaluationSheet: (
    params: TGetListEvaluationSheetReq,
  ) => Promise<AxiosResponse<TBasePaginationResponse<TEvaluationSheet>, any>>;
  PatchEvaluationSheet: (
    evaluationSheetId: number,
    body: TPatchEvaluationSheetReq,
  ) => Promise<AxiosResponse<TPatchEvaluationSheetRes, any>>;
  PatchIndicatorByID: (
    id: number,
    body: TPatchEvaluationFormIndicatorReq,
  ) => Promise<AxiosResponse<TPatchEvaluationFormIndicatorRes, any>>;
}

export const gradeRepository: GradeRepository = {
  GetEvaluationFormList: getEvaluationFormList,
  PostEvaluationForm: postEvaluationFormCreate,
  GetEvaluationFormByID: getEvaluationFormByID,
  PatchEvaluationForm: patchEvaluationForm,
  PatchBulkEvaluationForm: patchBulkEvaluationForm,
  CsvEvaluationFormDownload: csvEvaluationFormDownload,
  CsvEvaluationFormUpload: csvEvaluationFormUpload,
  GetDropdownEvaluationTemplate: getDropdownEvaluationTemplate,
  PutGradeResponsiblePerson: putGradeResponsiblePerson,
  GetGradeResponsiblePersonByEvaluationID: getGradeResponsiblePersonByEvaluationID,
  GetSubjectListAndDetailByEvaluationFormID: getSubjectListAndDetailByEvaluationFormID,
  PatchUpdateSubjectByEvaluationFormID: patchUpdateSubjectByEvaluationFormID,
  PostEvaluationFormSubmit: postEvaluationFormSubmit,
  GetListEvaluationSheet: getListEvaluationSheet,
  PatchEvaluationSheet: patchEvaluationSheet,
  PatchIndicatorByID: patchIndicatorByID,
};
