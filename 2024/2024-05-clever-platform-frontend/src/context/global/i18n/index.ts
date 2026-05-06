import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';

import en from '../../../external/i18n/global/i18n/en/index.json';
import th from '../../../external/i18n/global/i18n/th/index.json';
import zh from '../../../external/i18n/global/i18n/zh/index.json';

const I18NInit = ({
  name = '',
}: {
  name: string;
}): HelperI18NextInterface['I18NDomainInterface'] => {
  return {
    name: name,
    locate: { en, th, zh },
  };
};

export default I18NInit;
