import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { IPlatform, IPlatformBase } from '../../type';
import { ICurriculum } from '@domain/g01/g01-d03/local/type';

export interface PlatformFilterQueryParams extends BasePaginationAPIQueryParams {
  search?: string;
  platform_name?: string;
}

export interface PlatformRepository {
  Create(platform: DataAPIRequest<IPlatformBase>): Promise<DataAPIResponse<IPlatform>>;
  Update(
    platformId: IPlatform['id'],
    platform: DataAPIRequest<IPlatformBase>,
  ): Promise<DataAPIResponse<IPlatform>>;
  Get(
    curriculumGroupId: ICurriculum['id'],
    query?: PlatformFilterQueryParams,
  ): Promise<PaginationAPIResponse<IPlatform>>;
  GetById(platformId: IPlatform['id']): Promise<DataAPIResponse<IPlatform>>;
  BulkEdit(
    platforms: Pick<IPlatform, 'id' | 'status'>[],
    admin_login_as?: string,
  ): Promise<DataAPIResponse<undefined>>;
}
