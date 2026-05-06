import en from '@external/i18n/domain/g01/g01d01/G01D01P01/i18n/en/index.json';
import th from '@external/i18n/domain/g01/g01d01/G01D01P01/i18n/th/index.json';
import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';

import ConfigJson from '../config/index.json';

const I18NInit: HelperI18NextInterface['I18NDomainInterface'] = {
  name: ConfigJson.key,
  locate: {},
};

export default I18NInit;
