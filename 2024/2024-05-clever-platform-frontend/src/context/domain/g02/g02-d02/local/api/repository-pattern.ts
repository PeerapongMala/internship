import { DataAPIResponse } from '@core/helper/api-type';
import { SubjectListItem } from '../type';

export interface RepositoryPatternInterface {
  Subject: {
    SubjectSelection: {
      Get(): Promise<DataAPIResponse<SubjectListItem[]>>;
    };
  };
}
