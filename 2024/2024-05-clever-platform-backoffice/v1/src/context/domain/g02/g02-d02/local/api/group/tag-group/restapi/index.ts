import {
  ITag,
  ITagCreate,
  ITagGroup,
  ITagGroupPatch,
} from '@domain/g02/g02-d02/local/type';
import { TagGroupRepository } from '../../../repository/tag-group';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const TagGroupRestAPI: TagGroupRepository = {
  GetAll: function (subjectId: number): Promise<DataAPIResponse<ITagGroup[]>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${subjectId}/tags`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<ITagGroup[]>) => {
        return res;
      });
  },
  Patch: function (data: ITagGroupPatch): Promise<DataAPIResponse<ITagGroup>> {
    const url = `${BACKEND_URL}/academic-courses/v1/tag-groups/${data.id}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<ITagGroup>) => {
        return res;
      });
  },
};

export default TagGroupRestAPI;
