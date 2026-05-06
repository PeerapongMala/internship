import fetchWithAuth from '@global/utils/fetchWithAuth';
import { DataAPIResponse } from '../../../helper';
import { SubjectsRepository } from '../../../repository';
import { SubjectContent } from '../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const SubjectsRestAPI: SubjectsRepository = {
  Gets: function (template_id: number): Promise<DataAPIResponse<SubjectContent>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/subject/${template_id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<SubjectContent>) => {
        return res as DataAPIResponse<SubjectContent>;
      });
  },

  Update: function (
    template_id: number,
    subjects: Partial<SubjectContent>[],
  ): Promise<DataAPIResponse<SubjectContent>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/subject/${template_id}`;

    const body = JSON.stringify({ data: subjects });

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SubjectContent>) => {
        return res;
      });
  },
};

export default SubjectsRestAPI;
