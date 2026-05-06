
import DomainG01D04P01UploadRoute from '../g01-d04-p01-upload/route';
import DomainG01D04P01UploadLessonRoute from '../g01-d04-p02-upload-lesson/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG01D04P01UploadRoute, routePath: routePath + 'upload' },
  { domain: DomainG01D04P01UploadLessonRoute, routePath: routePath + 'show-lesson' },
];

const DomainG01D04 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D04;
