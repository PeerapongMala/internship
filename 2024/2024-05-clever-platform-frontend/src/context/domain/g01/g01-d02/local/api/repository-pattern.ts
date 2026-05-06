import { BaseAPIResponse, DataAPIResponse } from '@core/helper/api-type';

export interface RepositoryPatternInterface {
  Terms: {
    AcceptAcceptance(): Promise<BaseAPIResponse>;
    CheckAcceptance(): Promise<DataAPIResponse<boolean>>;
    Get(): Promise<DataAPIResponse<TermOfService>>;
  };
}
