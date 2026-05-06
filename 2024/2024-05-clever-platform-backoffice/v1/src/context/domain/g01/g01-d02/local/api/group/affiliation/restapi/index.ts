import { Affiliation } from '@domain/g01/g01-d02/local/type';
import { AffiliationRepository } from '../../../repository/affiliation';
import { DataAPIResponse, DataAPIRequest, PaginationAPIResponse } from '../../../helper';
import { AffiliationGroupType } from '../../../../type';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { FailedAPIResponse, getQueryParams } from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AffiliationRestAPI: AffiliationRepository = {
  Gets: function (query): Promise<PaginationAPIResponse<Affiliation>> {
    let url = `${BACKEND_URL}/school-affiliations/v1`;
    switch (query.school_affiliation_group) {
      case AffiliationGroupType.DOE:
        url = `${url}/doe`;
        break;
      case AffiliationGroupType.LAO:
        url = `${url}/lao`;
        break;
      case AffiliationGroupType.OBEC:
        url = `${url}/obec`;
        break;
      default:
        url = `${url}/`;
    }

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Affiliation>) => {
        return res;
      });
  },
  GetById: function (id: string): Promise<DataAPIResponse<Affiliation>> {
    const url = `${BACKEND_URL}/school-affiliations/v1/all/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<Affiliation[]>) => {
        // we assume only get single data but backend response as a array
        // we pull it out of array, tricky but worked
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Affiliation>;
        return res as DataAPIResponse<Affiliation>;
      })
      .then((res: DataAPIResponse<Affiliation>) => {
        return res;
      });
  },
  Create: function (
    affiliation: DataAPIRequest<Affiliation>,
  ): Promise<DataAPIResponse<Affiliation>> {
    let url = `${BACKEND_URL}/school-affiliations/v1`;
    switch (affiliation.school_affiliation_group) {
      case AffiliationGroupType.DOE:
        url = `${url}/doe`;
        break;
      case AffiliationGroupType.LAO:
        url = `${url}/lao`;
        break;
      case AffiliationGroupType.OBEC:
        url = `${url}/obec`;
        break;
      default:
        url = `${url}/`;
    }
    const body = JSON.stringify(affiliation);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Affiliation[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Affiliation>;
        return res as DataAPIResponse<Affiliation>;
      });
  },
  Update: function (
    affiliation: DataAPIRequest<Affiliation>,
  ): Promise<DataAPIResponse<Affiliation>> {
    const { id } = affiliation;
    let url = `${BACKEND_URL}/school-affiliations/v1`;
    switch (affiliation.school_affiliation_group) {
      case AffiliationGroupType.DOE:
        url = `${url}/doe/${id}`;
        break;
      case AffiliationGroupType.LAO:
        url = `${url}/lao/${id}`;
        break;
      case AffiliationGroupType.OBEC:
        url = `${url}/obec/${id}`;
        break;
      default:
        url = `${url}/${id}`;
    }
    const body = JSON.stringify(affiliation);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Affiliation>) => {
        // pull it out of array
        // note: when update succesfully, it response HTTP 200 OK
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Affiliation>;
        return res as DataAPIResponse<Affiliation>;
      });
  },
  Download: function (startDate: string, endDate: string): Promise<Blob> {
    const url = `${BACKEND_URL}/school-affiliations/v1/download/csv`;
    const params = `start_date=${startDate}&end_date=${endDate}`;

    return fetchWithAuth(url + '?' + params, {
      headers: {
        accept: 'text/csv',
      },
    }).then((res) => res.blob());
  },
  Upload: function (file: File): Promise<DataAPIResponse<null>> {
    const url = `${BACKEND_URL}/school-affiliations/v1/upload/csv`;
    const formData = new FormData();
    formData.append('csv_file', file);

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
  },
};

export default AffiliationRestAPI;
