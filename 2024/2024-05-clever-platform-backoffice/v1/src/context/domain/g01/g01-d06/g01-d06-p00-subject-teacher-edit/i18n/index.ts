import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';
import th from '@external/i18n/domain/g01/g01d06/g01d06p00/i18n/th/index.json';

import ConfigJson from '../config/index.json';

const I18NInit: HelperI18NextInterface['I18NDomainInterface'] = {
  name: ConfigJson.key,
  locate: { th },
};

export default I18NInit;
