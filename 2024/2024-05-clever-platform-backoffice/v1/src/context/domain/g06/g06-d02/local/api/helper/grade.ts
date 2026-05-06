import {
  TPaginationReq,
  TBasePaginationResponse,
  TBaseResponse,
} from '@domain/g06/g06-d02/local/types';
import {
  TEvaluationForm,
  TEvaluationFormGetListFilter,
  TEvaluationSheet,
  TEvaluationTemplate,
  TGradeResponsiblePerson,
} from '@domain/g06/g06-d02/local/types/grade';
import { EEvaluationFormStatus, EEvaluationSheetStatus } from '../../enums/evaluation';
import { AxiosResponse } from 'axios';
import {
  TContentIndicator,
  TContentIndicatorSetting,
  TContentSubject,
} from '@domain/g06/local/types/content';

export type TGetEvaluationFormListReq = TPaginationReq &
  TEvaluationFormGetListFilter & {
    schoolID: string;
  };
export type TGetEvaluationFormListRes = TBasePaginationResponse<
  Omit<TEvaluationForm, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
  }
>;

export type TPostEvaluationFormReq = Partial<Omit<TEvaluationForm, 'id'>> & {
  school_id: number;
  template_id: number;
  is_lock: boolean;
  status: EEvaluationFormStatus;
};

export type TPatchEvaluationForm = Partial<Omit<TEvaluationForm, 'id'>>;
export type TPatchBulkEvaluationForm = (Partial<Omit<TEvaluationForm, 'id'>> & {
  id: number;
})[];

export type TGetDropdownEvaluationTemplateReq = TPaginationReq & {
  school_id: string;
  year?: string;
};
export type TGetDropdownEvaluationTemplateRes = TEvaluationTemplate;

export type TGetGradeResponsiblePersonRes = Pick<
  TBaseResponse<TGradeResponsiblePerson[]>,
  'data'
>;
export type TPutGradeResponsiblePersonReq = TGradeResponsiblePerson[];

export type TGetSubjectListAndDetailRes = AxiosResponse<TBaseResponse<TContentSubject[]>>;
export type TPatchSubjectListAndDetailByIDRes = Omit<TBaseResponse, 'data'>;

export type TGetListEvaluationSheetReq = TPaginationReq &
  Partial<TEvaluationSheet> & {
    sort_by?: keyof TEvaluationSheet | 'only_subject' | string;
    sort_order?: 'ASC' | 'DESC';
    only_subject?: boolean;
  };
export type TGetListEvaluationSheetRes = TBasePaginationResponse<
  Omit<TEvaluationSheet, 'updated_at' | 'created_at'> & {
    updated_at?: string | null;
    created_at?: string | null;
  }
>;

export type TPatchEvaluationSheetReq = {
  is_lock?: boolean;
  status?: EEvaluationSheetStatus;
};

export type TPatchEvaluationSheetRes = Pick<
  TBasePaginationResponse,
  'status_code' | 'message'
>;

type TPatchEvaluationFormIndicatorSettings = Partial<TContentIndicatorSetting>;
export type TPatchEvaluationFormIndicatorReq = Omit<
  TContentIndicator,
  'id' | 'setting'
> & { setting: TPatchEvaluationFormIndicatorSettings[] };
export type TPatchEvaluationFormIndicatorRes = TBaseResponse<TContentIndicator[]>;
