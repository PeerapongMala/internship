import { ISeedSubjectGroup } from '../../type';
import {
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface SeedSubjectGroupRepository {
  GetAll(): Promise<PaginationAPIResponse<ISeedSubjectGroup> | FailedAPIResponse>;
}
