import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';


import ConfigJson from '../config/index.json';

const I18NInit: HelperI18NextInterface['I18NDomainInterface'] = {
  name: ConfigJson.key,
  locate: {},
};

export default I18NInit;
