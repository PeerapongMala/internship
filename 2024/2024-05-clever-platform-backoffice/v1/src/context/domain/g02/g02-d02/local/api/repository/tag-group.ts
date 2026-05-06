import { ITagGroup, ITagGroupPatch } from '../../type';
import { FailedAPIResponse, DataAPIResponse } from '@global/utils/apiResponseHelper';

export interface TagGroupRepository {
  GetAll(subjectId: number): Promise<DataAPIResponse<ITagGroup[]> | FailedAPIResponse>;
  Patch(data: ITagGroupPatch): Promise<DataAPIResponse<ITagGroup> | FailedAPIResponse>;
}
