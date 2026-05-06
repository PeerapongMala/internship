import {
  TextTranslation,
  TranslateTextAny,
  TranslateTextRecord,
  TranslateTextStatusType,
} from '../../type';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '../helper';

export interface AcademicTranslationFilterQueryParams
  extends BasePaginationAPIQueryParams {
  text?: string;
  language?: string;
  status?: TranslateTextStatusType | '';
}

export interface AcademicTranslationRepository {
  GetG02D06A01(
    curriculumGroupId: string,
    query: AcademicTranslationFilterQueryParams,
  ): Promise<PaginationAPIResponse<TranslateTextRecord>>;
  CreateG02D06A02(
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TranslateTextAny>>;
  GetG02D06A03(curriculumGroupId: string, query: TranslateTextAny): Promise<void>;
  UploadG02D06A04(
    curriculumGroupId: string,
    formData: FormData,
  ): Promise<DataAPIResponse<TranslateTextAny>>;
  CreateG02D06A06(
    curriculumGroupId: string,
    formData: FormData,
  ): Promise<DataAPIResponse<TextTranslation>>;
  UpdateG02D06A07(
    curriculumGroupId: string,
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TextTranslation>>;
  GetG02D06A08(groupId: string): Promise<DataAPIResponse<TextTranslation>>;
  UpdateG02D06A09(
    groupId: string,
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TranslateTextAny>>;
  UpdateG02D06A10(
    groupId: string,
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TranslateTextAny>>;
  UpdateG02D06A11(
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TextTranslation>>;
  UpdateG02D06A12(
    groupId: string,
    textObject: Partial<TranslateTextAny>,
  ): Promise<DataAPIResponse<TextTranslation>>;
}
