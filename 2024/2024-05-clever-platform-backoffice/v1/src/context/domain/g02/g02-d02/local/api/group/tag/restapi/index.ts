import { ITag, ITagCreate, ITagPatch } from '@domain/g02/g02-d02/local/type';
import { TagRepository } from '../../../repository/tag';
import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const TagRestAPI: TagRepository = {
  GetByTagId: function (tagId: number): Promise<DataAPIResponse<ITag[]>> {
    const url = `${BACKEND_URL}/academic-courses/v1/tags/${tagId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<ITag[]>) => {
        return res;
      });
  },
  Create: function (data: ITagCreate): Promise<DataAPIResponse<ITag>> {
    const url = `${BACKEND_URL}/academic-courses/v1/tags`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<ITag>) => {
        return res;
      });
  },
  Patch: function (data: ITagPatch): Promise<DataAPIResponse<ITag>> {
    const url = `${BACKEND_URL}/academic-courses/v1/tags/${data.id}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<ITag>) => {
        return res;
      });
  },
};

export default TagRestAPI;
