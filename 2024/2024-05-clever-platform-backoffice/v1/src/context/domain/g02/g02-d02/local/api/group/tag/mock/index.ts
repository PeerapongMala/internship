import { ITag, ITagCreate, ITagPatch } from '@domain/g02/g02-d02/local/type';
import { FailedAPIResponse, DataAPIResponse } from '@global/utils/apiResponseHelper';
import { TagRepository } from '@domain/g02/g02-d02/local/api/repository/tag';

import GetByTagIdMockJson from './get-by-tag-id/index.json';
import CreateMockJson from './create/index.json';
import PatchMockJson from './patch/index.json';

const TagMock: TagRepository = {
  GetByTagId: (tagId: number): Promise<DataAPIResponse<ITag[]> | FailedAPIResponse> => {
    return new Promise((resolve) => {
      resolve(GetByTagIdMockJson as DataAPIResponse<ITag[]>);
    });
  },
  Create: (data: ITagCreate): Promise<DataAPIResponse<ITag> | FailedAPIResponse> => {
    return new Promise((resolve) => {
      resolve(CreateMockJson as DataAPIResponse<ITag>);
    });
  },
  Patch: (data: ITagPatch): Promise<DataAPIResponse<ITag> | FailedAPIResponse> => {
    return new Promise((resolve) => {
      resolve(PatchMockJson as DataAPIResponse<ITag>);
    });
  },
};

export default TagMock;
