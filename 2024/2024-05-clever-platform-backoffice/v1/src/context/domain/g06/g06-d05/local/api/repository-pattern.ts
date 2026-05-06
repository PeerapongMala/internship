import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  GetEvaluationForm,
  IGetPhorpor5Detail,
  IGetPhorpor5List,
  IUpdatePhorpor5Request,
} from './type';
export interface FilterQueryParams extends BasePaginationAPIQueryParams {}
export interface RepositoryPatternInterface {
  CreatePhorpor5: (id: number) => Promise<BaseAPIResponse | undefined>;
  GetDetailPhorpor5: (
    evaluationFormId: number,
    phorpor5Id: number,
    query: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<IGetPhorpor5Detail> | undefined>;
  UpdateDetailPhorpor5: (
    evaluationFormId: number,
    data: IGetPhorpor5Detail[],
  ) => Promise<BaseAPIResponse | undefined>;
  GetPhorpor5List: (
    evaluationFormId: number,
  ) => Promise<DataAPIResponse<IGetPhorpor5List[]> | undefined>;
  GetEvaluation: (
    evaluationFormId: number,
  ) => Promise<DataAPIResponse<GetEvaluationForm>>;
}
