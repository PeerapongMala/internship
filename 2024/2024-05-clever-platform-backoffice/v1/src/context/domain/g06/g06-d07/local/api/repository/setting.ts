import { uploadStudentInformation } from '../groups/a01-student-information-upload';
import { TBasePaginationResponse, TBaseResponse } from '@domain/g06/g06-d02/local/types';
import { AxiosResponse } from 'axios';
import {
  TGetGradeSettingStudentInfoDownloadReq,
  TGetListGradeSettingStudentAddressReq,
  TGetListGradeSettingStudentInfoReq,
  TGetListGradeSettingTemplateInfoReq,
  TPostGradeSettingStudentInfoReq,
  TPostGradeSettingStudentInfoUploadReq,
} from '../types/grade-setting';
import { TStudent, TStudentAdditionalInfo } from '../../types/students';
import { getListStudentInformation } from '../groups/a03-get-list-student-information-';
import { downloadStudentInformation } from '../groups/a02-student-information-download';
import { getStudentInformation } from '../groups/a10-student-information-get';
import { postStudentUpdate } from '../groups/a05-student-information-update';
import { getListStudentAdditionalInfo } from '../groups/a07-student-additional-info';
import { getDocumentTemplate } from '../groups/template-get';
import { TDocumentTemplate } from '../../types/template';
import { postDocumentTemplate } from '../groups/template-post';
import { patchDocumentTemplateUpdate } from '../groups/template-patch';

export interface SettingRepository {
  UploadStudentInformation: (
    body: TPostGradeSettingStudentInfoUploadReq,
  ) => Promise<AxiosResponse<TBaseResponse>>;
  DownloadStudentInformation: (
    params: TGetGradeSettingStudentInfoDownloadReq,
  ) => Promise<AxiosResponse<Blob, any>>;
  GetListStudentInformation: (
    params: TGetListGradeSettingStudentInfoReq,
  ) => Promise<AxiosResponse<TBasePaginationResponse<TStudent>, any>>;
  GetStudentInformation: (
    id: number,
  ) => Promise<AxiosResponse<TBaseResponse<TStudent>, any>>;
  PostStudentUpdate: (
    id: number,
    body: TPostGradeSettingStudentInfoReq,
  ) => Promise<AxiosResponse<TBaseResponse<TStudent>, any>>;
  GetListStudentAdditionalInfo: (
    params: TGetListGradeSettingStudentAddressReq,
  ) => Promise<AxiosResponse<TBasePaginationResponse<TStudentAdditionalInfo>, any>>;
  GetListDocumentTemplate: (
    params: TGetListGradeSettingTemplateInfoReq,
  ) => Promise<AxiosResponse<TBasePaginationResponse<TDocumentTemplate>, any>>;
  PostDocumentTemplate: (
    body: Partial<TDocumentTemplate>,
  ) => Promise<AxiosResponse<TBaseResponse>>;
  PatchDocumentTemplateUpdate: (
    template_id: string,
    body: Partial<TDocumentTemplate>,
  ) => Promise<AxiosResponse<TBaseResponse>>;

  // UpdateStudentInformation: () => Promise<DataAPIResponse<any>>;
  // GetStudentAddressList: () => Promise<DataAPIResponse<any>>;
  // GetDocumentTemplateList: () => Promise<DataAPIResponse<any>>;
  // UpdateDocumentTemplate: () => Promise<DataAPIResponse<any>>;
}

export const GradeSettingRepository: SettingRepository = {
  UploadStudentInformation: uploadStudentInformation,
  DownloadStudentInformation: downloadStudentInformation,
  GetListStudentInformation: getListStudentInformation,
  GetStudentInformation: getStudentInformation,
  PostStudentUpdate: postStudentUpdate,
  GetListStudentAdditionalInfo: getListStudentAdditionalInfo,
  GetListDocumentTemplate: getDocumentTemplate,
  PostDocumentTemplate: postDocumentTemplate,
  PatchDocumentTemplateUpdate: patchDocumentTemplateUpdate,
};
