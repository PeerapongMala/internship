import { ITagGroup, ITagGroupPatch } from '@domain/g02/g02-d02/local/type';
import { FailedAPIResponse, DataAPIResponse } from '@global/utils/apiResponseHelper';
import { TagGroupRepository } from '@domain/g02/g02-d02/local/api/repository/tag-group';

import GetAllMockJson from './get-all/index.json';

const TagGroupMock: TagGroupRepository = {
  GetAll: (
    subjectId: number,
  ): Promise<DataAPIResponse<ITagGroup[]> | FailedAPIResponse> => {
    return new Promise((resolve) => {
      resolve(GetAllMockJson as DataAPIResponse<ITagGroup[]>);
    });
  },
  Patch: (
    data: ITagGroupPatch,
  ): Promise<DataAPIResponse<ITagGroup> | FailedAPIResponse> => {
    return new Promise((resolve) => {
      resolve(GetAllMockJson as DataAPIResponse<ITagGroup>);
    });
  },
};

export default TagGroupMock;
