import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';

import en from '@external/i18n/domain/g03/g03-d07/g03-d07-local/i18n/en/index.json';
import th from '@external/i18n/domain/g03/g03-d07/g03-d07-local/i18n/th/index.json';
import zh from '@external/i18n/domain/g03/g03-d07/g03-d07-local/i18n/zh/index.json';
import ConfigJson from '../config/index.json';

const I18NInit: HelperI18NextInterface['I18NDomainInterface'] = {
  name: ConfigJson.key,
  locate: { en, th, zh },
};

export default I18NInit;
