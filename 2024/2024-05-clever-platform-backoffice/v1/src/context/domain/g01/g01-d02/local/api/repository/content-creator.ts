import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { ContentCreator, CurriculumGroup } from '../../type';

export interface ContentCreatorFilterQueryParams extends BasePaginationAPIQueryParams {
  curriculum_group_id?: CurriculumGroup['id'];
  id?: ContentCreator['id'];
  email?: ContentCreator['email'];
  title?: ContentCreator['title'];
  first_name?: ContentCreator['first_name'];
  last_name?: ContentCreator['last_name'];
}

export interface ContentCreatorRepository {
  Get(
    query?: ContentCreatorFilterQueryParams,
  ): Promise<PaginationAPIResponse<ContentCreator>>;
  Update(
    curriculumGrouopId: CurriculumGroup['id'],
    action: 'add' | 'remove',
    content_creator_ids: ContentCreator['id'][],
  ): Promise<BaseAPIResponse>;
  DownloadCSV(
    curriculumGrouopId: CurriculumGroup['id'],
    query?: {
      start_date?: string;
      end_date?: string;
    },
  ): Promise<Blob | FailedAPIResponse>;
}
