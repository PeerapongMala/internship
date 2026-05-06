import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';

import en from '@external/i18n/domain/g03/g03-d02/g03-d02-p02-sort-fill-group/i18n/en/index.json';
import th from '@external/i18n/domain/g03/g03-d02/g03-d02-p02-sort-fill-group/i18n/th/index.json';
import zh from '@external/i18n/domain/g03/g03-d02/g03-d02-p02-sort-fill-group/i18n/zh/index.json';
import enMain from '@external/i18n/domain/g03/g03-d02/g03-d02-p02/i18n/en/index.json';
import thMain from '@external/i18n/domain/g03/g03-d02/g03-d02-p02/i18n/th/index.json';
import zhMain from '@external/i18n/domain/g03/g03-d02/g03-d02-p02/i18n/zh/index.json';
import ConfigJson from '../config/index.json';

const I18NInit: HelperI18NextInterface['I18NDomainInterface'] = {
  name: ConfigJson.key,
  locate: {
    en: {
      ...enMain,
      ...en,
    },
    th: {
      ...thMain,
      ...th,
    },
    zh: {
      ...zhMain,
      ...zh,
    },
  },
};

export default I18NInit;
