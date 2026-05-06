import { PaginationAPIResponse } from '@core/helper/api-type';

export interface AchievementRepository {
  Gets: (subjectId: string) => Promise<PaginationAPIResponse<any>>;
}
