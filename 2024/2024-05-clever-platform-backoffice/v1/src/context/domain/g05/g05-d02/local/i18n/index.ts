import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';

import en from '@external/i18n/domain/g04/g04d02/g04d02local/i18n/en/index.json';
import th from '@external/i18n/domain/g04/g04d02/g04d02local/i18n/th/index.json';
import ConfigJson from '../config/index.json';

const I18NInit: HelperI18NextInterface['I18NDomainInterface'] = {
  name: ConfigJson.key,
  locate: { en, th },
};

export default I18NInit;
