import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { SubjectShop } from '../type';

export interface SubjectRepository {
  Get(query?: BasePaginationAPIQueryParams): Promise<PaginationAPIResponse<SubjectShop>>;
  GetById(subjectId: SubjectShop['subject_id']): Promise<DataAPIResponse<SubjectShop>>;
}
