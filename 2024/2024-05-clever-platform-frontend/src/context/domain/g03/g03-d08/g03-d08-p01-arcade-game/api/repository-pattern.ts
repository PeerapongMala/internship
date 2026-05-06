import { PaginationAPIResponse } from '@core/helper/api-type';
import { MinigameList } from '../type';

export interface RepositoryPatternInterface {
  MinigameList: {
    Minigame: { Get(): Promise<PaginationAPIResponse<MinigameList>> };
  };
}
