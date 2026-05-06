import { RepositoryPatternInterface } from '../../../repository-pattern';
import OfflineHistoriesGet from './offline-histories-get';
import UploadedHistoriesGet from './uploaded-histories-get';

const UploadHistory: RepositoryPatternInterface['UploadHistory'] = {
  OfflineHistories: { Get: OfflineHistoriesGet },
  UploadedHistories: { Get: UploadedHistoriesGet },
};

export default UploadHistory;
