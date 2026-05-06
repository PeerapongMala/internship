import { Affiliation, AffiliationGroupType, UseStatus } from '../../type';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  DataAPIRequest,
  PaginationAPIResponse,
} from '../helper';

export type AffiliationFilterQueryParams = (BasePaginationAPIQueryParams & {
  status?: UseStatus;
}) &
  (
    | {
        school_affiliation_group: AffiliationGroupType.DOE;
        type?: string;
        district_zone?: string;
        district?: string;
      }
    | {
        school_affiliation_group: AffiliationGroupType.LAO;
        lao_type?: string;
        province?: string;
        district?: string;
        sub_district?: string;
      }
    | {
        school_affiliation_group: AffiliationGroupType.OBEC;
        type?: string;
        inspection_area?: string;
        area_office?: string;
      }
    | {
        school_affiliation_group: AffiliationGroupType.OPEC | AffiliationGroupType.OTHER;
        type?: string;
      }
  );

export interface AffiliationRepository {
  Gets(query: AffiliationFilterQueryParams): Promise<PaginationAPIResponse<Affiliation>>;
  GetById(id: string): Promise<DataAPIResponse<Affiliation>>;
  Create(affiliation: DataAPIRequest<Affiliation>): Promise<DataAPIResponse<Affiliation>>;
  Update(affiliation: DataAPIRequest<Affiliation>): Promise<DataAPIResponse<Affiliation>>;
  Download(startDate: string, endDate: string): Promise<Blob>;
  Upload(file: File): Promise<DataAPIResponse<null>>;
}
