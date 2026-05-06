import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';
import ConfigJson from '../config/index.json';
import en from './en/index.json';
import th from './th/index.json';

const I18NInit: HelperI18NextInterface['I18NDomainInterface'] = {
  name: ConfigJson.key,
  locate: { en, th },
};

export default I18NInit;
