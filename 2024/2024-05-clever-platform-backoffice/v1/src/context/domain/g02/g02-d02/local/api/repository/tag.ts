import { ITag, ITagCreate, ITagPatch } from '../../type';
import { FailedAPIResponse, DataAPIResponse } from '@global/utils/apiResponseHelper';

export interface TagRepository {
  GetByTagId(tagId: number): Promise<DataAPIResponse<ITag[]> | FailedAPIResponse>;
  Create(data: ITagCreate): Promise<DataAPIResponse<ITag> | FailedAPIResponse>;
  Patch(data: ITagPatch): Promise<DataAPIResponse<ITag> | FailedAPIResponse>;
}
