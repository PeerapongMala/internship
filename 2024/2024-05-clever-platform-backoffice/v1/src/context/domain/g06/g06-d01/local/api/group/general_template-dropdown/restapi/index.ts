import fetchWithAuth from '@global/utils/fetchWithAuth';
import { PaginationAPIResponse } from '../../../helper/type';
import { GeneralTemplateDropdownRepository } from '../../../repository';
import { GeneralTemplateDropdown } from '../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const GeneralTemplateDropdownRestAPI: GeneralTemplateDropdownRepository = {
  Gets: function (
    school_id: number,
    query,
  ): Promise<PaginationAPIResponse<GeneralTemplateDropdown>> {
    const url = `${BACKEND_URL}/grade-system-template/v1/drop-down/${school_id}/general-template`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<GeneralTemplateDropdown>) => {
        return res;
      });
  },
};

export default GeneralTemplateDropdownRestAPI;
